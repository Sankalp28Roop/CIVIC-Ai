from fastapi import APIRouter
from Database.db import users_collection
from Models.user import User
from Utils.helpers import mongo_to_dict
from bson.objectid import ObjectId

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/register")
def register(user: User):
    user_dict = user.model_dump() if hasattr(user, "model_dump") else user.dict()
    result = users_collection.insert_one(user_dict)
    return {"message": "Registered", "user_id": str(result.inserted_id)}

@router.get("/")
def get_users():
    users = list(users_collection.find())
    return mongo_to_dict(users)

@router.get("/me/profile")
def get_my_profile():
    return {
        "id": "usr_12345",
        "full_name": "Sankalp Swaroop",
        "email": "sankalp.swaroop@example.com",
        "role": "admin"
    }

@router.get("/{user_id}")
def get_user(user_id: str):
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            return mongo_to_dict(user)
        return {"error": "User not found"}
    except:
        return {"error": "Invalid User ID"}

@router.get("/me/settings")
def get_settings():
    # Use a dummy user settings doc for global preferences
    settings = users_collection.find_one({"_id": "global_settings_mock"})
    if not settings:
        default_settings = {
            "_id": "global_settings_mock",
            "notificationsEnabled": True,
            "emailAlerts": True,
            "smsAlerts": False,
            "twoFactorAuth": False,
            "display_language": "English",
            "system_theme": "System",
            "font_size": "Default",
            "high_contrast": False
        }
        users_collection.insert_one(default_settings)
        settings = default_settings
        
    return mongo_to_dict(settings)

from pydantic import BaseModel
class SettingsUpdate(BaseModel):
    notificationsEnabled: bool = None
    emailAlerts: bool = None
    smsAlerts: bool = None
    twoFactorAuth: bool = None
    display_language: str = None
    system_theme: str = None
    font_size: str = None
    high_contrast: bool = None

@router.put("/me/settings")
def update_settings(settings: SettingsUpdate):
    update_data = settings.dict(exclude_unset=True)
    users_collection.update_one(
        {"_id": "global_settings_mock"}, 
        {"$set": update_data}, 
        upsert=True
    )
    return {"message": "Settings updated successfully", "updated": update_data}