from ..data import *

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
    return _get_one_or_all(claimsData, id)


def get_user(id=UNKNOWN):
    return _get_one_or_none(users, id)


def get_users(id=UNKNOWN):
    return _get_one_or_all(users, id)


def get_homePatients(id=UNKNOWN):
    return _get_one_or_all(homePatients, id)


def get_stats():
    # Helper to clean currency strings like "3,200"
    def clean_val(v):
        if isinstance(v, str):
            return int(v.replace(",", ""))
        return int(v)

    stats = {
        "home": {
            "patients": len(homePatients),
            "appts": len([a for a in appointments if a['status'] != 'done']),
            "claims": len([c for c in claimsData if c['status'] == 'pending']),
            "revenue": sum(clean_val(c['amount']) for c in claimsData if c['status'] == 'approved')
        },
        "insurance": {
            "total": len(companies),
            "active": len([c for c in companies if c['status'] == 'active']),
            "expiring": len([c for c in companies if c['status'] == 'expiring']),
            "claims": sum(c['claims'] for c in companies)
        },
        "claims": {
            "pending": len([c for c in claimsData if c['status'] == 'pending']),
            "approved": len([c for c in claimsData if c['status'] == 'approved']),
            "rejected": len([c for c in claimsData if c['status'] == 'rejected']),
            "total_amount": sum(clean_val(c['amount']) for c in claimsData)
        },
        "billing": {
            "total": sum(clean_val(v['amount']) for v in invoices),
            "collected": sum(clean_val(v['amount']) for v in invoices if v['status'] == 'done'),
            "ins_due": sum(clean_val(v['amount']) for v in invoices if v['status'] == 'pending'),
            "overdue": sum(clean_val(v['amount']) for v in invoices if v['status'] == 'rejected')
        }
    }
    return stats
