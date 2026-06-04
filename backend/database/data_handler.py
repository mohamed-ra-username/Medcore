# from .enums import status
import json
import pathlib

file_name = "data.json"
file = pathlib.Path(__file__).parent.parent.parent / "data" / file_name

# initizalize variables to avoid NameError when using partial before assignment
users = appointments = companies = phones = invoices = claimsData = approvalsData = homePatients = []

def load_data():
    global users, appointments, companies, phones, invoices, claimsData, approvalsData, homePatients
    
    # Template for a fresh database
    template = {
        "users": [], "appointments": [], "companies": [], "phones": [],
        "invoices": [], "claimsData": [], "approvalsData": [], "homePatients": []
    }

    try:
        if not file.exists():
            print("🚀 Self-Healing: data.json not found. Creating from template...")
            with open(file, "w", encoding="utf-8") as f:
                json.dump(template, f, indent=4)
        
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
            
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"⚠️ Warning: Database corrupted or missing ({e}). Using empty state.")
        users, appointments, companies, phones, invoices, claimsData, approvalsData, homePatients = (
            template[k] for k in template
        )

def save_data():
    data = {
        "users": users,
        "appointments": appointments,
        "companies": companies,
        "phones": phones,
        "invoices": invoices,
        "claimsData": claimsData,
        "approvalsData": approvalsData,
        "homePatients": homePatients,
    }

    with open(file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

load_data()
