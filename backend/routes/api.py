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

@api_bp.route("/homePatients/")
@api_bp.route("/homePatients/<int:id>/")
def get_homePatients(id: int | slice | None = None):
    return flask.jsonify(handler.get_homePatients(id))

@api_bp.route("/stats/")
def get_stats():
    return flask.jsonify(handler.get_stats())

# --- POST ROUTES ---

@api_bp.route("/users/", methods=["POST"])
def add_user():
    return flask.jsonify(handler.add_user(flask.request.json.get("data")))

@api_bp.route("/appointments/", methods=["POST"])
def add_appointment():
    return flask.jsonify(handler.add_appointment(flask.request.json))

@api_bp.route("/companies/", methods=["POST"])
def add_company():
    return flask.jsonify(handler.add_company(flask.request.json))

@api_bp.route("/phones/", methods=["POST"])
def add_phone():
    return flask.jsonify(handler.add_phone(flask.request.json.get("data")))

@api_bp.route("/invoices/", methods=["POST"])
def add_invoice():
    return flask.jsonify(handler.add_invoice(flask.request.json))

@api_bp.route("/claims/", methods=["POST"])
def add_claim():
    return flask.jsonify(handler.add_claim(flask.request.json))

@api_bp.route("/approvals/", methods=["POST"])
def add_approval():
    return flask.jsonify(handler.add_approval(flask.request.json))

@api_bp.route("/homePatients/", methods=["POST"])
def add_homePatient():
    return flask.jsonify(handler.add_homePatient(flask.request.json))

# --- PUT ROUTES ---

@api_bp.route("/users/<int:id>/", methods=["PUT"])
def update_user(id: int):
    res = handler.update_user(id, flask.request.json.get("data"))
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/appointments/<int:id>/", methods=["PUT"])
def update_appointment(id: int):
    res = handler.update_appointment(id, flask.request.json)
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/companies/<int:id>/", methods=["PUT"])
def update_company(id: int):
    res = handler.update_company(id, flask.request.json)
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/phones/<int:id>/", methods=["PUT"])
def update_phone(id: int):
    res = handler.update_phone(id, flask.request.json.get("data"))
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/invoices/<int:id>/", methods=["PUT"])
def update_invoice(id: int):
    res = handler.update_invoice(id, flask.request.json)
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/claims/<int:id>/", methods=["PUT"])
def update_claim(id: int):
    res = handler.update_claim(id, flask.request.json)
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/claims/<int:id>/status/", methods=["PUT"])
def update_claim_status(id: int):
    res = handler.update_claim_status(id, flask.request.json.get("status"))
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/approvals/<int:id>/", methods=["PUT"])
def update_approval(id: int):
    res = handler.update_approval(id, flask.request.json)
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/homePatients/<int:id>/", methods=["PUT"])
def update_homePatient(id: int):
    res = handler.update_homePatient(id, flask.request.json)
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

# --- DELETE ROUTES ---

@api_bp.route("/users/<int:id>/", methods=["DELETE"])
def delete_user(id: int):
    res = handler.delete_user(id)
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/appointments/<int:id>/", methods=["DELETE"])
def delete_appointment(id: int):
    res = handler.delete_appointment(id)
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/companies/<int:id>/", methods=["DELETE"])
def delete_company(id: int):
    res = handler.delete_company(id)
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/phones/<int:id>/", methods=["DELETE"])
def delete_phone(id: int):
    res = handler.delete_phone(id)
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/invoices/<int:id>/", methods=["DELETE"])
def delete_invoice(id: int):
    res = handler.delete_invoice(id)
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/claims/<int:id>/", methods=["DELETE"])
def delete_claim(id: int):
    res = handler.delete_claim(id)
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/approvals/<int:id>/", methods=["DELETE"])
def delete_approval(id: int):
    res = handler.delete_approval(id)
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)

@api_bp.route("/homePatients/<int:id>/", methods=["DELETE"])
def delete_homePatient(id: int):
    res = handler.delete_homePatient(id)
    return flask.jsonify(res) if res else (flask.jsonify({"status":"error"}), 400)
