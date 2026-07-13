from fastapi import APIRouter
from Database.db import complaints_collection

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get("/")
def analytics():
    complaints = list(complaints_collection.find())
    total = len(complaints)
    pending = len([c for c in complaints if c.get("status") == "Pending"])
    completed = len([c for c in complaints if c.get("status") == "Completed"])
    high = len([c for c in complaints if c.get("severity", "") == "High" or (isinstance(c.get("severity"), dict) and c["severity"].get("severity") == "High")])
    medium = len([c for c in complaints if c.get("severity", "") == "Medium" or (isinstance(c.get("severity"), dict) and c["severity"].get("severity") == "Medium")])
    low = len([c for c in complaints if c.get("severity", "") == "Low" or (isinstance(c.get("severity"), dict) and c["severity"].get("severity") == "Low")])

    return {
        "total": total,
        "pending": pending,
        "completed": completed,
        "high_priority": high,
        "medium_priority": medium,
        "low_priority": low
    }

@router.get("/categories")
def category_count():
    complaints = list(complaints_collection.find())
    data = {}
    for c in complaints:
        # handle if category is dict or str based on how the AI output is stored
        cat = c.get("category", "Unknown")
        if isinstance(cat, dict):
            cat = cat.get("category", "Unknown")
        data[cat] = data.get(cat, 0) + 1
    return data