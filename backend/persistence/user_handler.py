import json
import pathlib
from werkzeug.security import generate_password_hash, check_password_hash
from .enums import role
from core.security.logic import generate_token, ACCESS_CONTROL

file_name = "users.json"
file = pathlib.Path(__file__).parent.parent.parent / "data" / file_name

users = []

def load_users():
    global users
    try:
        if not file.exists():
            with open(file, "w", encoding="utf-8") as f:
                json.dump([], f)
        with open(file, "r", encoding="utf-8") as f:
            users = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        users = []

def save_users():
    with open(file, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=4, ensure_ascii=False)

def register_user(data: dict):
    try:
        email = data["email"]

    except KeyError:
        return {"success": False, "error": "Email is required"}, 400

    try:
        password = data["password"]
    except KeyError:
        return {"success": False, "error": "Password is required"}, 400

    try:
        user_role = data["role"]
    except KeyError:
        user_role = role.USER

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
        token = generate_token(user['email'], user_role)

        return {
            "success": True,
            "token": token,
            "role": user_role,
            "permissions": ACCESS_CONTROL.get(user_role, [])
        }, 200

    return {"success": False, "error": "Invalid credentials"}, 401

load_users()
