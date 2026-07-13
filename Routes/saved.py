from fastapi import APIRouter
from Database.db import db
from Utils.helpers import mongo_to_dict

router = APIRouter(
    prefix="/saved",
    tags=["Saved"]
)

saved_collection = db["saved_items"]

SEED_SAVED = [
    {
        "type": "Scheme",
        "title": "PM-Kisan Samman Nidhi",
        "description": "Financial support for landholding farmers.",
        "link": "/schemes/pm-kisan"
    },
    {
        "type": "Document Summary",
        "title": "Income Certificate Verification",
        "description": "Verified income bracket < 5 Lakhs.",
        "link": "/documents/123"
    }
]

def seed_saved():
    if saved_collection.count_documents({}) == 0:
        saved_collection.insert_many(SEED_SAVED)

seed_saved()

@router.get("/")
def get_saved():
    saved_items = list(saved_collection.find())
    return mongo_to_dict(saved_items)
