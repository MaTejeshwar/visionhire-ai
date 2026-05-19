from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import uuid
import shutil
import logging
from typing import List, Optional

from app.config import settings
from app.services import parser, scorer, mock_generator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Database (for monorepo demonstration)
DB = {
    "job_description": (
        "We are looking for a Senior Full Stack Engineer to lead our frontend and backend development. "
        "The ideal candidate has 5+ years of experience with Python (FastAPI or Django) and React/Next.js. "
        "Experience with Docker, CI/CD pipelines, and AWS is required. "
        "Strong leadership skills and a Bachelor's or Master's degree in Computer Science is preferred."
    ),
    "candidates": {}  # candidate_id -> parsed_profile
}

class JobDescriptionUpdate(BaseModel):
    text: str

class CompareRequest(BaseModel):
    candidate_ids: List[str]

@app.get("/")
def read_root():
    return {"message": "Welcome to VisionHire AI API", "docs_url": "/docs"}

# 1. Job Description Endpoints
@app.get(f"{settings.API_V1_STR}/job-description")
def get_job_description():
    return {"text": DB["job_description"]}

@app.post(f"{settings.API_V1_STR}/job-description")
def update_job_description(jd: JobDescriptionUpdate):
    DB["job_description"] = jd.text
    # Recalculate scores for all candidates with the new JD
    recalculate_all_scores()
    return {"message": "Job description updated successfully", "text": DB["job_description"]}

def recalculate_all_scores():
    """Recalculates scores for all stored candidates when JD changes."""
    jd_text = DB["job_description"]
    for cid, cand in DB["candidates"].items():
        score_details = scorer.score_candidate(cand["profile"], jd_text)
        cand["score_details"] = score_details
        cand["score"] = score_details["total_score"]
    logger.info(f"Recalculated scores for {len(DB['candidates'])} candidates.")

