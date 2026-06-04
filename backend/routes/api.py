import flask
from database import handler

api_bp = flask.Blueprint("api_routes", __name__, url_prefix="/api")

# --- AUTH ROUTES ---

@api_bp.route("/auth/register/", methods=["POST"])
def register():
    data = flask.request.json
    res, status_code = handler.register_user(data)
    return flask.jsonify(res), status_code

@api_bp.route("/auth/login/", methods=["POST"])
def login():
    data = flask.request.json
    email = data.get("email")
    password = data.get("password")
    res, status_code = handler.login_user(email, password)
    return flask.jsonify(res), status_code

@api_bp.route("/me/", methods=["GET"])
@handler.token_required
def get_me():
    return flask.jsonify({
        "success": True, 
        "data": {
            "user": flask.g.current_user,
            "role": flask.g.current_role,
            "permissions": handler.ACCESS_CONTROL.get(flask.g.current_role, [])
        }
    })

# --- PROTECTED GET ROUTES ---

@api_bp.route("/invoices/")
@api_bp.route("/invoices/<int:id>/")
@handler.token_required
@handler.permission_required("view_revenue")
def get_invoices(id: int | slice | None = None):
    return flask.jsonify({"success": True, "data": handler.get_invoices(id)})

@api_bp.route("/phones/")
@api_bp.route("/phones/<int:id>/")
@handler.token_required
@handler.permission_required("view_patients")
def get_phones(id: int | slice | None = None):
    return flask.jsonify({"success": True, "data": handler.get_phones(id)})

@api_bp.route("/appointments/")
@api_bp.route("/appointments/<int:id>/")
@handler.token_required
@handler.permission_required("view_appointments")
def get_appointments(id: int | slice | None = None):
    return flask.jsonify({"success": True, "data": handler.get_appointments(id)})

@api_bp.route("/approvals/")
@api_bp.route("/approvals/<int:id>/")
@handler.token_required
@handler.permission_required("view_approvals")
def get_approvals(id: int | slice | None = None):
    return flask.jsonify({"success": True, "data": handler.get_approvals(id)})

@api_bp.route("/claims/")
@api_bp.route("/claims/<int:id>/")
@handler.token_required
@handler.permission_required("view_claims")
def get_claims(id: int | slice | None = None):
    return flask.jsonify({"success": True, "data": handler.get_claims(id)})

@api_bp.route("/companies/")
@api_bp.route("/companies/<int:id>/")
@handler.token_required
@handler.permission_required("view_claims")
def get_companies(id: int | slice | None = None):
    return flask.jsonify({"success": True, "data": handler.get_companies(id)})

@api_bp.route("/homePatients/")
@api_bp.route("/homePatients/<int:id>/")
@handler.token_required
@handler.permission_required("view_patients")
def get_homePatients(id: int | slice | None = None):
    return flask.jsonify({"success": True, "data": handler.get_homePatients(id)})

@api_bp.route("/stats/")
@handler.token_required
@handler.permission_required("view_revenue")
def get_stats():
    return flask.jsonify({"success": True, "data": handler.get_stats()})

# --- PROTECTED POST ROUTES ---

@api_bp.route("/appointments/", methods=["POST"])
@handler.token_required
@handler.permission_required("add_appointments")
def add_appointment():
    return flask.jsonify(handler.add_appointment(flask.request.json))

@api_bp.route("/companies/", methods=["POST"])
@handler.token_required
@handler.permission_required("*") 
def add_company():
    return flask.jsonify(handler.add_company(flask.request.json))

@api_bp.route("/invoices/", methods=["POST"])
@handler.token_required
@handler.permission_required("view_revenue")
def add_invoice():
    return flask.jsonify(handler.add_invoice(flask.request.json))

@api_bp.route("/claims/", methods=["POST"])
@handler.token_required
@handler.permission_required("view_claims")
def add_claim():
    return flask.jsonify(handler.add_claim(flask.request.json))

@api_bp.route("/approvals/", methods=["POST"])
@handler.token_required
@handler.permission_required("view_approvals")
def add_approval():
    return flask.jsonify(handler.add_approval(flask.request.json))

@api_bp.route("/homePatients/", methods=["POST"])
@handler.token_required
@handler.permission_required("add_patients")
def add_homePatient():
    return flask.jsonify(handler.add_homePatient(flask.request.json))

