from persistence import json_repository as json_db
from persistence import user_repository as user_db

def delete_home_patient(id: int):
    if 0 <= id < len(json_db.home_patients):
        deleted = json_db.home_patients.pop(id)
        json_db.save_data()
        return {"success": True, "data": deleted}
    return None

def delete_claim(id: int):
    if 0 <= id < len(json_db.claims_data):
        deleted = json_db.claims_data.pop(id)
        json_db.save_data()
        return {"success": True, "data": deleted}
    return None

def delete_invoice(id: int):
    if 0 <= id < len(json_db.invoices):
        deleted = json_db.invoices.pop(id)
        json_db.save_data()
        return {"success": True, "data": deleted}
    return None

def delete_company(id: int):
    if 0 <= id < len(json_db.companies):
        deleted = json_db.companies.pop(id)
        json_db.save_data()
        return {"success": True, "data": deleted}
    return None

def delete_appointment(id: int):
    if 0 <= id < len(json_db.appointments):
        deleted = json_db.appointments.pop(id)
        json_db.save_data()
        return {"success": True, "data": deleted}
    return None

def delete_user(id: int):
    if 0 <= id < len(user_db.users):
        deleted = user_db.users.pop(id)
        user_db.save_users()
        return {"success": True, "data": deleted}
    return None

def delete_phone(id: int):
    if 0 <= id < len(json_db.phones):
        deleted = json_db.phones.pop(id)
        json_db.save_data()
        return {"success": True, "data": deleted}
    return None

def delete_approval(id: int):
    if 0 <= id < len(json_db.approvals_data):
        deleted = json_db.approvals_data.pop(id)
        json_db.save_data()
        return {"success": True, "data": deleted}
    return None
