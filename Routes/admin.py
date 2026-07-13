from fastapi import APIRouter
from Database.db import complaints_collection
from Utils.helpers import mongo_to_dict
from bson.objectid import ObjectId

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.put("/status/{complaint_id}")
def update_status(complaint_id: str, status: str):
    try:
        result = complaints_collection.update_one(
            {"_id": ObjectId(complaint_id)},
            {"$set": {"status": status}}
        )
        if result.matched_count == 0:
            return {"error": "Complaint not found"}
        return {"message": "Status Updated"}
    except:
        return {"error": "Invalid Complaint ID"}

@router.get("/pending")
def pending():
    complaints = list(complaints_collection.find({"status": "Pending"}))
    return mongo_to_dict(complaints)

@router.get("/completed")
def completed():
    complaints = list(complaints_collection.find({"status": "Completed"}))
    return mongo_to_dict(complaints)