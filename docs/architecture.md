# VisionHire AI - System Architecture

VisionHire AI is designed using a clean, modular architecture. The application is structured as a monorepo containing a Python FastAPI backend and a Next.js 15 frontend.

## 1. System Components

### A. Next.js 15 Frontend
- **App Router**: Structured routing utilizing React Server & Client Components.
- **Tailwind CSS v4**: Utility styling for layouts and a customized glassmorphism skin.
- **Framer Motion**: Smooth entry, layout re-ordering, and card expansion microinteractions.
- **Recharts**: Client-side data visualization for candidate scoring radar and analytics grids.

### B. FastAPI Backend
- **Uvicorn Gateway**: Runs the API server locally at port `8000`.
- **In-Memory Store**: Holds parsed and scored candidate profiles, allowing rapid local testing without a database configuration.
- **PDF Resume Parser**: Pulls raw text using PyMuPDF (fitz) or pdfplumber, applying clean normalization filters.
- **spaCy & Matcher NLP**: Utilizes phrase matchers to check candidates against 2,000+ technical/soft skills, and extracts education histories and years of experience.
- **Scoring Engine**: Evaluates overlap percentages, timeline matches, and computes cosine similarities.

---

## 2. Parsing Pipeline

```
[Resume PDF / TXT]
       ↓
[Extract Raw Text] (via PyMuPDF, falls back to pdfplumber)
       ↓
[Text Cleansing] (Strip white spaces, characters, normalizations)
       ↓
[Regex Extractor] (Pulls email, phone, links)
       ↓
[spaCy PhraseMatcher] (Identifies skill tags against taxonomy)
       ↓
[Education Parser] (Identifies highest degree level & field)
       ↓
[Experience Parser] (Analyzes timelines and computes total years)
       ↓
[Structured JSON Output]
```

---

## 3. Scoring Weights & Calculations

The ranking engine calculates a score between `0` and `100` based on:

| Metric | Weight | Scoring Logic |
| --- | --- | --- |
| **Skills Match** | **40%** | (Number of matching required skills / Total required skills) * 100 |
| **Experience Relevance** | **25%** | Scaled difference between required years and candidate's total history |
| **Education Level** | **15%** | Matches candidate degree against JD requirement rank (Associate=1, BS=2, MS=3, PhD=4) |
| **Semantic Similarity** | **20%** | Cosine similarity between full resume text and JD text embeddings |

### Fail-Safe Similarity Fallback
To prevent startup failures or out-of-memory errors on smaller environments:
- If **Sentence-Transformers** (`all-MiniLM-L6-v2`) is loaded, it generates dense vector representations.
- If Sentence-Transformers is unavailable or fails to import, the engine seamlessly falls back to a **TF-IDF Vectorizer + Cosine Similarity** calculator.
