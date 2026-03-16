from pydantic import BaseModel, Field
from typing import List, Optional

class SkillMatch(BaseModel):
    skill: str
    category: str
    proficiency_level: str  # "beginner" | "intermediate" | "advanced"
    relevance_score: float  # 0.0 – 1.0

class AnalysisResponse(BaseModel):
    match_percentage: float = Field(..., ge=0, le=100)
    matched_skills: List[SkillMatch]
    missing_skills: List[str]
    recommended_courses: List[dict]  # {"name": ..., "platform": ..., "url": ...}
    recommended_keywords: List[str]
    project_suggestions: List[dict]  # {"title": ..., "description": ..., "skills_covered": [...]}
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    detailed_analysis: str

class AnalysisRequest(BaseModel):
    resume_text: str = Field(..., min_length=50)
    job_description: str = Field(..., min_length=20)
