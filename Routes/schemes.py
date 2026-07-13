from fastapi import APIRouter
from Database.db import db
from Utils.helpers import mongo_to_dict

router = APIRouter(
    prefix="/schemes",
    tags=["Schemes"]
)

# Use schemes collection
schemes_collection = db["schemes"]

# Seed data for Popular Schemes
SEED_SCHEMES = [
    {
        "id": "PMK",
        "title": "PM-Kisan Samman Nidhi",
        "tagline": "Farmer Support",
        "status": "Active",
        "icon": "leaf"
    },
    {
        "id": "ABC",
        "title": "Ayushman Bharat Card",
        "tagline": "Health Insurance",
        "status": "In Progress",
        "icon": "heart-pulse"
    },
    {
        "id": "PAY",
        "title": "PM Awas Yojana",
        "tagline": "Housing for All",
        "status": "Not Applied",
        "icon": "home"
    },
    {
        "id": "SP",
        "title": "Scholarship Portal",
        "tagline": "Education Support",
        "status": "Active",
        "icon": "graduation-cap"
    },
    {
        "id": "UY",
        "title": "Ujjwala Yojana",
        "tagline": "Clean Cooking",
        "status": "Active",
        "icon": "flame"
    },
    {
        "id": "PMY",
        "title": "PM Mudra Yojana",
        "tagline": "Small Business Loan",
        "status": "In Progress",
        "icon": "indian-rupee"
    },
    {
        "id": "PY",
        "title": "Pension Yojana",
        "tagline": "Senior Citizen Support",
        "status": "Not Eligible",
        "icon": "user"
    },
    {
        "id": "JDY",
        "title": "Jan Dhan Yojana",
        "tagline": "Financial Inclusion",
        "status": "Active",
        "icon": "landmark"
    }
]

def seed_schemes():
    if schemes_collection.count_documents({}) == 0:
        schemes_collection.insert_many(SEED_SCHEMES)

# Execute seed on import
seed_schemes()

@router.get("/")
def get_schemes():
    schemes = list(schemes_collection.find())
    return mongo_to_dict(schemes)
