from flask import Flask
from routes import api_bp, interface_bp
from flask_cors import CORS

PORT = 5001

website_url = 'localhost:'+str(PORT)
app = Flask(__name__)
app.config["SERVER_NAME"] = website_url
app.register_blueprint(api_bp)
app.register_blueprint(interface_bp)
CORS(app)


@app.route("/")
def main_page():
    return """hello world
    <br>
    This is the main page of the Medcore API. You can access the API endpoints at <a href="/api/">/api/</a>.
    <br>
    <a href="/interface/">Go to interface</a>""",200

# print("Registered Endpoints:")
# for rule in app.url_map.iter_rules():
#     print(f'Path: "http://127.0.0.1:5000{rule.rule}" -> Endpoint Target: {rule.endpoint}')


if __name__ == '__main__':
    app.run(debug=__debug__, port=PORT)
