import flask
from persistence import handler
from . import api_bp

@api_bp.route("/auth/register/", methods=["POST"])
def register():
    data = flask.request.json
    res, status_code = handler.register_user(data)
    if status_code >= 400:
        return handler.make_response(error=res.get("error", "Registration failed"), status_code=status_code)
    return handler.make_response(data=res, status_code=status_code)

@api_bp.route("/auth/login/", methods=["POST"])
def login():
    data = flask.request.json
    email = data.get("email")
    password = data.get("password")
    res, status_code = handler.login_user(email, password)
    if status_code >= 400:
        return handler.make_response(error=res.get("error", "Login failed"), status_code=status_code)
    return handler.make_response(data=res, status_code=status_code)

@api_bp.route("/me/", methods=["GET"])
@handler.token_required
def get_me():
    return handler.make_response(data={
        "user": flask.g.current_user,
        "role": flask.g.current_role,
        "permissions": handler.ACCESS_CONTROL.get(flask.g.current_role, [])
    })
