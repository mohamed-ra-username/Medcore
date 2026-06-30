# --- AGGREGATOR INTERFACE ---
# This file is the one and only entry point for the rest of the backend.

from . import json_repository as json_db
from . import user_repository as user_db

# 1. Export raw data modules
save_data = json_db.save_data
load_data = json_db.load_data
data_file = json_db.data_file

load_users = user_db.load_users
save_users = user_db.save_users
users_file = user_db.users_file
get_user_by_email = user_db.get_user_by_email
add_auth_user = user_db.add_user
get_all_users = user_db.get_all_users

# 2. Import all CRUD functions
from .crud.get import (
    get_user, get_users, get_invoices,
    get_appointments, get_companies, get_claims,
    get_approvals, get_patients
)
from .crud.post import (
    add_patient, add_claim, add_invoice,
    add_company, add_appointment, add_user,  add_approval
)
from .crud.put import (
    update_patient, update_claim_status, update_claim,
    update_appointment, update_company, update_invoice,
    update_approval, update_user, )
from .crud.delete import (
    delete_patient, delete_claim, delete_invoice,
    delete_company, delete_appointment, delete_user,
     delete_approval
)

