from pymongo import MongoClient
from datetime import datetime

# 1. Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017")

# 2. Select DB and collection
db = client["jobsy"]
collection = db["contexts"]

def save_context(context: dict):
    """
    Saves wrapped context into MongoDB
    """
    context["stored_at"] = datetime.utcnow()
    result = collection.insert_one(context)
    return result.inserted_id
