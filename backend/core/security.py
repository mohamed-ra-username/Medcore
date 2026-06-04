import jwt
import datetime
from flask import request, jsonify, g
from functools import wraps
from database.enums import role

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
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'success': False, 'error': 'Token is missing!'}), 401
        try:
            if token.startswith("Bearer "):
                token = token.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            g.current_user = data['user']
            g.current_role = data['role']
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'error': 'Token has expired!'}), 401
        except Exception:
            return jsonify({'success': False, 'error': 'Token is invalid!'}), 401
        return f(*args, **kwargs)
    return decorated

def permission_required(permission):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user_permissions = ACCESS_CONTROL.get(g.current_role, [])
            if "*" in user_permissions or permission in user_permissions:
                return f(*args, **kwargs)
            return jsonify({"success": False, "error": "Access Denied"}), 403
        return decorated
    return decorator
