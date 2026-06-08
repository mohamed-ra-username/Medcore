from persistence.json_repository import (
    home_patients, claims_data, invoices, companies, 
    appointments, phones, approvals_data, save_data
)
from persistence.user_repository import users

def update_home_patient(id: int, data: dict):
    if 0 <= id < len(home_patients):
        home_patients[id] = data
        save_data()
        return {"success": True, "data": data}
    return None

def update_claim_status(id: int, status: str):
    if 0 <= id < len(claims_data):
        claims_data[id]["status"] = status
        save_data()
        return {"success": True}
    return None

def update_claim(id: int, data: dict):
    if 0 <= id < len(claims_data):
        claims_data[id] = data
        save_data()
        return {"success": True, "data": data}
    return None

def update_appointment(id: int, data: dict):
    if 0 <= id < len(appointments):
        appointments[id] = data
        save_data()
        return {"success": True, "data": data}
    return None

def update_company(id: int, data: dict):
    if 0 <= id < len(companies):
        companies[id] = data
        save_data()
        return {"success": True, "data": data}
    return None

def update_invoice(id: int, data: dict):
    if 0 <= id < len(invoices):
        invoices[id] = data
        save_data()
        return {"success": True, "data": data}
    return None

def update_approval(id: int, data: dict):
    if 0 <= id < len(approvals_data):
        approvals_data[id] = data
        save_data()
        return {"success": True, "data": data}
    return None

def update_user(id: int, data: str):
    if 0 <= id < len(users):
        users[id] = data
        from persistence.user_repository import save_users
        save_users()
        return {"success": True, "data": data}
    return None

def update_phone(id: int, data: str):
    if 0 <= id < len(phones):
        phones[id] = data
        save_data()
        return {"success": True, "data": data}
    return None
