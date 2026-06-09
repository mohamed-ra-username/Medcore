import json
import pathlib

file_name = "data.json"
data_base_folder_name = "data"
project_root = pathlib.Path(__file__).parent.parent.parent
data_file = project_root / data_base_folder_name / file_name

# Initialize variables separately to avoid shared reference bugs
appointments = []
companies = []
invoices = []
claims_data = []
approvals_data = []
home_patients = []


def load_data():
    global appointments, companies, invoices, claims_data, approvals_data, home_patients

    try:
        if not data_file.exists():
            save_data()
            return

        with open(data_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            appointments = data.get("appointments", [])
            companies = data.get("companies", [])
            invoices = data.get("invoices", [])
            # Map camelCase JSON keys to snake_case Python variables
            claims_data = data.get("claimsData", [])
            approvals_data = data.get("approvalsData", [])
            home_patients = data.get("homePatients", [])
    except (FileNotFoundError, json.JSONDecodeError):
        appointments = []
        companies = []
        invoices = []
        claims_data = []
        approvals_data = []
        home_patients = []


def save_data():
    # Map snake_case Python variables back to camelCase JSON keys for frontend compatibility
    data = {
        "appointments": appointments,
        "companies": companies,
        "invoices": invoices,
        "claimsData": claims_data,
        "approvalsData": approvals_data,
        "homePatients": home_patients,
    }
    with open(data_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)


load_data()
