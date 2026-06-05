from flask import Flask
from flask_cors import CORS
from api import api_bp
from private.admin import interface_bp

PORT = 5001

website_url = 'localhost:'+str(PORT)
app = Flask(__name__)
app.secret_key = "medcore-admin-session-key-change-me"
app.config["SERVER_NAME"] = website_url

# Register Blueprints
app.register_blueprint(api_bp)
app.register_blueprint(interface_bp)

CORS(app)

@app.route("/")
def main_page():
    return """hello world
    <br>
    This is the main page of the Medcore API. You can access the API endpoints at <a href="/api/">/api/</a>.
    <br>
    <a href="/interface/">Go to admin interface</a>""",200

if __name__ == '__main__':
    app.run(debug=__debug__, port=PORT)
