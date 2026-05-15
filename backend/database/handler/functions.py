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
