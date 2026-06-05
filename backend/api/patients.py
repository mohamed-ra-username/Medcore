import flask
from persistence import data_handler
from core.security.logic import make_response
from core.middleware.timeout import token_required, permission_required
from . import api_bp

@api_bp.route("/homePatients/")
@api_bp.route("/homePatients/<int:id>/")
@token_required
@permission_required("view_patients")
def get_homePatients(id: int | slice | None = None):
    return make_response(data=data_handler.get_homePatients(id))

@api_bp.route("/homePatients/", methods=["POST"])
@token_required
@permission_required("add_patients")
def add_homePatient():
    res = data_handler.add_homePatient(flask.request.json)
    return make_response(data=res.get("data"))

@api_bp.route("/homePatients/<int:id>/", methods=["PUT"])
@token_required
@permission_required("edit_patients")
def update_homePatient(id: int):
    res = data_handler.update_homePatient(id, flask.request.json)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Patient not found", status_code=404)

@api_bp.route("/homePatients/<int:id>/", methods=["DELETE"])
@token_required
@permission_required("*") 
def delete_homePatient(id: int):
    res = data_handler.delete_homePatient(id)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Patient not found", status_code=404)

@api_bp.route("/phones/")
@api_bp.route("/phones/<int:id>/")
@token_required
@permission_required("view_patients")
def get_phones(id: int | slice | None = None):
    return make_response(data=data_handler.get_phones(id))
