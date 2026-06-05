import jwt
import datetime
from flask import jsonify
from persistence.enums import role

# Set secret key
SECRET_KEY = "medcore-secret-key-change-me-later"

# --- PERMISSIONS MAP ---
ACCESS_CONTROL = {
    role.ADMIN: ["*"],
    role.DOCTOR: ["view_patients", "edit_patients", "view_appointments", "view_revenue", "view_claims", "view_approvals"],
    role.NURSE: ["view_patients", "view_appointments", "add_appointments"],
    role.RECEPTIONIST: ["view_patients", "add_patients", "view_appointments", "add_appointments"],
    role.USER: ["view_patients"]
}

def make_response(data=None, error=None, status_code=200):
    response = {
        "success": error is None,
        "data": data,
        "error": error
    }
    return jsonify(response), status_code

def generate_token(user_email, user_role):
    return jwt.encode({
        'user': user_email,
        'role': user_role,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")
