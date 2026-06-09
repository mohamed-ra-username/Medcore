import flask
from persistence import data_handler
from core.security.logic import make_response
from core.middleware.security import token_required, permission_required
from . import api_bp

@api_bp.route("/homePatients/")
@api_bp.route("/homePatients/<int:id>/")
@token_required
@permission_required("view_patients")
def get_home_patients(id: int | slice | None = None):
    return make_response(data=data_handler.get_home_patients(id))

@api_bp.route("/homePatients/", methods=["POST"])
@token_required
@permission_required("add_patients")
def add_home_patient():
    res = data_handler.add_home_patient(flask.request.json)
    return make_response(data=res.get("data"))

@api_bp.route("/homePatients/<int:id>/", methods=["PUT"])
@token_required
@permission_required("edit_patients")
def update_home_patient(id: int):
    res = data_handler.update_home_patient(id, flask.request.json)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Patient not found", status_code=404)

@api_bp.route("/homePatients/<int:id>/", methods=["DELETE"])
@token_required
@permission_required("*")
def delete_home_patient(id: int):
    res = data_handler.delete_home_patient(id)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Patient not found", status_code=404)

