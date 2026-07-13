from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Complaint(BaseModel):
    title: str
    description: str

    category: str
    detected_object: str

    severity: str
    priority: int

    latitude: float
    longitude: float
    address: str

    image_url: Optional[str] = None

    user_id: str

    status: str = "Pending"

    ai_summary: Optional[str] = None

    created_at: datetime = datetime.utcnow()