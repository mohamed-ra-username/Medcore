from persistence import json_repository as json_db
from persistence import user_repository as user_db

def update_home_patient(id: int, data: dict):
    if 0 <= id < len(json_db.home_patients):
        json_db.home_patients[id] = data
        json_db.save_data()
        return {"success": True, "data": data}
    return None

def update_claim_status(id: int, status: str):
    if 0 <= id < len(json_db.claims_data):
        json_db.claims_data[id]["status"] = status
        json_db.save_data()
        return {"success": True}
    return None

def update_claim(id: int, data: dict):
    if 0 <= id < len(json_db.claims_data):
        json_db.claims_data[id] = data
        json_db.save_data()
        return {"success": True, "data": data}
    return None

def update_appointment(id: int, data: dict):
    if 0 <= id < len(json_db.appointments):
        json_db.appointments[id] = data
        json_db.save_data()
        return {"success": True, "data": data}
    return None

def update_company(id: int, data: dict):
    if 0 <= id < len(json_db.companies):
        json_db.companies[id] = data
        json_db.save_data()
        return {"success": True, "data": data}
    return None

def update_invoice(id: int, data: dict):
    if 0 <= id < len(json_db.invoices):
        json_db.invoices[id] = data
        json_db.save_data()
        return {"success": True, "data": data}
    return None

def update_approval(id: int, data: dict):
    if 0 <= id < len(json_db.approvals_data):
        json_db.approvals_data[id] = data
        json_db.save_data()
        return {"success": True, "data": data}
    return None

def update_user(id: int, data: str):
    if 0 <= id < len(user_db.users):
        user_db.users[id] = data
        user_db.save_users()
        return {"success": True, "data": data}
    return None

def update_phone(id: int, data: str):
    if 0 <= id < len(json_db.phones):
        json_db.phones[id] = data
        json_db.save_data()
        return {"success": True, "data": data}
    return None
