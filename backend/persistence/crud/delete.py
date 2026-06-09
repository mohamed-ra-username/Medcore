from persistence import json_repository as json_db
from persistence import user_repository as user_db
from typing import Any

def _find_index_by_id(something: list, id: Any):
    for i, item in enumerate(something):
        if str(item.get("id")) == str(id):
            return i
    return -1

def delete_home_patient(id: Any):
    idx = _find_index_by_id(json_db.home_patients, id)
    if idx != -1:
        deleted = json_db.home_patients.pop(idx)
        json_db.save_data()
        return {"success": True, "data": deleted}
    return None

def delete_claim(id: Any):
    idx = _find_index_by_id(json_db.claims_data, id)
    if idx != -1:
        deleted = json_db.claims_data.pop(idx)
        json_db.save_data()
        return {"success": True, "data": deleted}
    return None

def delete_invoice(id: Any):
    idx = _find_index_by_id(json_db.invoices, id)
    if idx != -1:
        deleted = json_db.invoices.pop(idx)
        json_db.save_data()
        return {"success": True, "data": deleted}
    return None

def delete_company(id: Any):
    idx = _find_index_by_id(json_db.companies, id)
    if idx != -1:
        deleted = json_db.companies.pop(idx)
        json_db.save_data()
        return {"success": True, "data": deleted}
    return None

def delete_appointment(id: Any):
    idx = _find_index_by_id(json_db.appointments, id)
    if idx != -1:
        deleted = json_db.appointments.pop(idx)
        json_db.save_data()
        return {"success": True, "data": deleted}
    return None

def delete_user(id: Any):
    idx = _find_index_by_id(user_db.users, id)
    if idx != -1:
        deleted = user_db.users.pop(idx)
        user_db.save_users()
        return {"success": True, "data": deleted}
    return None

def delete_approval(id: Any):
    idx = _find_index_by_id(json_db.approvals_data, id)
    if idx != -1:
        deleted = json_db.approvals_data.pop(idx)
        json_db.save_data()
        return {"success": True, "data": deleted}
    return None
