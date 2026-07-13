from pydantic import BaseModel, EmailStr
from typing import Optional


class User(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    address: Optional[str] = None
    city: Optional[str] = None
    is_active: bool = True