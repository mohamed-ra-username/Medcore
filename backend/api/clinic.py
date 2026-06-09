from typing import Any
import flask
from persistence import data_handler
from core.security.logic import make_response
from core.middleware.security import token_required, permission_required
from . import api_bp

@api_bp.route("/appointments/")
@api_bp.route("/appointments/<id>/")
@token_required
@permission_required("view_appointments")
def get_appointments(id: Any | None = None):
    return make_response(data=data_handler.get_appointments(id))

@api_bp.route("/appointments/", methods=["POST"])
@token_required
@permission_required("add_appointments")
def add_appointment():
    res = data_handler.add_appointment(flask.request.json)
    return make_response(data=res.get("data"))

@api_bp.route("/appointments/<id>/", methods=["PUT"])
@token_required
@permission_required("view_appointments")
def update_appointment(id: Any):
    res = data_handler.update_appointment(id, flask.request.json)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Appointment not found", status_code=404)

@api_bp.route("/appointments/<id>/", methods=["DELETE"])
@token_required
@permission_required("view_appointments")
def delete_appointment(id: Any):
    res = data_handler.delete_appointment(id)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Appointment not found", status_code=404)

@api_bp.route("/companies/")
@api_bp.route("/companies/<id>/")
@token_required
@permission_required("view_claims")
def get_companies(id: Any | None = None):
    return make_response(data=data_handler.get_companies(id))

@api_bp.route("/companies/", methods=["POST"])
@token_required
@permission_required("*") 
def add_company():
    res = data_handler.add_company(flask.request.json)
    return make_response(data=res.get("data"))

@api_bp.route("/companies/<id>/", methods=["PUT"])
@token_required
@permission_required("*")
def update_company(id: Any):
    res = data_handler.update_company(id, flask.request.json)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Company not found", status_code=404)

@api_bp.route("/companies/<id>/", methods=["DELETE"])
@token_required
@permission_required("*")
def delete_company(id: Any):
    res = data_handler.delete_company(id)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Company not found", status_code=404)

