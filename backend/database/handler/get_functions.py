from functools import partial
from typing import Any

from ..enums import status
from ..data_handler import *

UNKNOWN = object()

def _get_one_or_none(something: list, id: int|None):
    try:
        return something[id] # type: ignore
    except (KeyError, IndexError, TypeError):
        return None


def _get_one_or_all(something: list, id: slice | int|None):
    try:
        return something[id]
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

    stats = {
        "home": {
            "patients": len([p for p in homePatients if p["status"] == status.ACTIVE]),
            "appts": len([a for a in appointments if a["status"] == status.ACTIVE]),
            "claims": len([c for c in claimsData if c["status"] == status.PENDING]),
            "revenue": sum((c["amount"]) for c in claimsData if c["status"] == status.APPROVED)
        },
        "insurance": {
            "total": len(companies),
            "claims": sum(c["claims"] for c in companies),
            "active": len([c for c in companies if c["status"] == status.ACTIVE]),
            "expiring": len([c for c in companies if c["status"] == status.EXPIRING]),
            "pending": len([a for a in approvalsData if a["status"] == status.PENDING]),
        },
        "claims": {
            "pending": len([c for c in claimsData if c["status"] == status.PENDING]),
            "approved": len([c for c in claimsData if c["status"] == status.APPROVED]),
            "rejected": len([c for c in claimsData if c["status"] == status.REJECTED]),
            "total_amount": sum((c["amount"]) for c in claimsData)
        },
        "billing": {
            "total": sum((v["amount"]) for v in invoices),
            "collected": sum((v["amount"]) for v in invoices if v["status"] == status.DONE),
            "ins_due": sum((v["amount"]) for v in invoices if v["status"] == status.PENDING),
            "overdue": sum((v["amount"]) for v in invoices if v["status"] == status.REJECTED)
        }
    }
    return stats
