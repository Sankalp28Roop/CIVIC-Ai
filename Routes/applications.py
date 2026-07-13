from fastapi import APIRouter
from Database.db import db
from Utils.helpers import mongo_to_dict
from datetime import datetime

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)

apps_collection = db["applications"]

SEED_APPS = [
    {
        "refId": "APP-2026-8472",
        "schemeName": "PM-Kisan Samman Nidhi",
        "dateSubmitted": datetime.utcnow().isoformat(),
        "status": "Approved"
    },
    {
        "refId": "APP-2026-9123",
        "schemeName": "Ayushman Bharat Card",
        "dateSubmitted": datetime.utcnow().isoformat(),
        "status": "Under Review"
    },
    {
        "refId": "APP-2026-1054",
        "schemeName": "Ujjwala Yojana",
        "dateSubmitted": datetime.utcnow().isoformat(),
        "status": "Action Required"
    }
]

def seed_applications():
    if apps_collection.count_documents({}) == 0:
        apps_collection.insert_many(SEED_APPS)

seed_applications()

@router.get("/")
def get_applications():
    apps = list(apps_collection.find())
    return mongo_to_dict(apps)
