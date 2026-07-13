from fastapi import APIRouter
from pydantic import BaseModel
from Database.db import db
from Utils.helpers import mongo_to_dict
from datetime import datetime

router = APIRouter(
    prefix="/support",
    tags=["Support"]
)

support_collection = db["support_tickets"]
faqs_collection = db["faqs"]

SEED_FAQS = [
    {
        "question": "How do I update my Aadhar details?",
        "answer": "You can update your Aadhar details by uploading a new copy in the My Documents section. Our AI will automatically extract and verify the new information."
    },
    {
        "question": "Why is my application Under Review for so long?",
        "answer": "Application processing times vary by department. Typical review times are 7-14 business days. Check the Notifications tab for requests for additional documents."
    },
    {
        "question": "Is my data secure?",
        "answer": "Yes, all uploaded documents are encrypted and processed securely. We only extract the necessary fields to determine your eligibility."
    }
]

def seed_faqs():
    if faqs_collection.count_documents({}) == 0:
        faqs_collection.insert_many(SEED_FAQS)

seed_faqs()

class FeedbackTicket(BaseModel):
    subject: str
    message: str

@router.get("/faqs")
def get_faqs():
    faqs = list(faqs_collection.find())
    return mongo_to_dict(faqs)

@router.post("/feedback")
def submit_feedback(ticket: FeedbackTicket):
    doc = {
        "subject": ticket.subject,
        "message": ticket.message,
        "status": "Open",
        "created_at": datetime.utcnow().isoformat()
    }
    result = support_collection.insert_one(doc)
    return {"message": "Feedback submitted successfully", "ticket_id": str(result.inserted_id)}
