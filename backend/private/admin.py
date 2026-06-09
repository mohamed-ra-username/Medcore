import flask
import json
import shutil
import datetime
from functools import wraps
from persistence import data_handler, user_repository

interface_bp = flask.Blueprint(name="interface", import_name=__name__, url_prefix="/interface")
from dotenv import load_dotenv
load_dotenv()

# --- SETTINGS ---
MASTER_PASSWORD = "admin"

def is_admin():
    return flask.session.get("is_admin") == True

def ensure_admin(f):
    @wraps(f)
    def wrapper(*args,**kwargs):
        if not is_admin():
            return flask.redirect(flask.url_for("interface.login"))
        return f(*args,**kwargs)
    return wrapper

@interface_bp.route("/login", methods=["GET", "POST"])
def login():
    if is_admin():
        return flask.redirect(flask.url_for("interface.dashboard"))
    error = None
    if flask.request.method == "POST":
        password = flask.request.form.get("password")
        if password == MASTER_PASSWORD:
            flask.session["is_admin"] = True
            flask.flash("Access Granted. Welcome, Admin.")
            return flask.redirect(flask.url_for("interface.dashboard"))
        else:
            error = "Invalid Master Password"
    return flask.render_template("admin/login.html", error=error)

@interface_bp.route("/logout")
def logout():
    flask.session.pop("is_admin", None)
    return flask.redirect(flask.url_for("interface.login"))

@interface_bp.route("/")
@interface_bp.route("/dashboard")
@ensure_admin
def dashboard():
    stats = {
        "users": len(data_handler.user_db.users),
        "patients": len(data_handler.json_db.home_patients),
        "appointments": len(data_handler.json_db.appointments),
        "claims": len(data_handler.json_db.claims_data),
        "invoices": len(data_handler.json_db.invoices),
        "companies": len(data_handler.json_db.companies),
        "approvals": len(data_handler.json_db.approvals_data)
    }
    return flask.render_template("admin/dashboard.html", stats=stats)

@interface_bp.route("/list/<category>")
@ensure_admin
def list_category(category):

    data_map = {
        "users": data_handler.user_db.users,
        "patients": data_handler.json_db.home_patients,
        "appointments": data_handler.json_db.appointments,
        "claims": data_handler.json_db.claims_data,
        "invoices": data_handler.json_db.invoices,
        "companies": data_handler.json_db.companies,
        "approvals": data_handler.json_db.approvals_data
    }

    target_data = data_map.get(category)
    if target_data is None:
        flask.flash(f"Category '{category}' not found")
        return flask.redirect(flask.url_for("interface.dashboard"))
    return flask.render_template("admin/list.html", category=category, data=target_data)

@interface_bp.route("/delete/<category>/<id>", methods=["POST"])
@ensure_admin
def delete_item(category, id):

    data_map = {
        "patients": data_handler.json_db.home_patients,
        "appointments": data_handler.json_db.appointments,
        "claims": data_handler.json_db.claims_data,
        "invoices": data_handler.json_db.invoices,
        "companies": data_handler.json_db.companies,
        "users": data_handler.user_db.users,
        "approvals": data_handler.json_db.approvals_data
    }

    target_list = data_map.get(category)
    if target_list is not None:
        # Find and remove item by ID
        item_to_remove = next((item for item in target_list if str(item.get("id")) == str(id)), None)
        if item_to_remove:
            target_list.remove(item_to_remove)

            # Save based on which file was changed
            if category == "users":
                user_repository.save_users()
            else:
                data_handler.save_data()

            flask.flash(f"Removed item from {category}")
            return flask.redirect(flask.url_for("interface.list_category", category=category))

    flask.flash("Error: Could not delete item")
    return flask.redirect(flask.url_for("interface.list_category", category=category))

@interface_bp.route("/raw", methods=["GET", "POST"])
@ensure_admin
def raw_editor():

    from persistence.data_handler import data_file, users_file

    file_type = flask.request.args.get("file", "data")
    target_file = users_file if file_type == "users" else data_file

    if flask.request.method == "POST":
        new_json = flask.request.form.get("json_data","nil")
        try:
            json.loads(new_json)
            with open(target_file, "w", encoding="utf-8") as f:
                f.write(new_json)

            if file_type == "users":
                user_repository.load_users()
            else:
                data_handler.load_data()

            flask.flash(f"{file_type.capitalize()} database successfully overwritten!")
        except Exception as e:
            flask.flash(f"Error: Invalid JSON format ({e})")

    with open(target_file, "r", encoding="utf-8") as f:
        content = f.read()

    return flask.render_template("admin/raw.html", json_content=content, file_type=file_type)

@interface_bp.route("/backup", methods=["POST"])
@ensure_admin
def manual_backup():

    from persistence.data_handler import data_file, users_file

    backup_dir = data_file.parent / "backups"
    backup_dir.mkdir(exist_ok=True)

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

    shutil.copy(data_file, backup_dir / f"data_backup_{timestamp}.json")
    shutil.copy(users_file, backup_dir / f"users_backup_{timestamp}.json")

    flask.flash(f"Backups created in {backup_dir.name}")
    return flask.redirect(flask.url_for("interface.dashboard"))
