from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Department(BaseModel):
    name: str
    description: Optional[str] = None

    head: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

    city: Optional[str] = None

    is_active: bool = True

    created_at: datetime = datetime.utcnow()