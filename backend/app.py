from flask import Flask
from routes.user_route import user_bp


app = Flask(__file__)
app.register_blueprint(user_bp)


@app.route("/")
def main_page():
    return "hello world"


if __name__ == '__main__':
    app.run(debug=True, port=5000)
