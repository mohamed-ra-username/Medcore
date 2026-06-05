import flask
import json
import shutil
import datetime
from database import handler

interface_bp = flask.Blueprint(name="interface", import_name=__name__, url_prefix="/interface")

# --- SETTINGS ---
# In a real app, move this to .env
MASTER_PASSWORD = "admin" 

def is_admin():
    return flask.session.get("is_admin") == True

def admin_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        if not is_admin():
            return flask.redirect(flask.url_url_for("interface.login"))
        return f(*args, **kwargs)
    return decorated

# Fix for url_for inside blueprint
def url_url_for(endpoint, **values):
    return flask.url_for(endpoint, **values)

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
        "patients": len(handler.homePatients),
        "appointments": len(handler.appointments),
        "claims": len(handler.claimsData),
        "invoices": len(handler.invoices),
        "companies": len(handler.companies),
        "users": len(handler.users)
    }
    return flask.render_template("admin/dashboard.html", stats=stats)

@interface_bp.route("/list/<category>")
def list_category(category):
    if not is_admin():
        return flask.redirect(flask.url_for("interface.login"))
    
    data_map = {
        "patients": handler.homePatients,
        "appointments": handler.appointments,
        "claims": handler.claimsData,
        "invoices": handler.invoices,
        "companies": handler.companies,
        "users": handler.users
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
        "patients": handler.homePatients,
        "appointments": handler.appointments,
        "claims": handler.claimsData,
        "invoices": handler.invoices,
        "companies": handler.companies,
        "users": handler.users
    }
    
    target_list = data_map.get(category)
    if target_list is not None and 0 <= index < len(target_list):
        removed = target_list.pop(index)
        handler.save_data()
        flask.flash(f"Removed item from {category}")
    else:
        flask.flash("Error: Could not delete item")
        
    return flask.redirect(flask.url_for("interface.list_category", category=category))

@interface_bp.route("/raw", methods=["GET", "POST"])
def raw_editor():
    if not is_admin():
        return flask.redirect(flask.url_for("interface.login"))
    
    from database.data_handler import file as data_file
    
    if flask.request.method == "POST":
        new_json = flask.request.form.get("json_data")
        try:
            # Validate JSON before saving
            parsed = json.loads(new_json)
            with open(data_file, "w", encoding="utf-8") as f:
                f.write(new_json)
            # Reload data into memory
            handler.load_data()
            flask.flash("Database successfully overwritten!")
        except Exception as e:
            flask.flash(f"Error: Invalid JSON format ({e})")
            
    with open(data_file, "r", encoding="utf-8") as f:
        content = f.read()
        
    return flask.render_template("admin/raw.html", json_content=content)

@interface_bp.route("/backup", methods=["POST"])
def manual_backup():
    if not is_admin():
        return flask.redirect(flask.url_for("interface.login"))
    
    from database.data_handler import file as data_file
    backup_dir = data_file.parent / "backups"
    backup_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = backup_dir / f"data_backup_{timestamp}.json"
    
    shutil.copy(data_file, backup_path)
    flask.flash(f"Backup created: {backup_path.name}")
    return flask.redirect(flask.url_for("interface.dashboard"))
