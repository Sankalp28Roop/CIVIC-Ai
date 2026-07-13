from fastapi import APIRouter
from Database.db import db
from Utils.helpers import mongo_to_dict
from datetime import datetime

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)

notifs_collection = db["notifications"]

SEED_NOTIFS = [
    {
        "title": "Document Extracted Successfully",
        "message": "Your Aadhar Card scan has been successfully parsed and verified by the AI.",
        "type": "success",
        "date": datetime.utcnow().isoformat(),
        "isRead": False
    },
    {
        "title": "Application Action Required",
        "message": "Your Ujjwala Yojana application requires additional income proof.",
        "type": "warning",
        "date": datetime.utcnow().isoformat(),
        "isRead": False
    },
    {
        "title": "New Scheme Available",
        "message": "A new solar panel subsidy scheme has been added to your state.",
        "type": "info",
        "date": datetime.utcnow().isoformat(),
        "isRead": True
    }
]

def seed_notifications():
    if notifs_collection.count_documents({}) == 0:
        notifs_collection.insert_many(SEED_NOTIFS)

seed_notifications()

@router.get("/")
def get_notifications():
    notifs = list(notifs_collection.find().sort("date", -1))
    return mongo_to_dict(notifs)
