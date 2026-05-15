from flask import Flask
from routes import api_bp, interface_bp
from flask_cors import CORS

config = {
    "name": __name__,
    "port": 5001,
    "debug": True,
}

website_url = 'localhost:'+str(config["port"])
app = Flask(config["name"])
app.config["SERVER_NAME"] = website_url
app.register_blueprint(api_bp)
app.register_blueprint(interface_bp)
CORS(app)


@app.route("/")
def main_page():
    return "hello world"

# print("Registered Endpoints:")
# for rule in app.url_map.iter_rules():
#     print(f'Path: "http://127.0.0.1:5000{rule.rule}" -> Endpoint Target: {rule.endpoint}')


if __name__ == '__main__':
    app.run(debug=config.get('debug', False), port=config["port"])
