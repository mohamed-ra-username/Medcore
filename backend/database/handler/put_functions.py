from ..data_handler import homePatients, claimsData, invoices, companies, appointments, users, phones, approvalsData, save_data

def update_homePatient(id: int, data: dict):
    if 0 <= id < len(homePatients):
        homePatients[id] = data
        save_data()
        return {"status": "success", "data": data}
    return None

def update_claim_status(id: int, status: str):
    if 0 <= id < len(claimsData):
        claimsData[id]["status"] = status
        save_data()
        return {"status": "success"}
    return None

def update_claim(id: int, data: dict):
    if 0 <= id < len(claimsData):
        claimsData[id] = data
        save_data()
        return {"status": "success", "data": data}
    return None

def update_appointment(id: int, data: dict):
    if 0 <= id < len(appointments):
        appointments[id] = data
        save_data()
        return {"status": "success", "data": data}
    return None

def update_company(id: int, data: dict):
    if 0 <= id < len(companies):
        companies[id] = data
        save_data()
        return {"status": "success", "data": data}
    return None

def update_invoice(id: int, data: dict):
    if 0 <= id < len(invoices):
        invoices[id] = data
        save_data()
        return {"status": "success", "data": data}
    return None

def update_approval(id: int, data: dict):
    if 0 <= id < len(approvalsData):
        approvalsData[id] = data
        save_data()
        return {"status": "success", "data": data}
    return None

def update_user(id: int, data: str):
    if 0 <= id < len(users):
        users[id] = data
        save_data()
        return {"status": "success", "data": data}
    return None

def update_phone(id: int, data: str):
    if 0 <= id < len(phones):
        phones[id] = data
        save_data()
        return {"status": "success", "data": data}
    return None
