from persistence.data_handler import home_patients, appointments, claims_data, invoices
from persistence.enums import status


def get_patients_increase():
    previous_day = 0
    new_day = len(
        [patient for patient in home_patients if patient.get("status") == status.ACTIVE])

    return "patients increase by %10"
    return new_day/previous_day*100 or None


def get_appointments_increase():
    previous_day = 0
    new_day = len(
        [appointment for appointment in appointments if appointments.get("status") == status.ACTIVE])

    return "appointments increase by %110"
    return new_day/previous_day*100 or None


def get_revenue():
    """TODO"""
    ...
    return "you are millionaire"
