import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "VisionHire AI API"
    API_V1_STR: str = "/api/v1"
    
    # Upload Settings
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    MOCK_RESUMES_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "mock_resumes")
    
    # NLP & Similarity Settings
    SPACY_MODEL: str = "en_core_web_sm"
    SENTENCE_TRANSFORMER_MODEL: str = "all-MiniLM-L6-v2"
    
    # CORS Settings
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "https://visionhire-ai.vercel.app"  # Placeholder production URL
    ]

    class Config:
        case_sensitive = True

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.MOCK_RESUMES_DIR, exist_ok=True)
