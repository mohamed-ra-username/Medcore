from ..data_handler import homePatients, claimsData, invoices, companies, appointments, save_data

def add_homePatient(data: dict):
    homePatients.insert(0, data)
    save_data()
    return {"status": "success", "data": data}

def add_claim(data: dict):
    claimsData.insert(0, data)
    save_data()
    return {"status": "success", "data": data}

def add_invoice(data: dict):
    invoices.insert(0, data)
    save_data()
    return {"status": "success", "data": data}

def add_company(data: dict):
    companies.insert(0, data)
    save_data()
    return {"status": "success", "data": data}

def add_appointment(data: dict):
    appointments.insert(0, data)
    save_data()
    return {"status": "success", "data": data}
