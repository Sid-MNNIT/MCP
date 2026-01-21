from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["jobsy"]
collection = db["contexts"]

def mark_as_processed(doc_id):
    collection.update_one(
        {"_id": doc_id},
        {"$set": {"processed": True}}
    )
