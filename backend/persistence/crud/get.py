from functools import partial
from typing import Any

from persistence.enums import status
from persistence.json_repository import users, appointments, companies, phones, invoices, claimsData, approvalsData, homePatients

UNKNOWN = object()

def _get_one_or_none(something: list, id: int|None):
    try:
        return something[id] # type: ignore
    except (KeyError, IndexError, TypeError):
        return None

def _get_one_or_all(something: list, id: slice | int | None):
    try:
        return something[id] # type: ignore
    except (KeyError, IndexError, TypeError):
        return something

get_user = partial(_get_one_or_none, users)
get_users = partial(_get_one_or_all, users)
get_invoices = partial(_get_one_or_all, invoices)
get_phones = partial(_get_one_or_all, phones)
get_appointments = partial(_get_one_or_all, appointments)
get_companies = partial(_get_one_or_all, companies)
get_claims = partial(_get_one_or_all, claimsData)
get_approvals = partial(_get_one_or_all, approvalsData)

def get_homePatients(id: int | slice | Any = UNKNOWN):
    return _get_one_or_all(homePatients, id)

def get_stats():
    st = {
        "home": {
            "patients": len([p for p in homePatients if p.get("status") == status.ACTIVE]),
            "appts": len([a for a in appointments if a.get("status") == status.ACTIVE]),
            "claims": len([c for c in claimsData if c.get("status") == status.PENDING]),
            "revenue": sum(int(c.get("amount", 0) or 0) for c in claimsData if c.get("status") == status.APPROVED)
        },
        "insurance": {
            "total": len(companies),
            "claims": sum(int(c.get("claims", 0) or 0) for c in companies),
            "active": len([c for c in companies if c.get("status") == status.ACTIVE]),
            "expiring": len([c for c in companies if c.get("status") == status.EXPIRING]),
            "pending": len([a for a in approvalsData if a.get("status") == status.PENDING]),
        },
        "claims": {
            "pending": len([c for c in claimsData if c.get("status") == status.PENDING]),
            "approved": len([c for c in claimsData if c.get("status") == status.APPROVED]),
            "rejected": len([c for c in claimsData if c.get("status") == status.REJECTED]),
            "total_amount": sum(int(c.get("amount", 0) or 0) for c in claimsData)
        },
        "billing": {
            "total": sum(int(v.get("amount", 0) or 0) for v in invoices),
            "collected": sum(int(v.get("amount", 0) or 0) for v in invoices if v.get("status") == status.DONE),
            "ins_due": sum(int(v.get("amount", 0) or 0) for v in invoices if v.get("status") == status.PENDING),
            "overdue": sum(int(v.get("amount", 0) or 0) for v in invoices if v.get("status") == status.REJECTED)
        }
    }
    return st
