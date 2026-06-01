import flask
from database import handler

api_bp = flask.Blueprint("api_routes", __name__, url_prefix="/api")


@api_bp.route("/user/<int:id>/")
def get_user(id: int):
    return flask.jsonify(handler.get_user(id))


@api_bp.route("/users/")
@api_bp.route("/users/<int:id>/")
def get_users(id: int | None = None):
    return flask.jsonify(handler.get_users(id))


@api_bp.route("/invoices/")
@api_bp.route("/invoices/<int:id>/")
def get_invoices(id: int | None = None):
    return flask.jsonify(handler.get_invoices(id))


@api_bp.route("/phones/")
@api_bp.route("/phones/<int:id>/")
def get_phones(id: int | None = None):
    return flask.jsonify(handler.get_phones(id))


@api_bp.route("/appointments/")
@api_bp.route("/appointments/<int:id>/")
def get_appointments(id: int | None = None):
    return flask.jsonify(handler.get_appointments(id))


@api_bp.route("/approvals/")
@api_bp.route("/approvals/<int:id>/")
def get_approvals(id: int | None = None):
    return flask.jsonify(handler.get_approvals(id))


@api_bp.route("/claims/")
@api_bp.route("/claims/<int:id>/")
def get_claims(id: int | None = None):
    return flask.jsonify(handler.get_claims(id))


@api_bp.route("/companies/")
@api_bp.route("/companies/<int:id>/")
def get_companies(id: int | None = None):
    return flask.jsonify(handler.get_companies(id))


@api_bp.route("/homePatients/")
@api_bp.route("/homePatients/<int:id>/")
def get_homePatients(id: int | None = None):
    return flask.jsonify(handler.get_homePatients(id))


@api_bp.route("/stats/")
def get_stats():
    return flask.jsonify(handler.get_stats())
