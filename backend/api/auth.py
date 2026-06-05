import flask
from persistence import data_handler
from core.security.logic import make_response
from core.middleware.timeout import token_required
from . import api_bp

@api_bp.route("/auth/register/", methods=["POST"])
def register():
    data = flask.request.json
    from persistence import user_handler
    res, status_code = user_handler.register_user(data)
    if status_code >= 400:
        return make_response(error=res.get("error", "Registration failed"), status_code=status_code)
    return make_response(data=res, status_code=status_code)

@api_bp.route("/auth/login/", methods=["POST"])
def login():
    data = flask.request.json
    email = data.get("email")
    password = data.get("password")
    from persistence import user_handler
    res, status_code = user_handler.login_user(email, password)
    if status_code >= 400:
        return make_response(error=res.get("error", "Login failed"), status_code=status_code)
    return make_response(data=res, status_code=status_code)

@api_bp.route("/me/", methods=["GET"])
@token_required
def get_me():
    from core.security.logic import ACCESS_CONTROL
    return make_response(data={
        "user": flask.g.current_user,
        "role": flask.g.current_role,
        "permissions": ACCESS_CONTROL.get(flask.g.current_role, [])
    })
