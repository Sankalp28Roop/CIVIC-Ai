import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "CivicAI")

client = MongoClient(MONGO_URI)

db = client[DATABASE_NAME]


users_collection = db["users"]

admins_collection = db["admins"]

complaints_collection = db["complaints"]

tracking_collection = db["tracking"]

analytics_collection = db["analytics"]

print(f"Connected to MongoDB Atlas: {DATABASE_NAME}")