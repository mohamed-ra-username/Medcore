import flask
from persistence import user_repository
from core.security.logic import make_response, generate_token, ACCESS_CONTROL
from core.middleware.timeout import token_required
from werkzeug.security import generate_password_hash, check_password_hash
from persistence.enums import role
from . import api_bp

@api_bp.route("/auth/register/", methods=["POST"])
def register():
    data = flask.request.json
    try:
        email = data["email"]
        password = data["password"]
    except KeyError as e:
        return make_response(error=f"{str(e).strip("'").capitalize()} is required", status_code=400)

    user_role = data.get("role", role.USER)

    if user_repository.get_user_by_email(email):
        return make_response(error="User already exists", status_code=400)

    hashed_password = generate_password_hash(password)

    new_user = {
        "email": email,
        "password_hash": hashed_password,
        "name": data.get("name", "New User")
    }

    if user_role != role.USER:
        new_user["role"] = user_role

    user_repository.add_user(new_user)
    return make_response(data=new_user, status_code=201)

@api_bp.route("/auth/login/", methods=["POST"])
def login():
    data = flask.request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return make_response(error="Email and password are required", status_code=400)

    user = user_repository.get_user_by_email(email)

    if user and check_password_hash(user["password_hash"], password):
        user_role = user.get("role", role.USER)
        token = generate_token(user['email'], user_role)

        return make_response(data={
            "token": token,
            "role": user_role,
            "permissions": ACCESS_CONTROL.get(user_role, [])
        }, status_code=200)

    return make_response(error="Invalid credentials", status_code=401)

@api_bp.route("/me/", methods=["GET"])
@token_required
def get_me():
    from core.security.logic import ACCESS_CONTROL
    return make_response(data={
        "user": flask.g.current_user,
        "role": flask.g.current_role,
        "permissions": ACCESS_CONTROL.get(flask.g.current_role, [])
    })
