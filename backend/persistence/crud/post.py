from persistence import json_repository as json_db
from persistence import user_repository as user_db

def add_home_patient(data: dict):
    json_db.home_patients.insert(0, data)
    json_db.save_data()
    return {"success": True, "data": data}

def add_claim(data: dict):
    json_db.claims_data.insert(0, data)
    json_db.save_data()
    return {"success": True, "data": data}

def add_invoice(data: dict):
    json_db.invoices.insert(0, data)
    json_db.save_data()
    return {"success": True, "data": data}

def add_company(data: dict):
    json_db.companies.insert(0, data)
    json_db.save_data()
    return {"success": True, "data": data}

def add_appointment(data: dict):
    json_db.appointments.insert(0, data)
    json_db.save_data()
    return {"success": True, "data": data}

def add_user(data: str):
    user_db.users.insert(0, data)
    user_db.save_users()
    return {"success": True, "data": data}

def add_phone(data: str):
    json_db.phones.insert(0, data)
    json_db.save_data()
    return {"success": True, "data": data}

def add_approval(data: dict):
    json_db.approvals_data.insert(0, data)
    json_db.save_data()
    return {"success": True, "data": data}
