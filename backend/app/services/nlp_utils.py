import re
import spacy
from spacy.matcher import PhraseMatcher
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging

logger = logging.getLogger(__name__)

# Initialize spaCy (will download if not present, but handled in start script)
nlp = None
matcher = None

# Define Skill Taxonomy
SKILLS_DICTIONARY = [
    # Programming Languages
    "python", "javascript", "typescript", "java", "c++", "cpp", "c#", "rust", "go", "golang", "ruby", "php", "swift",
    "kotlin", "scala", "r language", "sql", "nosql", "html", "css", "sass", "bash", "shell", "powershell",
    # Frontend
    "react", "react.js", "next.js", "nextjs", "vue", "vue.js", "angular", "svelte", "solid.js", "remix", "gatsby",
    "tailwind css", "tailwind", "bootstrap", "material ui", "shadcn", "framer motion", "redux", "zustand", "graphql",
    # Backend
    "node.js", "nodejs", "express", "express.js", "nest.js", "nestjs", "fastapi", "django", "flask", "spring boot",
    "spring", "ruby on rails", "rails", "asp.net", "laravel", "graphql api", "rest api", "grpc", "websockets",
    # Cloud & DevOps
    "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s", "terraform",
    "ansible", "jenkins", "github actions", "gitlab ci", "ci/cd", "prometheus", "grafana", "linux", "nginx",
    # Databases & ORM
    "postgresql", "postgres", "mysql", "mongodb", "redis", "elasticsearch", "sqlite", "dynamodb", "firebase",
    "supabase", "prisma", "sequelize", "mongoose", "typeorm", "hibernate",
    # Data Science & AI
    "pandas", "numpy", "scikit-learn", "sklearn", "tensorflow", "keras", "pytorch", "torch", "spacy", "nltk",
    "opencv", "huggingface", "llm", "large language models", "nlp", "natural language processing", "langchain",
    "llamaindex", "openai", "gemini", "vector database", "pinecone", "chromadb", "weaviate", "machine learning",
    "deep learning", "computer vision", "bert", "gpt",
    # Mobile
    "react native", "flutter", "swiftui", "android sdk", "ios sdk",
    # Soft & Management Skills
    "agile", "scrum", "project management", "product management", "leadership", "communication", "teamwork",
    "problem solving", "system design", "microservices", "unit testing", "jest", "cypress", "playwright",
    "jira", "confluence", "git", "github", "gitlab"
]

def load_nlp():
    global nlp, matcher
    if nlp is None:
        try:
            nlp = spacy.load("en_core_web_sm")
        except Exception:
            # Fallback if model not downloaded yet
            try:
                import subprocess
                subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"], check=True)
                nlp = spacy.load("en_core_web_sm")
            except Exception as e:
                logger.error(f"Failed to load spaCy model: {e}")
                # Create a blank model if all else fails
                nlp = spacy.blank("en")
        
        # Initialize phrase matcher
        matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
        patterns = [nlp.make_doc(text) for text in SKILLS_DICTIONARY]
        matcher.add("SKILL", patterns)
    return nlp, matcher

# Try loading SentenceTransformers
sentence_model = None
try:
    from sentence_transformers import SentenceTransformer
    sentence_model_name = "all-MiniLM-L6-v2"
    # Load model lazily
except ImportError:
    logger.warning("sentence-transformers not installed or failed to import. Falling back to TF-IDF.")

def get_sentence_model():
    global sentence_model
    if sentence_model is None:
        try:
            from sentence_transformers import SentenceTransformer
            sentence_model = SentenceTransformer("all-MiniLM-L6-v2")
        except Exception as e:
            logger.error(f"Failed to load SentenceTransformer: {e}")
            sentence_model = False
    return sentence_model

# Clean Text Helper
def clean_text(text: str) -> str:
    if not text:
        return ""
    # Remove excessive newlines and spaces
    text = re.sub(r'\s+', ' ', text)
    # Remove non-printable characters
    text = "".join(ch for ch in text if ch.isprintable() or ch.isspace())
    return text.strip()

# Extract Email
def extract_email(text: str) -> str | None:
    pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(pattern, text)
    return match.group(0) if match else None

# Extract Phone Number
def extract_phone(text: str) -> str | None:
    # Match various phone number formats
    pattern = r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    match = re.search(pattern, text)
    return match.group(0) if match else None

# Extract Links (LinkedIn, GitHub)
def extract_links(text: str) -> list[str]:
    pattern = r'(https?://(?:www\.)?(?:linkedin\.com/in/|github\.com/)[a-zA-Z0-9_-]+)'
    return re.findall(pattern, text)

# Extract Skills using spaCy PhraseMatcher
def extract_skills(text: str) -> list[str]:
    nlp_model, skill_matcher = load_nlp()
    doc = nlp_model(text)
    matches = skill_matcher(doc)
    
    extracted = set()
    for match_id, start, end in matches:
        span = doc[start:end]
        # Normalize skill name to standard dictionary form
        skill = span.text.lower().strip()
        # Mapping duplicate representations to a single form
        if skill in ["nextjs", "next.js"]:
            extracted.add("Next.js")
        elif skill in ["react.js", "react"]:
            extracted.add("React")
        elif skill in ["vue.js", "vue"]:
            extracted.add("Vue")
        elif skill in ["node.js", "nodejs"]:
            extracted.add("Node.js")
        elif skill in ["nestjs", "nest.js"]:
            extracted.add("NestJS")
        elif skill in ["expressjs", "express"]:
            extracted.add("Express")
        elif skill in ["cpp", "c++"]:
            extracted.add("C++")
        elif skill in ["golang", "go"]:
            extracted.add("Go")
        elif skill in ["sklearn", "scikit-learn"]:
            extracted.add("Scikit-Learn")
        else:
            # Capitalize first letter of each word for clean presentation
            capitalized = " ".join([w.capitalize() if w not in ["on", "and", "css", "ui", "js", "orm", "api", "rest", "grpc", "aws", "gcp", "sdk", "ci", "cd", "llm", "nlp", "gpt", "bert"] else w.upper() for w in skill.split()])
            # Fix specific casings
            capitalized = capitalized.replace("Nextjs", "Next.js").replace("Nodejs", "Node.js").replace("Fastapi", "FastAPI").replace("Spacy", "spaCy").replace("Github", "GitHub").replace("Gitlab", "GitLab").replace("Typescript", "TypeScript").replace("Javascript", "JavaScript")
            extracted.add(capitalized)
            
    return sorted(list(extracted))

# Calculate Semantic Similarity
def calculate_semantic_similarity(text1: str, text2: str) -> float:
    # Try using SentenceTransformer first
    model = get_sentence_model()
    if model:
        try:
            embeddings = model.encode([text1, text2])
            similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
            return float(np.clip(similarity, 0.0, 1.0))
        except Exception as e:
            logger.error(f"Error computing SentenceTransformer similarity: {e}")
            
    # TF-IDF Cosine Similarity Fallback
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf = vectorizer.fit_transform([text1, text2])
        similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return float(np.clip(similarity, 0.0, 1.0))
    except Exception as e:
        logger.error(f"Error computing TF-IDF similarity: {e}")
        return 0.0
