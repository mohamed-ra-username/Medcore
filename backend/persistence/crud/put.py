from persistence import json_repository as json_db
from persistence import user_repository as user_db
from typing import Any

def _find_index_by_id(something: list, id: Any):
    for i, item in enumerate(something):
        if str(item.get("id")) == str(id):
            return i
    return -1

def update_home_patient(id: Any, data: dict):
    idx = _find_index_by_id(json_db.home_patients, id)
    if idx != -1:
        json_db.home_patients[idx] = data
        json_db.save_data()
        return {"success": True, "data": data}
    return None

def update_claim_status(id: Any, status: str):
    idx = _find_index_by_id(json_db.claims_data, id)
    if idx != -1:
        json_db.claims_data[idx]["status"] = status
        json_db.save_data()
        return {"success": True}
    return None

def update_claim(id: Any, data: dict):
    idx = _find_index_by_id(json_db.claims_data, id)
    if idx != -1:
        json_db.claims_data[idx] = data
        json_db.save_data()
        return {"success": True, "data": data}
    return None

def update_appointment(id: Any, data: dict):
    idx = _find_index_by_id(json_db.appointments, id)
    if idx != -1:
        json_db.appointments[idx] = data
        json_db.save_data()
        return {"success": True, "data": data}
    return None

def update_company(id: Any, data: dict):
    idx = _find_index_by_id(json_db.companies, id)
    if idx != -1:
        json_db.companies[idx] = data
        json_db.save_data()
        return {"success": True, "data": data}
    return None

def update_invoice(id: Any, data: dict):
    idx = _find_index_by_id(json_db.invoices, id)
    if idx != -1:
        json_db.invoices[idx] = data
        json_db.save_data()
        return {"success": True, "data": data}
    return None

def update_approval(id: Any, data: dict):
    idx = _find_index_by_id(json_db.approvals_data, id)
    if idx != -1:
        json_db.approvals_data[idx] = data
        json_db.save_data()
        return {"success": True, "data": data}
    return None

def update_user(id: Any, data: str):
    idx = _find_index_by_id(user_db.users, id)
    if idx != -1:
        user_db.users[idx] = data
        user_db.save_users()
        return {"success": True, "data": data}
    return None

