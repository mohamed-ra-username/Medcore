from persistence.json_repository import (
    home_patients, claims_data, invoices, companies, 
    appointments, phones, approvals_data, save_data
)
from persistence.user_repository import users

def add_home_patient(data: dict):
    home_patients.insert(0, data)
    save_data()
    return {"success": True, "data": data}

def add_claim(data: dict):
    claims_data.insert(0, data)
    save_data()
    return {"success": True, "data": data}

def add_invoice(data: dict):
    invoices.insert(0, data)
    save_data()
    return {"success": True, "data": data}

def add_company(data: dict):
    companies.insert(0, data)
    save_data()
    return {"success": True, "data": data}

def add_appointment(data: dict):
    appointments.insert(0, data)
    save_data()
    return {"success": True, "data": data}

def add_user(data: str):
    users.insert(0, data)
    # Note: user_repository.save_users() should probably be called instead of json_repository.save_data() 
    # if users are in a separate file.
    from persistence.user_repository import save_users
    save_users()
    return {"success": True, "data": data}

def add_phone(data: str):
    phones.insert(0, data)
    save_data()
    return {"success": True, "data": data}

def add_approval(data: dict):
    approvals_data.insert(0, data)
    save_data()
    return {"success": True, "data": data}
