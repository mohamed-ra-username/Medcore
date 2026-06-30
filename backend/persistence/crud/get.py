from typing import Any


from persistence import json_repository as json_db
from persistence import user_repository as user_db

UNKNOWN = object()

def _get_one_or_none(something: list, id: Any):
    if id is None or id == UNKNOWN: return None
    return next((item for item in something if str(item.get("id")) == str(id)), None)

def _get_one_or_all(something: list, id: Any):
    if id is None or id == UNKNOWN: return something
    item = next((item for item in something if str(item.get("id")) == str(id)), None)
    return item if item else something

def get_user(id=None): return _get_one_or_none(user_db.users, id)
def get_users(id=None): return _get_one_or_all(user_db.users, id)
def get_invoices(id=None): return _get_one_or_all(json_db.invoices, id)
def get_appointments(id=None): return _get_one_or_all(json_db.appointments, id)
def get_companies(id=None): return _get_one_or_all(json_db.companies, id)
def get_claims(id=None): return _get_one_or_all(json_db.claims_data, id)
def get_approvals(id=None): return _get_one_or_all(json_db.approvals_data, id)

def get_patients(id: int | slice | Any = UNKNOWN):
    return _get_one_or_all(json_db.patients, id)