# --- PROTECTED PUT ROUTES ---

@api_bp.route("/appointments/<int:id>/", methods=["PUT"])
@handler.token_required
@handler.permission_required("view_appointments")
def update_appointment(id: int):
    res = handler.update_appointment(id, flask.request.json)
    return flask.jsonify(res) if res else (flask.jsonify({"success":False, "error": "Not found"}), 400)

@api_bp.route("/companies/<int:id>/", methods=["PUT"])
@handler.token_required
@handler.permission_required("*")
def update_company(id: int):
    res = handler.update_company(id, flask.request.json)
    return flask.jsonify(res) if res else (flask.jsonify({"success":False, "error": "Not found"}), 400)

@api_bp.route("/invoices/<int:id>/", methods=["PUT"])
@handler.token_required
@handler.permission_required("view_revenue")
def update_invoice(id: int):
    res = handler.update_invoice(id, flask.request.json)
    return flask.jsonify(res) if res else (flask.jsonify({"success":False, "error": "Not found"}), 400)

@api_bp.route("/claims/<int:id>/", methods=["PUT"])
@handler.token_required
@handler.permission_required("view_claims")
def update_claim(id: int):
    res = handler.update_claim(id, flask.request.json)
    return flask.jsonify(res) if res else (flask.jsonify({"success":False, "error": "Not found"}), 400)

@api_bp.route("/claims/<int:id>/status/", methods=["PUT"])
@handler.token_required
@handler.permission_required("view_claims")
def update_claim_status(id: int):
    res = handler.update_claim_status(id, flask.request.json.get("status"))
    return flask.jsonify(res) if res else (flask.jsonify({"success":False, "error": "Not found"}), 400)

@api_bp.route("/approvals/<int:id>/", methods=["PUT"])
@handler.token_required
@handler.permission_required("view_approvals")
def update_approval(id: int):
    res = handler.update_approval(id, flask.request.json)
    return flask.jsonify(res) if res else (flask.jsonify({"success":False, "error": "Not found"}), 400)

@api_bp.route("/homePatients/<int:id>/", methods=["PUT"])
@handler.token_required
@handler.permission_required("edit_patients")
def update_homePatient(id: int):
    res = handler.update_homePatient(id, flask.request.json)
    return flask.jsonify(res) if res else (flask.jsonify({"success":False, "error": "Not found"}), 400)

# --- PROTECTED DELETE ROUTES ---

@api_bp.route("/appointments/<int:id>/", methods=["DELETE"])
@handler.token_required
@handler.permission_required("view_appointments")
def delete_appointment(id: int):
    res = handler.delete_appointment(id)
    return flask.jsonify(res) if res else (flask.jsonify({"success":False, "error": "Not found"}), 400)

@api_bp.route("/companies/<int:id>/", methods=["DELETE"])
@handler.token_required
@handler.permission_required("*")
def delete_company(id: int):
    res = handler.delete_company(id)
    return flask.jsonify(res) if res else (flask.jsonify({"success":False, "error": "Not found"}), 400)

@api_bp.route("/invoices/<int:id>/", methods=["DELETE"])
@handler.token_required
@handler.permission_required("view_revenue")
def delete_invoice(id: int):
    res = handler.delete_invoice(id)
    return flask.jsonify(res) if res else (flask.jsonify({"success":False, "error": "Not found"}), 400)

@api_bp.route("/claims/<int:id>/", methods=["DELETE"])
@handler.token_required
@handler.permission_required("view_claims")
def delete_claim(id: int):
    res = handler.delete_claim(id)
    return flask.jsonify(res) if res else (flask.jsonify({"success":False, "error": "Not found"}), 400)

@api_bp.route("/approvals/<int:id>/", methods=["DELETE"])
@handler.token_required
@handler.permission_required("view_approvals")
def delete_approval(id: int):
    res = handler.delete_approval(id)
    return flask.jsonify(res) if res else (flask.jsonify({"success":False, "error": "Not found"}), 400)

@api_bp.route("/homePatients/<int:id>/", methods=["DELETE"])
@handler.token_required
@handler.permission_required("*") 
def delete_homePatient(id: int):
    res = handler.delete_homePatient(id)
    return flask.jsonify(res) if res else (flask.jsonify({"success":False, "error": "Not found"}), 400)
