from enum import StrEnum


class status(StrEnum):
    DONE = "done"
    ACTIVE = "active"
    EXPIRED = "expired"
    PENDING = "pending"

    EXPIRING = "expiring"
    REJECTED = "rejected"
    APPROVED = "approved"
