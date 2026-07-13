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

@router.get("/{user_id}")
def get_user(user_id: str):
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            return mongo_to_dict(user)
        return {"error": "User not found"}
    except:
        return {"error": "Invalid User ID"}