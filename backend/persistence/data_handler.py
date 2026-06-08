# --- AGGREGATOR INTERFACE ---
# This file is the one and only entry point for the rest of the backend.

# 1. Import raw data lists
from .json_repository import (
    save_data, load_data, appointments, companies, 
    phones, invoices, claims_data, approvals_data, home_patients, data_file
)
from .user_repository import (
    users as auth_users, load_users, save_users, 
    get_user_by_email, add_user as add_auth_user, get_all_users, users_file
)

# 2. Import all CRUD functions
from .crud.get import (
    get_user, get_users, get_invoices, get_phones, 
    get_appointments, get_companies, get_claims, 
    get_approvals, get_home_patients, get_stats
)
from .crud.post import (
    add_home_patient, add_claim, add_invoice, 
    add_company, add_appointment, add_user, add_phone, add_approval
)
from .crud.put import (
    update_home_patient, update_claim_status, update_claim, 
    update_appointment, update_company, update_invoice, 
    update_approval, update_user, update_phone
)
from .crud.delete import (
    delete_home_patient, delete_claim, delete_invoice, 
    delete_company, delete_appointment, delete_user, 
    delete_phone, delete_approval
)
