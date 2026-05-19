import logging
import re
from app.services import nlp_utils

logger = logging.getLogger(__name__)

def parse_job_description(jd_text: str) -> dict:
    """Parses job description to extract required skills, experience, and education."""
    # 1. Extract skills from JD text using same NLP utility
    skills = nlp_utils.extract_skills(jd_text)
    
    # 2. Extract required years of experience
    # Look for patterns like "X+ years", "X-Y years", "at least X years"
    exp_matches = re_find_experience(jd_text)
    
    # 3. Extract required education level
    edu_level = "bachelor"  # default
    for level in ["phd", "master", "bachelor", "associate"]:
        # If the level keywords are mentioned, set as requirement
        if level == "phd" and any(kw in jd_text.lower() for kw in ["ph.d", "phd", "doctorate"]):
            edu_level = "phd"
            break
        elif level == "master" and any(kw in jd_text.lower() for kw in ["master", "m.s", "ms", "m.tech", "mba"]):
            edu_level = "master"
            break
            
    return {
        "skills": skills,
        "required_experience": exp_matches,
        "required_education": edu_level
    }

def re_find_experience(text: str) -> float:
    """Helper to find experience requirements in JD text."""
    import re
    # Patterns like: "5+ years", "3 to 5 years", "at least 7 years"
    patterns = [
        r"(\d{1,2})\+?\s*(?:years|yrs)\s*(?:of)?\s*experience",
        r"(\d{1,2})\s*-\s*(\d{1,2})\s*(?:years|yrs)",
        r"(?:at least|minimum of)\s*(\d{1,2})\s*(?:years|yrs)"
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return float(match.group(1))
            
    # Default to 3 years if not specified
    return 3.0

def score_candidate(candidate_profile: dict, job_description_text: str) -> dict:
    """Calculates weighted match score between a candidate profile and a job description.
    
    Weights:
    - Skills Match: 40%
    - Experience Relevance: 25%
    - Education Relevance: 15%
    - Semantic Similarity: 20%
    """
    # 1. Parse Job Description
    jd_info = parse_job_description(job_description_text)
    jd_skills = jd_info["skills"]
    jd_req_exp = jd_info["required_experience"]
    jd_req_edu = jd_info["required_education"]
    
    # ------------------
    # A. SKILLS MATCH (40%)
    # ------------------
    candidate_skills = [s.lower() for s in candidate_profile["skills"]]
    jd_skills_lower = [s.lower() for s in jd_skills]
    
    matched_skills = []
    missing_skills = []
    
    for skill in jd_skills:
        if skill.lower() in candidate_skills:
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)
            
    # Calculate percentage overlap
    if jd_skills:
        skills_score = (len(matched_skills) / len(jd_skills)) * 100
    else:
        # If no skills in JD, default to a neutral score or check global overlap
        skills_score = 50.0
        
    # ------------------
    # B. EXPERIENCE RELEVANCE (25%)
    # ------------------
    cand_exp_years = candidate_profile["experience_years"]
    
    # Score experience based on proximity to requirement
    # If candidate meets or exceeds, 100%. Otherwise, scale down.
    if cand_exp_years >= jd_req_exp:
        # Give full credit, plus up to 10% bonus for additional experience (cap at 100)
        exp_score = min(100.0, 90.0 + (cand_exp_years - jd_req_exp) * 2.0)
    else:
        # Scale down based on how short they are
        exp_score = max(30.0, (cand_exp_years / jd_req_exp) * 90.0)
        
    # ------------------
    # C. EDUCATION RELEVANCE (15%)
    # ------------------
    # Map degrees to hierarchy
    edu_map = {"associate": 1, "bachelor": 2, "master": 3, "phd": 4}
    
    req_edu_rank = edu_map.get(jd_req_edu, 2)
    
    # Find candidate's highest education rank
    cand_edu_rank = 2  # default bachelor
    cand_degree = "Bachelor's"
    
    if candidate_profile.get("education"):
        highest_edu = candidate_profile["education"][0]
        deg_name = highest_edu.get("degree", "").lower()
        if "ph" in deg_name or "doctor" in deg_name:
            cand_edu_rank = 4
            cand_degree = "Ph.D."
        elif "master" in deg_name or "m.s" in deg_name or "mba" in deg_name or "m.tech" in deg_name:
            cand_edu_rank = 3
            cand_degree = "Master's"
        elif "bachelor" in deg_name or "b.s" in deg_name or "b.tech" in deg_name:
            cand_edu_rank = 2
            cand_degree = "Bachelor's"
        elif "associate" in deg_name:
            cand_edu_rank = 1
            cand_degree = "Associate's"
            
    if cand_edu_rank >= req_edu_rank:
        edu_score = 100.0
    else:
        # Penalty for not meeting minimum education
        edu_score = 60.0 if (req_edu_rank - cand_edu_rank) == 1 else 40.0
        
    # ------------------
    # D. SEMANTIC SIMILARITY (20%)
    # ------------------
    semantic_score = nlp_utils.calculate_semantic_similarity(
        candidate_profile["raw_text"],
        job_description_text
    ) * 100
    
    # ------------------
    # TOTAL WEIGHTED SCORE
    # ------------------
    total_score = (
        (skills_score * 0.40) +
        (exp_score * 0.25) +
        (edu_score * 0.15) +
        (semantic_score * 0.20)
    )
    
    total_score = round(total_score, 1)
    skills_score = round(skills_score, 1)
    exp_score = round(exp_score, 1)
    edu_score = round(edu_score, 1)
    semantic_score = round(semantic_score, 1)

    # 5. Explanations, Strengths, and Weaknesses
    strengths = []
    weaknesses = []
    
    # Analyze strengths
    if skills_score >= 80:
        strengths.append(f"Exceptional skills match with {len(matched_skills)} core technologies covered.")
    elif len(matched_skills) >= 4:
        strengths.append(f"Demonstrated proficiency in key requirements: {', '.join(matched_skills[:3])}.")
        
    if cand_exp_years >= jd_req_exp:
        strengths.append(f"Exceeds experience requirements with {cand_exp_years} years in relevant roles.")
    else:
        if cand_exp_years >= 2.0:
            strengths.append(f"Has {cand_exp_years} years of experience, showing solid professional foundation.")
            
    if cand_edu_rank >= req_edu_rank:
        strengths.append(f"Educational qualifications align perfectly (holds {cand_degree}).")

    if semantic_score >= 70:
        strengths.append("High semantic alignment, indicating resume projects match the role context.")

    # Analyze weaknesses & gaps
    if len(missing_skills) > 0:
        weaknesses.append(f"Skill gaps identified in: {', '.join(missing_skills[:4])}.")
    if cand_exp_years < jd_req_exp:
        weaknesses.append(f"Experience is {round(jd_req_exp - cand_exp_years, 1)} years short of the requested {jd_req_exp} years.")
    if cand_edu_rank < req_edu_rank:
        weaknesses.append(f"Role prefers {jd_req_edu.capitalize()}'s degree, but candidate has {cand_degree}.")
    if semantic_score < 40:
        weaknesses.append("Resume terminology is slightly misaligned with the JD language patterns.")

    # Default if empty
    if not strengths:
        strengths.append("Decent general profile with standard technical skills.")
    if not weaknesses:
        weaknesses.append("No critical gaps identified; solid candidate profile.")

    # JD Match Explanation
    explanation = (
        f"{candidate_profile['candidate_name']} matches {total_score}% of the job requirements. "
        f"They possess a strong skills alignment ({skills_score}%) with key matches in {', '.join(matched_skills[:3])}. "
        f"Their {cand_exp_years} years of professional history provides a {exp_score}% score on experience relevance. "
        f"Overall, they represent a {determine_fit(total_score)} fit for this position."
    )

    return {
        "total_score": total_score,
        "breakdown": {
            "skills_score": skills_score,
            "experience_score": exp_score,
            "education_score": edu_score,
            "semantic_score": semantic_score
        },
        "skills_match": {
            "matched": matched_skills,
            "missing": missing_skills
        },
        "insights": {
            "strengths": strengths,
            "weaknesses": weaknesses,
            "explanation": explanation
        }
    }

def determine_fit(score: float) -> str:
    if score >= 85:
        return "Strong Leaderboard"
    elif score >= 70:
        return "Good Match"
    elif score >= 50:
        return "Potential Match"
    else:
        return "Low Fit"
