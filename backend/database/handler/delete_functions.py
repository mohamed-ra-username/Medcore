from ..data_handler import homePatients, claimsData, invoices, companies, appointments, users, phones, approvalsData, save_data

def delete_homePatient(id: int):
    if 0 <= id < len(homePatients):
        deleted = homePatients.pop(id)
        save_data()
        return {"status": "success", "data": deleted}
    return None

def delete_claim(id: int):
    if 0 <= id < len(claimsData):
        deleted = claimsData.pop(id)
        save_data()
        return {"status": "success", "data": deleted}
    return None

def delete_invoice(id: int):
    if 0 <= id < len(invoices):
        deleted = invoices.pop(id)
        save_data()
        return {"status": "success", "data": deleted}
    return None

def delete_company(id: int):
    if 0 <= id < len(companies):
        deleted = companies.pop(id)
        save_data()
        return {"status": "success", "data": deleted}
    return None

def delete_appointment(id: int):
    if 0 <= id < len(appointments):
        deleted = appointments.pop(id)
        save_data()
        return {"status": "success", "data": deleted}
    return None

def delete_user(id: int):
    if 0 <= id < len(users):
        deleted = users.pop(id)
        save_data()
        return {"status": "success", "data": deleted}
    return None

def delete_phone(id: int):
    if 0 <= id < len(phones):
        deleted = phones.pop(id)
        save_data()
        return {"status": "success", "data": deleted}
    return None

def delete_approval(id: int):
    if 0 <= id < len(approvalsData):
        deleted = approvalsData.pop(id)
        save_data()
        return {"status": "success", "data": deleted}
    return None
