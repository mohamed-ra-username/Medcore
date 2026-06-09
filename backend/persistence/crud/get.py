from typing import Any

from persistence.enums import status
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

def get_home_patients(id: int | slice | Any = UNKNOWN):
    return _get_one_or_all(json_db.home_patients, id)

def get_stats():
    st = {
        "home": {
            "patients": len([p for p in json_db.home_patients if p.get("status") == status.ACTIVE]),
            "appts": len([a for a in json_db.appointments if a.get("status") == status.ACTIVE]),
            "claims": len([c for c in json_db.claims_data if c.get("status") == status.PENDING]),
            "revenue": sum(int(c.get("amount", 0) or 0) for c in json_db.claims_data if c.get("status") == status.APPROVED)
        },
        "insurance": {
            "total": len(json_db.companies),
            "claims": sum(int(c.get("claims", 0) or 0) for c in json_db.companies),
            "active": len([c for c in json_db.companies if c.get("status") == status.ACTIVE]),
            "expiring": len([c for c in json_db.companies if c.get("status") == status.EXPIRING]),
            "pending": len([a for a in json_db.approvals_data if a.get("status") == status.PENDING]),
        },
        "claims": {
            "pending": len([c for c in json_db.claims_data if c.get("status") == status.PENDING]),
            "approved": len([c for c in json_db.claims_data if c.get("status") == status.APPROVED]),
            "rejected": len([c for c in json_db.claims_data if c.get("status") == status.REJECTED]),
            "total_amount": sum(int(c.get("amount", 0) or 0) for c in json_db.claims_data)
        },
        "billing": {
            "total": sum(int(v.get("amount", 0) or 0) for v in json_db.invoices),
            "collected": sum(int(v.get("amount", 0) or 0) for v in json_db.invoices if v.get("status") == status.DONE),
            "ins_due": sum(int(v.get("amount", 0) or 0) for v in json_db.invoices if v.get("status") == status.PENDING),
            "overdue": sum(int(v.get("amount", 0) or 0) for v in json_db.invoices if v.get("status") == status.REJECTED)
        }
    }
    return st
