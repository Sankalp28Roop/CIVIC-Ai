from fastapi import APIRouter
from Database.db import complaints_collection
from Utils.helpers import mongo_to_dict
from bson.objectid import ObjectId

router = APIRouter(
    prefix="/tracking",
    tags=["Tracking"]
)

@router.get("/{complaint_id}")
def track(complaint_id: str):
    try:
        complaint = complaints_collection.find_one({"_id": ObjectId(complaint_id)})
        if not complaint:
            return {"error": "Complaint not found"}
        
        return {
            "status": complaint.get("status"),
            "severity": complaint.get("severity"),
            "category": complaint.get("category"),
            "created": complaint.get("created_at")
        }
    except:
        return {"error": "Invalid Complaint ID"}

@router.get("/live/all")
def live_tracking():
    complaints = list(complaints_collection.find())
    return mongo_to_dict(complaints)