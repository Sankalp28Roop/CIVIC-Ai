from datetime import datetime
import uuid


def generate_complaint_id():
    """Generate unique complaint ID"""
    return f"CMP-{uuid.uuid4().hex[:8].upper()}"


def current_time():
    """Return current UTC time"""
    return datetime.utcnow()


def success_response(message, data=None):
    return {
        "success": True,
        "message": message,
        "data": data
    }


def error_response(message):
    return {
        "success": False,
        "message": message
    }

def mongo_to_dict(obj):
    if not obj:
        return obj
    if isinstance(obj, list):
        return [mongo_to_dict(o) for o in obj]
    if isinstance(obj, dict):
        if "_id" in obj:
            obj["id"] = str(obj.pop("_id"))
        return obj
    return obj