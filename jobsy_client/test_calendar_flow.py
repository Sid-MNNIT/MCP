from pymongo import MongoClient
from calendar_detector import is_calendar_worthy

client = MongoClient("mongodb://localhost:27017")
db = client["jobsy"]
collection = db["contexts"]

calendar_items = []

for doc in collection.find({"processed": False, "type": "job"}):
    result = is_calendar_worthy(doc)
    if result:
        collection.update_one(
            {"_id": doc["_id"]},
            {
                "$set": {
                    "event_hint": result,
                    "processed": True
                }
            }
        )
        calendar_items.append(doc)

print(f"Found {len(calendar_items)} calendar-worthy items")
