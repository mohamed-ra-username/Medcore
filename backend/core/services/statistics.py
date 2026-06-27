from persistence import json_repository as json_db
from persistence.enums import status


def get_patients_increase():
    previous_day = 0
    new_day = len(
        [patient for patient in json_db.home_patients if patient.get("status") == status.ACTIVE])

    if new_day == previous_day:
        return

    if not previous_day:
        return f"{new_day} new patients"

    percentage = new_day/previous_day*100 or None

    change = "increased" if new_day > previous_day else "decreased"

    return f"patients {change} by %{percentage}"


def get_appointments_increase():
    previous_day = 0
    new_day = len(
        [appointment for appointment in json_db.appointments if appointment.get("status") == status.ACTIVE])

    if new_day == previous_day:
        return

    if not previous_day:
        return f"{new_day} new appointments"

    percentage = new_day/previous_day*100 or None

    change = "increased" if new_day > previous_day else "decreased"

    return f"patients {change} by %{percentage}"


def get_revenue():
    """Requires implementation"""
    # TODO
    return "you are millionaire!🎉"
