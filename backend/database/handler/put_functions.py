from ..data_handler import homePatients, claimsData, invoices, companies, appointments, save_data

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