# 2. Upload Resumes Endpoint
@app.post(f"{settings.API_V1_STR}/upload-resumes")
def upload_resumes(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
        
    uploaded_candidates = []
    jd_text = DB["job_description"]
    
    for file in files:
        # File Validation
        _, ext = os.path.splitext(file.filename)
        if ext.lower() not in ['.pdf', '.txt']:
            continue # Skip unsupported formats
            
        # Save file to uploads directory
        file_id = str(uuid.uuid4())
        filename = f"{file_id}{ext}"
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
                
            # Parse Resume
            parsed_profile = parser.parse_resume(file_path)
            
            # Score Candidate
            score_details = scorer.score_candidate(parsed_profile, jd_text)
            
            candidate_id = f"cand_{file_id[:8]}"
            candidate_record = {
                "id": candidate_id,
                "filename": file.filename,
                "local_path": file_path,
                "score": score_details["total_score"],
                "profile": parsed_profile,
                "score_details": score_details
            }
            
            # Save to Database
            DB["candidates"][candidate_id] = candidate_record
            uploaded_candidates.append(candidate_record)
            
        except Exception as e:
            logger.error(f"Error parsing resume {file.filename}: {e}")
            # Continue with other files if one fails
            
    return {
        "message": f"Successfully processed {len(uploaded_candidates)} resumes",
        "candidates": get_ranked_candidates_list()
    }

# 3. Generate Mock Resumes
@app.post(f"{settings.API_V1_STR}/generate-mock-resumes")
def generate_mock_resumes(background_tasks: BackgroundTasks):
    # Generates mock PDFs in mock_resumes folder
    try:
        mock_paths = mock_generator.generate_all_mock_resumes(settings.MOCK_RESUMES_DIR)
        jd_text = DB["job_description"]
        added_count = 0
        
        for path in mock_paths:
            filename = os.path.basename(path)
            # Avoid duplicating mock resumes in DB
            existing_match = [c for c in DB["candidates"].values() if c["filename"] == filename]
            if existing_match:
                continue
                
            # Copy to upload directory for standard processing
            file_id = str(uuid.uuid4())
            dest_filename = f"{file_id}.pdf"
            dest_path = os.path.join(settings.UPLOAD_DIR, dest_filename)
            shutil.copyfile(path, dest_path)
            
            # Parse and Score
            parsed_profile = parser.parse_resume(dest_path)
            parsed_profile["candidate_name"] = filename.replace(".pdf", "").replace("_", " ").title()
            
            score_details = scorer.score_candidate(parsed_profile, jd_text)
            
            candidate_id = f"cand_{file_id[:8]}"
            DB["candidates"][candidate_id] = {
                "id": candidate_id,
                "filename": filename,
                "local_path": dest_path,
                "score": score_details["total_score"],
                "profile": parsed_profile,
                "score_details": score_details
            }
            added_count += 1
            
        return {
            "message": f"Generated and loaded {added_count} mock candidates.",
            "candidates": get_ranked_candidates_list()
        }
    except Exception as e:
        logger.error(f"Mock generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate mock resumes: {e}")

# Helper to format leaderboard list
def get_ranked_candidates_list(search: Optional[str] = None):
    candidates = []
    for c in DB["candidates"].values():
        score_details = c["score_details"]
        profile = c["profile"]
        
        record = {
            "id": c["id"],
            "name": profile["candidate_name"],
            "email": profile["email"],
            "phone": profile["phone"],
            "score": c["score"],
            "skills": profile["skills"],
            "experience_years": profile["experience_years"],
            "seniority_level": profile["seniority_level"],
            "ats_score": profile["ats_score"],
            "education": profile["education"],
            "match_category": scorer.determine_fit(c["score"]),
            "breakdown": score_details["breakdown"],
            "insights": score_details["insights"],
            "skills_match": score_details["skills_match"]
        }
        
        # Apply Search Filter if any
        if search:
            search_lower = search.lower()
            name_match = search_lower in record["name"].lower()
            skill_match = any(search_lower in s.lower() for s in record["skills"])
            if not (name_match or skill_match):
                continue
                
        candidates.append(record)
        
    # Sort by total score descending
    candidates.sort(key=lambda x: x["score"], reverse=True)
    return candidates

# 4. Get Candidates Endpoints
@app.get(f"{settings.API_V1_STR}/candidates")
def get_candidates(search: Optional[str] = None):
    return get_ranked_candidates_list(search)

@app.get(f"{settings.API_V1_STR}/candidates/{{candidate_id}}")
def get_candidate(candidate_id: str):
    if candidate_id not in DB["candidates"]:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    cand = DB["candidates"][candidate_id]
    profile = cand["profile"]
    
    return {
        "id": cand["id"],
        "name": profile["candidate_name"],
        "email": profile["email"],
        "phone": profile["phone"],
        "links": profile["links"],
        "summary": profile["summary"],
        "score": cand["score"],
        "skills": profile["skills"],
        "experience_years": profile["experience_years"],
        "experience_timeline": profile["experience_timeline"],
        "education": profile["education"],
        "seniority_level": profile["seniority_level"],
        "ats_score": profile["ats_score"],
        "ats_strengths": profile["ats_strengths"],
        "ats_warnings": profile["ats_warnings"],
        "score_details": cand["score_details"],
        "raw_text_preview": profile["raw_text"][:2000] # Limit preview length
    }

# 5. Analytics Endpoint
@app.get(f"{settings.API_V1_STR}/analytics")
def get_analytics():
    candidates = get_ranked_candidates_list()
    if not candidates:
        return {
            "candidate_count": 0,
            "average_score": 0,
            "score_distribution": [],
            "top_skills": [],
            "seniority_distribution": []
        }
        
    # Count of candidates
    count = len(candidates)
    
    # Average Score
    avg_score = round(sum(c["score"] for c in candidates) / count, 1)
    
    # Score distribution
    bins = {"Excellent (85-100)": 0, "Good (70-84)": 0, "Average (50-69)": 0, "Low (<50)": 0}
    for c in candidates:
        s = c["score"]
        if s >= 85:
            bins["Excellent (85-100)"] += 1
        elif s >= 70:
            bins["Good (70-84)"] += 1
        elif s >= 50:
            bins["Average (50-69)"] += 1
        else:
            bins["Low (<50)"] += 1
            
    score_dist = [{"range": k, "count": v} for k, v in bins.items()]
    
    # Skill distribution
    skill_counts = {}
    for c in candidates:
        for s in c["skills"]:
            skill_counts[s] = skill_counts.get(s, 0) + 1
            
    top_skills = [{"skill": k, "count": v} for k, v in sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:10]]
    
    # Seniority Distribution
    seniority_counts = {}
    for c in candidates:
        lvl = c["seniority_level"]
        seniority_counts[lvl] = seniority_counts.get(lvl, 0) + 1
        
    seniority_dist = [{"level": k, "count": v} for k, v in seniority_counts.items()]
    
    return {
        "candidate_count": count,
        "average_score": avg_score,
        "score_distribution": score_dist,
        "top_skills": top_skills,
        "seniority_distribution": seniority_dist
    }

# 6. Candidate Comparison
@app.post(f"{settings.API_V1_STR}/compare")
def compare_candidates(req: CompareRequest):
    comparison = []
    for cid in req.candidate_ids:
        if cid in DB["candidates"]:
            cand = DB["candidates"][cid]
            profile = cand["profile"]
            score_details = cand["score_details"]
            
            comparison.append({
                "id": cand["id"],
                "name": profile["candidate_name"],
                "score": cand["score"],
                "seniority": profile["seniority_level"],
                "experience_years": profile["experience_years"],
                "education": profile["education"][0]["degree"] if profile["education"] else "N/A",
                "skills_score": score_details["breakdown"]["skills_score"],
                "experience_score": score_details["breakdown"]["experience_score"],
                "education_score": score_details["breakdown"]["education_score"],
                "semantic_score": score_details["breakdown"]["semantic_score"],
                "matched_skills": score_details["skills_match"]["matched"],
                "missing_skills": score_details["skills_match"]["missing"],
                "ats_score": profile["ats_score"]
            })
            
    return comparison
