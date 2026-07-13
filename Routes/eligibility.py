from fastapi import APIRouter
from pydantic import BaseModel
import time

router = APIRouter(
    prefix="/eligibility",
    tags=["Eligibility"]
)

class EligibilityForm(BaseModel):
    state: str
    income: str
    occupation: str
    category: str

@router.post("/check")
def check_eligibility(form: EligibilityForm):
    # Simulate an AI engine processing time
    time.sleep(2)
    
    # Mock AI response based on typical form data
    eligible_schemes = []
    
    if form.occupation.lower() == "farmer" or "kisan" in form.occupation.lower():
        eligible_schemes.append({
            "id": "PMK",
            "title": "PM-Kisan Samman Nidhi",
            "reason": "Matches farmer occupation profile."
        })
    
    if "low" in form.income.lower() or "under" in form.income.lower() or form.income == "< 2.5 Lakhs":
        eligible_schemes.append({
            "id": "PAY",
            "title": "PM Awas Yojana",
            "reason": "Matches low income housing bracket."
        })
        eligible_schemes.append({
            "id": "UY",
            "title": "Ujjwala Yojana",
            "reason": "Matches BPL family criteria."
        })
        
    if "student" in form.occupation.lower():
        eligible_schemes.append({
            "id": "SP",
            "title": "National Scholarship Portal",
            "reason": "Matches student profile."
        })
        
    if not eligible_schemes:
        # Default fallback
        eligible_schemes.append({
            "id": "ABC",
            "title": "Ayushman Bharat Card",
            "reason": "General health coverage based on basic demographic data."
        })

    return {
        "status": "success",
        "message": "AI analysis complete.",
        "matches": eligible_schemes
    }
