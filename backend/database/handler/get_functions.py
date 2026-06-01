from ..data import *
from ..enums import status

UNKNOWN = object()


def _get_one_or_none(something, id):
    try:
        return something[id]
    except KeyError, IndexError, TypeError:
        return None


def _get_one_or_all(something, id):
    try:
        return something[id]
    except KeyError, IndexError, TypeError:
        return something


def get_invoices(id=UNKNOWN):
    return _get_one_or_all(invoices, id)


def get_phones(id=UNKNOWN):
    return _get_one_or_all(phones, id)


def get_appointments(id=UNKNOWN):
    return _get_one_or_all(appointments, id)


def get_companies(id=UNKNOWN):
    return _get_one_or_all(companies, id)


def get_claims(id=UNKNOWN):
    return _get_one_or_all(claimsData, id)


def get_approvals(id=UNKNOWN):
    return _get_one_or_all(approvalsData, id)


def get_user(id=UNKNOWN):
    return _get_one_or_none(users, id)


def get_users(id=UNKNOWN):
    return _get_one_or_all(users, id)


def get_homePatients(id=UNKNOWN):
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
