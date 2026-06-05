import flask
from persistence import handler
from . import api_bp

@api_bp.route("/homePatients/")
@api_bp.route("/homePatients/<int:id>/")
@handler.token_required
@handler.permission_required("view_patients")
def get_homePatients(id: int | slice | None = None):
    return handler.make_response(data=handler.get_homePatients(id))

@api_bp.route("/homePatients/", methods=["POST"])
@handler.token_required
@handler.permission_required("add_patients")
def add_homePatient():
    res = handler.add_homePatient(flask.request.json)
    return handler.make_response(data=res.get("data"))

@api_bp.route("/homePatients/<int:id>/", methods=["PUT"])
@handler.token_required
@handler.permission_required("edit_patients")
def update_homePatient(id: int):
    res = handler.update_homePatient(id, flask.request.json)
    if res:
        return handler.make_response(data=res.get("data"))
    return handler.make_response(error="Patient not found", status_code=404)

@api_bp.route("/homePatients/<int:id>/", methods=["DELETE"])
@handler.token_required
@handler.permission_required("*") 
def delete_homePatient(id: int):
    res = handler.delete_homePatient(id)
    if res:
        return handler.make_response(data=res.get("data"))
    return handler.make_response(error="Patient not found", status_code=404)

@api_bp.route("/phones/")
@api_bp.route("/phones/<int:id>/")
@handler.token_required
@handler.permission_required("view_patients")
def get_phones(id: int | slice | None = None):
    return handler.make_response(data=handler.get_phones(id))
