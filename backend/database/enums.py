from enum import StrEnum


class status(StrEnum):
    DONE = "done"
    ACTIVE = "active"
    EXPIRED = "expired"
    PENDING = "pending"

    EXPIRING = "expiring"
    REJECTED = "rejected"
    APPROVED = "approved"


class role(StrEnum):
    USER = "user"
    ADMIN = "admin"
    DOCTOR = "doctor"
    NURSE = "nurse"
    RECEPTIONIST = "receptionist"
