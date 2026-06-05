import json
import pathlib

file_name = "data.json"
data_base_folder_name = "data"
project_root = pathlib.Path(__file__).parent.parent.parent
file = project_root / data_base_folder_name / file_name

# initialize variables
users = appointments = companies = phones = invoices = claimsData = approvalsData = homePatients = []

def load_data():
    global users, appointments, companies, phones, invoices, claimsData, approvalsData, homePatients

    try:
        with open(file, "r", encoding="utf-8") as f:
            data = json.load(f)
            users = data.get("users", [])
            appointments = data.get("appointments", [])
            companies = data.get("companies", [])
            phones = data.get("phones", [])
            invoices = data.get("invoices", [])
            claimsData = data.get("claimsData", [])
            approvalsData = data.get("approvalsData", [])
            homePatients = data.get("homePatients", [])
    except (FileNotFoundError, json.JSONDecodeError):
        users = appointments = companies = phones = invoices = claimsData = approvalsData = homePatients = []

def save_data():
    data = {
        "users": users, "appointments": appointments, "companies": companies, "phones": phones,
        "invoices": invoices, "claimsData": claimsData, "approvalsData": approvalsData, "homePatients": homePatients,
    }
    with open(file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

load_data()
