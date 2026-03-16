import json
from jinja2 import Environment, FileSystemLoader
from google import genai
from backend.config import settings
from backend.models.schemas import AnalysisResponse
import os

# Setup Jinja2 environment
TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "../prompts")
env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

def get_analyzer_client():
    return genai.Client(api_key=settings.GOOGLE_API_KEY)

async def analyze_resume_v_job(resume_text: str, job_description: str) -> AnalysisResponse:
    client = get_analyzer_client()
    template = env.get_template("analysis_prompt.j2")
    
    prompt = template.render(
        resume_text=resume_text,
        job_description=job_description
    )
    
    response = client.models.generate_content(
        model="gemma-3-27b-it",
        contents=prompt,
        config=genai.types.GenerateContentConfig(
            temperature=0.3,
            max_output_tokens=4096,
        ),
    )
    
    # Extract text and clean potential markdown code blocks
    text = response.text.strip()
    if text.startswith("```json"):
        text = text.replace("```json", "", 1).replace("```", "", 1).strip()
    elif text.startswith("```"):
        text = text.replace("```", "", 1).replace("```", "", 1).strip()
    
    analysis_data = json.loads(text)
    
    # Post-processing validation & adjustment
    analysis = AnalysisResponse.model_validate(analysis_data)
    return validate_and_adjust(analysis)

def validate_and_adjust(response: AnalysisResponse) -> AnalysisResponse:
    """Apply sanity checks to the LLM's output."""
    # Clamp match_percentage to [0, 100]
    response.match_percentage = max(0.0, min(100.0, float(response.match_percentage)))

    # Ensure no skill appears in both matched and missing lists
    matched_names = {s.skill.lower() for s in response.matched_skills}
    response.missing_skills = [
        s for s in response.missing_skills if s.lower() not in matched_names
    ]

    # Recalculate match_percentage from individual scores as a sanity check
    if response.matched_skills or response.missing_skills:
        total_required = len(response.matched_skills) + len(response.missing_skills)
        if total_required > 0:
            calculated = (sum(s.relevance_score for s in response.matched_skills) / total_required) * 100
            # If LLM's estimate diverges >15% from calculation, use the calculated value
            if abs(response.match_percentage - calculated) > 15:
                response.match_percentage = round(calculated, 1)

    return response
