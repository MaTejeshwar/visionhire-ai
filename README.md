# VisionHire AI — Automated Resume Parser & Candidate Scorer

VisionHire AI is a complete, production-grade automated recruitment dashboard. It uses Natural Language Processing (NLP) to parse resume files, extract skills/histories, evaluate ATS compatibility, and rank candidates semantically against a target job description.

## 🔑 Key Features
- **Semantic Similarity Scoring**: Embeds resume text and job descriptions using Sentence-Transformers to compute true contextual alignment, with an automated TF-IDF fallback.
- **NLP Information Extraction**: Pulls contact details, technology skill tags, education degrees, and detailed professional timelines.
- **ATS-Friendliness Score**: Scans resumes for word density, required headers, and profile structure, reporting actionable improvement warnings.
- **Interactive Leaderboard**: Sort and search candidate matches with Framer Motion transitions.
- **Side-by-Side Comparison**: Contrast up to 3 candidates' metrics, experiences, and skill gaps simultaneously.
- **Visual Analytics**: Interactive Recharts layouts detailing hiring distribution, top matching technologies, and experience breakdown.
- **Mock Profile Generation**: Generates Letter-sized resume PDFs programmatically to immediately populate the database for demo purposes.

---

## 📂 Monorepo File Structure
```
visionhire-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   │   ├── mock_generator.py  # Generates testing resume PDFs
│   │   │   ├── nlp_utils.py       # spaCy, TF-IDF & sentence similarity helpers
│   │   │   ├── parser.py          # PDF parser & text extractor pipeline
│   │   │   └── scorer.py          # Scoring engine
│   │   ├── config.py              # Settings & directory setups
│   │   └── main.py                # FastAPI routes & in-memory database
│   ├── requirements.txt           # Python backend dependencies
│   └── run.py                     # Uvicorn launcher
├── frontend/
│   ├── app/
│   │   ├── analytics/             # Pipeline statistics
│   │   ├── dashboard/             # Core dashboards & detail pages
│   │   ├── globals.css            # Tailwind CSS variables & styles
│   │   ├── layout.tsx             # Root styling & fonts
│   │   └── page.tsx               # Product landing page
│   ├── components/                # FileUpload, Navbar, Leaderboard, CompareModal
│   ├── lib/                       # API clients & types
│   ├── package.json               # NPM dependencies
│   └── tsconfig.json              # TypeScript rules
├── docs/
│   └── architecture.md            # Diagram and technical specifics
├── README.md
└── .env.example
```

---

## ⚡ Quick Start

### 1. Start the Backend
Navigate to the `/backend` folder:
```bash
cd backend
```

Create a virtual environment and install dependencies:
```bash
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

Run the server:
```bash
python run.py
```
*The API docs will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).*

### 2. Start the Frontend
Navigate to the `/frontend` folder:
```bash
cd ../frontend
npm install
npm run dev
```
*The web app will run at [http://localhost:3000](http://localhost:3000).*

---

## ⚙️ Environment Variables Setup

Copy `.env.example` to configure variables in the workspace locations:

### Root Level `.env`
Create a `.env` in the root folder to manage monorepo defaults:
```bash
# Backend Environment Variables
PORT=8000
HOST=127.0.0.1

# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Backend `.env` (`backend/.env`)
```env
PORT=8000
HOST=127.0.0.1
```

### Frontend `.env.local` (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🧠 Scoring Weights
- **Skills Match (40%)**: Jaccard index matching candidate skill tags against requirements.
- **Experience Relevance (25%)**: Proximity comparison between target years and history.
- **Education Relevance (15%)**: Hierarchy mapping (Bachelor's vs Master's vs Ph.D.).
- **Semantic Similarity (20%)**: Dense vector embeddings cosine match.
