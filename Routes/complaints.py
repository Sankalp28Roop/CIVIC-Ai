from fastapi import APIRouter, UploadFile, File, Form
from Database.db import complaints_collection
from AI.detect import detect_objects
from AI.category import get_category
from AI.severity import calculate_severity
from AI.summary import generate_summary
from AI.location import validate_location
from AI.duplicate import find_duplicate
from Utils.helpers import mongo_to_dict
from bson.objectid import ObjectId
import shutil
import os
from datetime import datetime

router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/create")
async def create_complaint(
    image: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...)
):
    filepath = os.path.join(UPLOAD_FOLDER, image.filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    loc_validation = validate_location(latitude, longitude)
    if not loc_validation.get("success"):
        return {"error": loc_validation.get("message", "Invalid location")}

    # AI Pipeline
    issue_data = detect_objects(filepath)
    detected_objects = [d["object"] for d in issue_data.get("detections", [])] if issue_data.get("success") else []
    
    category_data = get_category(detected_objects)
    category = category_data["category"]
    primary_object = category_data["detected_object"]
    
    # Assume a default confidence if not empty, otherwise 0
    confidence = issue_data.get("detections", [{}])[0].get("confidence", 0.8) if detected_objects else 0.8

    severity_data = calculate_severity(category, confidence)
    summary_data = generate_summary(category, severity_data["severity"], str(loc_validation.get("distance", "unknown"))+"m", primary_object, confidence)

    # Duplicate check
    existing_complaints = list(complaints_collection.find())
    new_comp_temp = {"category": category, "latitude": latitude, "longitude": longitude}
    duplicate_data = find_duplicate(new_comp_temp, existing_complaints)

    if duplicate_data.get("duplicate"):
        return {
            "message": duplicate_data.get("message", "Duplicate complaint found"),
            "duplicate": True,
            "existing_id": str(duplicate_data.get("existing_id"))
        }

    complaint_doc = {
        "image": filepath,
        "category": category,
        "severity": severity_data,
        "latitude": latitude,
        "longitude": longitude,
        "summary": summary_data,
        "detected_objects": detected_objects,
        "status": "Pending",
        "created_at": datetime.utcnow()
    }

    result = complaints_collection.insert_one(complaint_doc)

    return {
        "message": "Complaint Created",
        "complaint_id": str(result.inserted_id)
    }


@router.get("/")
def get_all():
    complaints = list(complaints_collection.find())
    return mongo_to_dict(complaints)


@router.get("/{complaint_id}")
def get_complaint(complaint_id: str):
    try:
        complaint = complaints_collection.find_one({"_id": ObjectId(complaint_id)})
        if complaint:
            return mongo_to_dict(complaint)
        return {"error": "Complaint not found"}
    except:
        return {"error": "Invalid Complaint ID"}


@router.delete("/{complaint_id}")
def delete_complaint(complaint_id: str):
    try:
        result = complaints_collection.delete_one({"_id": ObjectId(complaint_id)})
        if result.deleted_count > 0:
            return {"message": "Deleted"}
        return {"error": "Complaint not found"}
    except:
        return {"error": "Invalid Complaint ID"}