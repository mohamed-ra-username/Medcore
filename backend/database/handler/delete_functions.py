from ..data_handler import homePatients, claimsData, invoices, companies, appointments, save_data

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
