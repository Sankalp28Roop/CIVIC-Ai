from fastapi import APIRouter, File, UploadFile
from Database.db import db
from Utils.helpers import mongo_to_dict
from datetime import datetime
import asyncio

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

docs_collection = db["documents"]

SEED_DOCS = [
    {
        "name": "Aadhar_Card_Scan.pdf",
        "uploadDate": datetime.utcnow().isoformat(),
        "size": "2.4 MB",
        "badge": "Extracted"
    },
    {
        "name": "Income_Certificate_2025.jpg",
        "uploadDate": datetime.utcnow().isoformat(),
        "size": "1.1 MB",
        "badge": "Processing"
    },
    {
        "name": "Bank_Passbook.png",
        "uploadDate": datetime.utcnow().isoformat(),
        "size": "3.5 MB",
        "badge": "Extracted"
    },
    {
        "name": "Electricity_Bill_Jan.pdf",
        "uploadDate": datetime.utcnow().isoformat(),
        "size": "0.8 MB",
        "badge": "Failed"
    }
]

def seed_documents():
    if docs_collection.count_documents({}) == 0:
        docs_collection.insert_many(SEED_DOCS)

seed_documents()

@router.get("/")
def get_documents():
    docs = list(docs_collection.find())
    return mongo_to_dict(docs)

@router.post("/analyze-doc")
async def analyze_document(file: UploadFile = File(...)):
    # Validate extension
    allowed = ["pdf", "jpg", "jpeg", "png"]
    ext = file.filename.split(".")[-1].lower()
    if ext not in allowed:
        return {"error": "Invalid file type"}
    
    # Read file to check size
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)
    if size_mb > 10:
        return {"error": "File size exceeds 10MB"}
    
    # Simulate Gemini processing latency
    await asyncio.sleep(2)
    
    # Insert a new record simulating extraction success
    new_doc = {
        "name": file.filename,
        "uploadDate": datetime.utcnow().isoformat(),
        "size": f"{size_mb:.1f} MB",
        "badge": "Processing"
    }
    
    result = docs_collection.insert_one(new_doc)
    
    # After insertion, update badge to Extracted to mock async pipeline finishing later
    # (Just storing it as Processing, real system would use webhooks/websockets)
    
    created = docs_collection.find_one({"_id": result.inserted_id})
    return mongo_to_dict(created)
