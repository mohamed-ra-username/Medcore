import json
import pathlib

file_name = "users.json"
data_base_folder_name = "data"
project_root = pathlib.Path(__file__).parent.parent.parent
users_file = project_root / data_base_folder_name / file_name

# Global user list
users = []

def load_users():
    """Load users from the JSON file."""
    global users
    try:
        if not users_file.exists():
            save_users()
            return
        with open(users_file, "r", encoding="utf-8") as f:
            users = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        users = []

def save_users():
    """Save users to the JSON file."""
    with open(users_file, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=4, ensure_ascii=False)

def get_user_by_email(email: str):
    """Retrieve a user by their email address."""
    return next((u for u in users if u.get("email") == email), None)

def add_user(user_data: dict):
    """Add a new user to the repository."""
    users.append(user_data)
    save_users()
    return user_data

def get_all_users():
    """Retrieve all users."""
    return users

# Initial load
load_users()
