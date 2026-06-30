from persistence import json_repository as json_db
from persistence import user_repository as user_db
import uuid

def _ensure_id(data: dict):
    if not data.get("id"):
        data["id"] = str(uuid.uuid4())
    return data

def add_patient(data: dict):
    data = _ensure_id(data)
    if not data.get("name"):
        return {"success":False,"error":"No name"}
    json_db.patients.insert(0, data)
    json_db.save_data()
    return {"success": True, "data": data}

def add_claim(data: dict):
    data = _ensure_id(data)
    json_db.claims_data.insert(0, data)
    json_db.save_data()
    return {"success": True, "data": data}

def add_invoice(data: dict):
    data = _ensure_id(data)
    json_db.invoices.insert(0, data)
    json_db.save_data()
    return {"success": True, "data": data}

def add_company(data: dict):
    data = _ensure_id(data)
    json_db.companies.insert(0, data)
    json_db.save_data()
    return {"success": True, "data": data}

def add_appointment(data: dict):
    data = _ensure_id(data)
    json_db.appointments.insert(0, data)
    json_db.save_data()
    return {"success": True, "data": data}

def add_user(data: str):
    # For users, if data is a dict (new structure) add ID
    if isinstance(data, dict):
        data = _ensure_id(data)
    user_db.users.insert(0, data)
    user_db.save_users()
    return {"success": True, "data": data}

def add_approval(data: dict):
    data = _ensure_id(data)
    json_db.approvals_data.insert(0, data)
    json_db.save_data()
    return {"success": True, "data": data}
