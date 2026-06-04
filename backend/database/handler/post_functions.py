from ..data_handler import homePatients, claimsData, invoices, companies, appointments, users, phones, approvalsData, save_data

def add_homePatient(data: dict):
    homePatients.insert(0, data)
    save_data()
    return {"success": True, "data": data}

def add_claim(data: dict):
    claimsData.insert(0, data)
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
    save_data()
    return {"success": True, "data": data}

def add_phone(data: str):
    phones.insert(0, data)
    save_data()
    return {"success": True, "data": data}

def add_approval(data: dict):
    approvalsData.insert(0, data)
    save_data()
    return {"success": True, "data": data}
