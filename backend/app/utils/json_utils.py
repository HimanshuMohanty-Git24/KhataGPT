# filepath: d:\SIDE GIG\KathaGPTv2\backend\app\utils\json_utils.py
from bson import ObjectId
from datetime import datetime

def serialize_mongo_doc(doc):
    """Convert MongoDB document to a JSON-serializable format"""
    if doc is None:
        return None
        
    result = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, dict):
            result[key] = serialize_mongo_doc(value)
        elif isinstance(value, list):
            result[key] = [serialize_mongo_doc(item) if isinstance(item, dict) else item for item in value]
        else:
            result[key] = value
    return result