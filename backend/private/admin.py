import flask
import json
import shutil
import datetime
from persistence import data_handler, auth_users, user_repository

interface_bp = flask.Blueprint(name="interface", import_name=__name__, url_prefix="/interface")
from dotenv import load_dotenv
load_dotenv()

# --- SETTINGS ---
MASTER_PASSWORD = "admin" 

def is_admin():
    return flask.session.get("is_admin") == True

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
def dashboard():
    if not is_admin():
        return flask.redirect(flask.url_for("interface.login"))
    stats = {
        "patients": len(data_handler.homePatients),
        "appointments": len(data_handler.appointments),
        "claims": len(data_handler.claimsData),
        "invoices": len(data_handler.invoices),
        "companies": len(data_handler.companies),
        "users": len(auth_users),
        "approvals": len(data_handler.approvalsData)
    }
    return flask.render_template("admin/dashboard.html", stats=stats)

@interface_bp.route("/list/<category>")
def list_category(category):
    if not is_admin():
        return flask.redirect(flask.url_for("interface.login"))
    
    data_map = {
        "patients": data_handler.homePatients,
        "appointments": data_handler.appointments,
        "claims": data_handler.claimsData,
        "invoices": data_handler.invoices,
        "companies": data_handler.companies,
        "users": auth_users,
        "approvals": data_handler.approvalsData
    }
    
    target_data = data_map.get(category)
    if target_data is None:
        flask.flash(f"Category '{category}' not found")
        return flask.redirect(flask.url_for("interface.dashboard"))
    return flask.render_template("admin/list.html", category=category, data=target_data)

@interface_bp.route("/delete/<category>/<int:index>", methods=["POST"])
def delete_item(category, index):
    if not is_admin():
        return flask.redirect(flask.url_for("interface.login"))
    
    data_map = {
        "patients": data_handler.homePatients,
        "appointments": data_handler.appointments,
        "claims": data_handler.claimsData,
        "invoices": data_handler.invoices,
        "companies": data_handler.companies,
        "users": auth_users,
        "approvals": data_handler.approvalsData
    }
    
    target_list = data_map.get(category)
    if target_list is not None and 0 <= index < len(target_list):
        target_list.pop(index)
        
        # Save based on which file was changed
        if category == "users":
            user_repository.save_users()
        else:
            data_handler.save_data()
            
        flask.flash(f"Removed item from {category}")
    else:
        flask.flash("Error: Could not delete item")
    return flask.redirect(flask.url_for("interface.list_category", category=category))

@interface_bp.route("/raw", methods=["GET", "POST"])
def raw_editor():
    if not is_admin():
        return flask.redirect(flask.url_for("interface.login"))
    
    from persistence.json_repository import file as data_file
    from persistence.user_repository import file as user_file
    
    file_type = flask.request.args.get("file", "data")
    target_file = user_file if file_type == "users" else data_file
    
    if flask.request.method == "POST":
        new_json = flask.request.form.get("json_data")
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
def manual_backup():
    if not is_admin():
        return flask.redirect(flask.url_for("interface.login"))
    
    from persistence.json_repository import file as data_file
    from persistence.user_repository import file as user_file
    
    backup_dir = data_file.parent / "backups"
    backup_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    
    shutil.copy(data_file, backup_dir / f"data_backup_{timestamp}.json")
    shutil.copy(user_file, backup_dir / f"users_backup_{timestamp}.json")
    
    flask.flash(f"Backups created in {backup_dir.name}")
    return flask.redirect(flask.url_for("interface.dashboard"))
