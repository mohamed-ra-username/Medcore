import json
import pathlib
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from flask import request, jsonify, g
from .enums import role

# Set secret key
SECRET_KEY = "medcore-secret-key-change-me-later"

file_name = "users.json"
file = pathlib.Path(__file__).parent.parent.parent / "data" / file_name

# --- PERMISSIONS MAP ---
ACCESS_CONTROL = {
    role.ADMIN: ["*"],
    role.DOCTOR: ["view_patients", "edit_patients", "view_appointments", "view_revenue", "view_claims", "view_approvals"],
    role.NURSE: ["view_patients", "view_appointments", "add_appointments"],
    role.RECEPTIONIST: ["view_patients", "add_patients", "view_appointments", "add_appointments"],
    role.USER: ["view_patients"] 
}

users = []

def load_users():
    global users
    try:
        with open(file, "r", encoding="utf-8") as f:
            users = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        users = []

def save_users():
    with open(file, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=4, ensure_ascii=False)

def register_user(data: dict):
    email = data.get("email")
    password = data.get("password")
    user_role = data.get("role", role.USER)
    
    if any(u.get("email") == email for u in users):
        return {"success": False, "error": "User already exists"}, 400
    
    hashed_password = generate_password_hash(password)
    
    new_user = {
        "email": email,
        "password_hash": hashed_password,
        "name": data.get("name", "New User")
    }
    
    if user_role != role.USER:
        new_user["role"] = user_role
    
    users.append(new_user)
    save_users()
    return {"success": True}, 201

def login_user(email, password):
    user = next((u for u in users if u.get("email") == email), None)
    
    if user and check_password_hash(user["password_hash"], password):
        user_role = user.get("role", role.USER)
        token = jwt.encode({
            'user': user['email'],
            'role': user_role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        
        return {
            "success": True, 
            "token": token, 
            "role": user_role,
            "permissions": ACCESS_CONTROL.get(user_role, [])
        }, 200
    
    return {"success": False, "error": "Invalid credentials"}, 401

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

load_users()
