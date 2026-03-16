from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List
import json
from backend.services.pdf_extractor import extract_resume_text, PDFExtractionError
from backend.services.analyzer import analyze_resume_v_job
from backend.models.schemas import AnalysisResponse
from backend.database.db import get_db

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        pdf_content = await resume.read()
        resume_text = extract_resume_text(pdf_content)
        
        analysis = await analyze_resume_v_job(resume_text, job_description)
        
        # Store in database
        with get_db() as conn:
            conn.execute(
                "INSERT INTO analyses (resume_filename, resume_text, job_description, match_percentage, result_json) VALUES (?, ?, ?, ?, ?)",
                (resume.filename, resume_text, job_description, analysis.match_percentage, analysis.model_dump_json())
            )
            conn.commit()
            
        return analysis
    except PDFExtractionError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/history")
async def get_history():
    with get_db() as conn:
        cursor = conn.execute("SELECT id, created_at, resume_filename, match_percentage FROM analyses ORDER BY created_at DESC LIMIT 10")
        return [dict(row) for row in cursor.fetchall()]

@router.get("/history/{analysis_id}")
async def get_analysis_detail(analysis_id: int):
    with get_db() as conn:
        row = conn.execute("SELECT * FROM analyses WHERE id = ?", (analysis_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        data = dict(row)
        data["result_json"] = json.loads(data["result_json"])
        return data

@router.get("/health")
async def health_check():
    return {"status": "healthy"}
