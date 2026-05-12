import flask
from handler.data import users

user_bp = flask.Blueprint("user", __file__, url_prefix="/user")


@user_bp.get("/<int:id>")
def get_user(id: int):
    return flask.jsonify(users.get_user(id))


@user_bp.get("/")
def get_all():
    return flask.jsonify(users.get_users())
