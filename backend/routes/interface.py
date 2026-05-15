import flask
from database import handler

interface_bp = flask.Blueprint(name="interface", import_name=__name__)

@interface_bp.route("/user/<int:id>/")
def get_user(id: int):
    return flask.jsonify(handler.get_user(id))


@interface_bp.route("/users/")
@interface_bp.route("/users/<int:id>/")
def get_users(id: int | None = None):
    return flask.jsonify(handler.get_users(id))


@interface_bp.route("/appointments/")
@interface_bp.route("/appointments/<int:id>/")
def get_appointments(id: int | None = None):
    return flask.jsonify(handler.get_appointments(id))


@interface_bp.route("/approvals/")
@interface_bp.route("/approvals/<int:id>/")
def get_approvals(id: int | None = None):
    return flask.jsonify(handler.get_approvals(id))


@interface_bp.route("/claims/")
@interface_bp.route("/claims/<int:id>/")
def get_claims(id: int | None = None):
    return flask.jsonify(handler.get_claims(id))


@interface_bp.route("/companies/")
@interface_bp.route("/companies/<int:id>/")
def get_companies(id: int | None = None):
    return flask.jsonify(handler.get_companies(id))


@interface_bp.route("/homePatients/")
@interface_bp.route("/homePatients/<int:id>/")
def get_homePatients(id: int | None = None):
    return flask.jsonify(handler.get_homePatients(id))