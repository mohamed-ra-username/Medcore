import flask
from typing import Any
from persistence import data_handler
from core.security.logic import make_response
from core.middleware.security import token_required, permission_required
from . import api_bp

@api_bp.route("/patients/")
@api_bp.route("/patients/<id>/")
@token_required
@permission_required("view_patients")
def get_patients(id: Any | None = None):
    return make_response(data=data_handler.get_patients(id))

@api_bp.route("/patients/", methods=["POST"])
@token_required
@permission_required("add_patients")
def add_patient():
    res = data_handler.add_patient(flask.request.json)
    return make_response(data=res.get("data"))

@api_bp.route("/patients/<id>/", methods=["PUT"])
@token_required
@permission_required("edit_patients")
def update_patient(id: Any):
    res = data_handler.update_patient(id, flask.request.json)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Patient not found", status_code=404)

@api_bp.route("/patients/<id>/", methods=["DELETE"])
@token_required
@permission_required("*")
def delete_patient(id: Any):
    res = data_handler.delete_patient(id)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Patient not found", status_code=404)
