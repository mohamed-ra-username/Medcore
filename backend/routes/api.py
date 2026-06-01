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
def get_invoices(id: int | slice | None = None):
    return flask.jsonify(handler.get_invoices(id))


@api_bp.route("/phones/")
@api_bp.route("/phones/<int:id>/")
def get_phones(id: int | slice | None = None):
    return flask.jsonify(handler.get_phones(id))


@api_bp.route("/appointments/")
@api_bp.route("/appointments/<int:id>/")
def get_appointments(id: int | slice | None = None):
    return flask.jsonify(handler.get_appointments(id))


@api_bp.route("/approvals/")
@api_bp.route("/approvals/<int:id>/")
def get_approvals(id: int | slice | None = None):
    return flask.jsonify(handler.get_approvals(id))


@api_bp.route("/claims/")
@api_bp.route("/claims/<int:id>/")
def get_claims(id: int | slice | None = None):
    return flask.jsonify(handler.get_claims(id))


@api_bp.route("/companies/")
@api_bp.route("/companies/<int:id>/")
def get_companies(id: int | slice | None = None):
    return flask.jsonify(handler.get_companies(id))


@api_bp.route("/homePatients/", methods=["POST"])
def add_homePatient():
    data = flask.request.json
    handler.homePatients.insert(0, data)
    handler.save_data()
    return flask.jsonify({"status": "success", "data": data})

@api_bp.route("/homePatients/<int:id>/", methods=["PUT"])
def update_homePatient(id: int):
    data = flask.request.json
    if 0 <= id < len(handler.homePatients):
        handler.homePatients[id] = data
        handler.save_data()
        return flask.jsonify({"status": "success", "data": data})
    return flask.jsonify({"status": "error", "message": "Index out of bounds"}), 400

@api_bp.route("/homePatients/<int:id>/", methods=["DELETE"])
def delete_homePatient(id: int):
    if 0 <= id < len(handler.homePatients):
        deleted = handler.homePatients.pop(id)
        handler.save_data()
        return flask.jsonify({"status": "success", "data": deleted})
    return flask.jsonify({"status": "error", "message": "Index out of bounds"}), 400

@api_bp.route("/claims/<int:id>/status/", methods=["PUT"])
def update_claim_status(id: int):
    status = flask.request.json.get("status")
    if 0 <= id < len(handler.claimsData):
        handler.claimsData[id]["status"] = status
        handler.save_data()
        return flask.jsonify({"status": "success"})
    return flask.jsonify({"status": "error"}), 400



@api_bp.route("/stats/")
def get_stats():
    return flask.jsonify(handler.get_stats())
