from flask import Flask
from flask_cors import CORS
from api import api_bp
from private.admin import interface_bp
import atexit
import shutil
import datetime
import os

PORT = 5001

website_url = 'localhost:'+str(PORT)
app = Flask(__name__)
app.secret_key = "admin123"  # ! In production, use a secure random key and store it safely
app.config["SERVER_NAME"] = website_url

# Register Blueprints
app.register_blueprint(api_bp)
app.register_blueprint(interface_bp)

CORS(app)

# Auto-Backup on Shutdown logic
def auto_backup():
    # Only run in the main process (avoids double backups with Flask reloader)
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true" or not app.debug:
        print("\n[Auto-Backup] Creating backup before shutdown...")
        try:
            from persistence.data_handler import data_file, users_file
            backup_dir = data_file.parent / "backups"
            backup_dir.mkdir(exist_ok=True)
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            shutil.copy(data_file, backup_dir / f"data_backup_{timestamp}.json")
            shutil.copy(users_file, backup_dir / f"users_backup_{timestamp}.json")
            print(f"[Auto-Backup] Successfully created in {backup_dir.name}/")
        except Exception as e:
            print(f"[Auto-Backup] Failed to create backup: {e}")

atexit.register(auto_backup)

@app.route("/")
def main_page():
    return """hello world
    <br>
    This is the main page of the Medcore API. You can access the API endpoints at <a href="/api/">/api/</a>.
    <br>
    <a href="/interface/">Go to admin interface</a>""",200

if __name__ == '__main__':
    app.run(debug=__debug__, port=PORT)
