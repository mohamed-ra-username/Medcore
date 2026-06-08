from persistence.json_repository import (
    home_patients, claims_data, invoices, companies, 
    appointments, phones, approvals_data, save_data
)
from persistence.user_repository import users

def delete_home_patient(id: int):
    if 0 <= id < len(home_patients):
        deleted = home_patients.pop(id)
        save_data()
        return {"success": True, "data": deleted}
    return None

def delete_claim(id: int):
    if 0 <= id < len(claims_data):
        deleted = claims_data.pop(id)
        save_data()
        return {"success": True, "data": deleted}
    return None

def delete_invoice(id: int):
    if 0 <= id < len(invoices):
        deleted = invoices.pop(id)
        save_data()
        return {"success": True, "data": deleted}
    return None

def delete_company(id: int):
    if 0 <= id < len(companies):
        deleted = companies.pop(id)
        save_data()
        return {"success": True, "data": deleted}
    return None

def delete_appointment(id: int):
    if 0 <= id < len(appointments):
        deleted = appointments.pop(id)
        save_data()
        return {"success": True, "data": deleted}
    return None

def delete_user(id: int):
    if 0 <= id < len(users):
        deleted = users.pop(id)
        from persistence.user_repository import save_users
        save_users()
        return {"success": True, "data": deleted}
    return None

def delete_phone(id: int):
    if 0 <= id < len(phones):
        deleted = phones.pop(id)
        save_data()
        return {"success": True, "data": deleted}
    return None

def delete_approval(id: int):
    if 0 <= id < len(approvals_data):
        deleted = approvals_data.pop(id)
        save_data()
        return {"success": True, "data": deleted}
    return None
