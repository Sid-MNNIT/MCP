from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["jobsy"]
collection = db["contexts"]

def get_unprocessed_calendar_items():
    """
    Fetch job-related contexts that should go to calendar
    """
    return list(collection.find({
        "type": "job",
        "processed": False,
        "date": {"$ne": None}
    }))
