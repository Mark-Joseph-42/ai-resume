<p align="center">
  <h1 align="center">🧠 AI-Powered Resume Analyzer & Skill Gap Assessment</h1>
  <p align="center">
    <em>Intelligent resume analysis powered by Google's Gemma-3-27b-it model</em>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
    <img src="https://img.shields.io/badge/FastAPI-0.109+-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img src="https://img.shields.io/badge/Gemma_3-27B--it-4285F4?style=for-the-badge&logo=google&logoColor=white" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  </p>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Skill Gap Algorithm](#-skill-gap-algorithm)
- [Prompt Engineering](#-prompt-engineering)
- [Project Structure](#-project-structure)
- [Viva Preparation](#-viva-preparation)

---

## 🔍 Overview

This system performs **semantic skill gap analysis** by comparing a candidate's resume (PDF) against a target job description using Google's **Gemma-3-27b-it** LLM. Unlike simple keyword matching, the AI understands context — recognizing that "NumPy" implies Python proficiency, or that "Team Lead" demonstrates Leadership.

### How It Works

```
📄 PDF Resume  ──▶  🔍 Text Extraction (pdfminer.six)  ──▶  🧠 Prompt Assembly (Jinja2)
                                                                       │
📝 Job Description ─────────────────────────────────────────────────────┘
                                                                       │
                                                                       ▼
                                                          🤖 Gemma-3-27b-it API
                                                                       │
                                                                       ▼
                                                          📊 Structured JSON Response
                                                             │              │
                                                             ▼              ▼
                                                     💾 SQLite DB    📈 Dashboard
```

---

## 🏗 Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML + Tailwind CSS + Vanilla JS | Premium dashboard with Gauge & Radar charts |
| **Backend** | FastAPI (Python 3.10+) | Async API server with Pydantic validation |
| **AI Engine** | Google AI Studio (Gemma-3-27b-it) | Semantic skill extraction & gap analysis |
| **PDF Parser** | pdfminer.six | Layout-aware text extraction with LAParams |
| **Database** | SQLite | Lightweight analysis history persistence |
| **Templating** | Jinja2 | Structured prompt engineering |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **PDF Resume Upload** | Drag-and-drop upload with layout-aware text extraction |
| 🧠 **AI-Powered Analysis** | Semantic skill matching using Gemma-3-27b-it (27B parameters) |
| 📊 **Match Percentage** | Animated gauge showing overall candidate-job fit (0-100%) |
| 🕸 **Radar Chart** | Dynamic SVG visualization of skill gaps across categories |
| 🎯 **Missing Skills** | Identifies skills required by the JD but absent from the resume |
| 📚 **Course Recommendations** | Suggests specific courses (Coursera, Udemy, YouTube) to bridge gaps |
| 💡 **Project Suggestions** | Recommends hands-on projects to gain missing experience |
| 🔑 **Keyword Optimization** | Provides ATS-friendly keywords to improve resume ranking |
| 📜 **Analysis History** | Stores all past analyses in SQLite for review |
| 🖥 **Developer Logs** | Real-time, expandable terminal-style activity monitor |

---

## 🛠 Tech Stack

```
Frontend:     HTML5 / Tailwind CSS (CDN) / Vanilla JavaScript
Backend:      FastAPI / Uvicorn (ASGI)
AI Model:     Google Gemma-3-27b-it via Google AI Studio API
PDF Parsing:  pdfminer.six (layout-aware, LAParams-tuned)
Database:     SQLite3 (zero-config, file-based)
Templating:   Jinja2 (prompt engineering)
Validation:   Pydantic v2 (request/response schemas)
```

---

## 🚀 Installation

### Prerequisites
- Python 3.10+
- A Google AI Studio API Key → [Get one here](https://aistudio.google.com/apikey)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Mark-Joseph-42/ai-resume.git
cd ai-resume

# 2. Create a virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure your API key
cp .env.example .env
# Edit .env and add your Google AI Studio API key:
# GOOGLE_API_KEY=your_actual_key_here
```

---

## 💻 Usage

```bash
# Start the server
source venv/bin/activate
python3 backend/main.py
```

Open your browser and navigate to: **http://localhost:8000**

### Dashboard Walkthrough

1. **Upload a PDF resume** → Click the drop zone or drag-and-drop
2. **Paste a job description** → Copy from any job posting
3. **Click "Execute Analysis"** → Wait 5-10 seconds for the AI
4. **View results**:
   - 📊 Overall Match % (Gauge chart)
   - 🕸 Skill Gap Radar (SVG chart)
   - 📋 Full JSON breakdown (Extraction Preview panel)
   - 📚 Course, keyword, and project recommendations

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Upload resume (PDF) + job description → returns analysis JSON |
| `GET` | `/api/history` | List past 10 analyses |
| `GET` | `/api/history/{id}` | Get full details of a specific analysis |
| `GET` | `/api/health` | Health check |

### Example: `/api/analyze`

**Request** (multipart/form-data):
```
resume: <PDF file>
job_description: "We are looking for a Senior Python Developer with experience in..."
```

**Response** (JSON):
```json
{
  "match_percentage": 72.5,
  "matched_skills": [
    {"skill": "Python", "category": "Programming Language", "proficiency_level": "advanced", "relevance_score": 0.95},
    {"skill": "FastAPI", "category": "Framework", "proficiency_level": "intermediate", "relevance_score": 0.8}
  ],
  "missing_skills": ["Kubernetes", "GraphQL"],
  "recommended_courses": [
    {"name": "Kubernetes for Developers", "platform": "Coursera", "url": "..."}
  ],
  "recommended_keywords": ["CI/CD", "microservices", "container orchestration"],
  "project_suggestions": [
    {"title": "Microservices Blog Platform", "description": "Build a blog using FastAPI microservices deployed on K8s", "skills_covered": ["Kubernetes", "FastAPI"]}
  ],
  "summary": "Strong Python background with relevant framework experience. Primary gaps in cloud infrastructure and API design patterns."
}
```

---

## 🧮 Skill Gap Algorithm

The system uses a **hybrid semantic-deterministic** approach:

### Semantic Layer (LLM)
The Gemma-3-27b-it model performs deep semantic matching:
- Recognizes skill synonyms: `"JS"` ↔ `"JavaScript"` ↔ `"ES6"`
- Understands hypernyms: `"React"` is-a `"Frontend Framework"`
- Detects transferable skills: `"Team Lead"` → `"Leadership"`

### Deterministic Layer (Post-Processing)
The backend applies mathematical guardrails:

```
Match % = (Σ relevance_score_i) / (total_required_skills) × 100
```

**Validation rules:**
1. Clamp `match_percentage` to `[0, 100]`
2. Remove duplicates between matched and missing skill lists
3. If the LLM's score diverges >15% from the calculated value, override it

This prevents hallucinated scores while preserving the LLM's semantic understanding.

---

## 🎯 Prompt Engineering

The system prompt is stored as a Jinja2 template (`backend/prompts/analysis_prompt.j2`) and uses several techniques:

| Technique | Purpose |
|-----------|---------|
| **Dual-persona anchoring** | "Expert HR recruiter AND senior technical lead" ensures both HR fit and technical depth |
| **Explicit scoring formula** | Prevents the LLM from inventing its own metric |
| **Schema-in-prompt** | JSON schema included alongside `response_mime_type="application/json"` for double enforcement |
| **Low temperature (0.3)** | Reduces randomness for consistent JSON output |
| **Anti-formatting guard** | "Do NOT wrap in markdown code fences" blocks a common LLM failure mode |

---

## 📁 Project Structure

```
ai-resume/
├── backend/
│   ├── __init__.py
│   ├── main.py                 # FastAPI entry point + static file serving
│   ├── config.py               # Pydantic settings (loads .env)
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py           # POST /analyze, GET /history, GET /health
│   ├── services/
│   │   ├── __init__.py
│   │   ├── analyzer.py         # Gemma API integration + post-processing
│   │   └── pdf_extractor.py    # pdfminer.six text extraction
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py          # Pydantic request/response models
│   ├── database/
│   │   ├── __init__.py
│   │   ├── db.py               # SQLite connection manager
│   │   └── schema.sql          # Table definitions
│   └── prompts/
│       └── analysis_prompt.j2  # Jinja2 prompt template
├── static/
│   ├── index.html              # Dashboard UI (Tailwind CSS)
│   └── js/
│       └── app.js              # Frontend logic (API calls, charts)
├── .env.example                # API key template
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 🎓 Viva Preparation

### Q1: What are the limitations of using an LLM for recruitment scoring?
- **Bias amplification** from training data (gender, university prestige)
- **Hallucination risk** — may infer skills not stated explicitly
- **Non-determinism** — same input can produce different scores
- **No real-time grounding** — course recommendations may be outdated
- **Legal risk** — EU AI Act classifies recruitment AI as "high-risk"

### Q2: How do you handle image-based (scanned) PDFs?
- `pdfminer.six` only works on digitally-created PDFs
- We detect failures via `len(text) < 50` check and return a clear error
- Production fix: integrate `pytesseract` + `pdf2image` for OCR

### Q3: Why FastAPI over Flask?
- **Async/ASGI** support for non-blocking I/O (API calls are I/O-bound)
- **Auto-generated OpenAPI docs** at `/docs`
- **First-class Pydantic integration** for runtime type validation
- **Type safety** via Python type hints

### Q4: How do you ensure valid JSON from the LLM?
1. `response_mime_type="application/json"` at the API level
2. Explicit JSON schema in the prompt text
3. `try/except` with retry logic on `json.loads()` failure
4. `Pydantic.model_validate_json()` for schema enforcement

### Q5: Lexical vs Semantic matching — which does your system use?
- **Lexical**: string comparison (`"Python" == "Python"`) — fails on synonyms
- **Semantic**: understands meaning (`"NumPy"` → implies `"Python"`)
- **Our approach**: Hybrid — LLM does semantic matching, backend applies deterministic validation

---

<p align="center">
  <strong>Built with ❤️ for academic submission</strong><br>
  <em>Powered by Google Gemma-3-27b-it | FastAPI | Tailwind CSS</em>
</p>
