import flask
from persistence import handler
from . import api_bp

@api_bp.route("/appointments/")
@api_bp.route("/appointments/<int:id>/")
@handler.token_required
@handler.permission_required("view_appointments")
def get_appointments(id: int | slice | None = None):
    return handler.make_response(data=handler.get_appointments(id))

@api_bp.route("/appointments/", methods=["POST"])
@handler.token_required
@handler.permission_required("add_appointments")
def add_appointment():
    res = handler.add_appointment(flask.request.json)
    return handler.make_response(data=res.get("data"))

@api_bp.route("/appointments/<int:id>/", methods=["PUT"])
@handler.token_required
@handler.permission_required("view_appointments")
def update_appointment(id: int):
    res = handler.update_appointment(id, flask.request.json)
    if res:
        return handler.make_response(data=res.get("data"))
    return handler.make_response(error="Appointment not found", status_code=404)

@api_bp.route("/appointments/<int:id>/", methods=["DELETE"])
@handler.token_required
@handler.permission_required("view_appointments")
def delete_appointment(id: int):
    res = handler.delete_appointment(id)
    if res:
        return handler.make_response(data=res.get("data"))
    return handler.make_response(error="Appointment not found", status_code=404)

@api_bp.route("/companies/")
@api_bp.route("/companies/<int:id>/")
@handler.token_required
@handler.permission_required("view_claims")
def get_companies(id: int | slice | None = None):
    return handler.make_response(data=handler.get_companies(id))

@api_bp.route("/companies/", methods=["POST"])
@handler.token_required
@handler.permission_required("*") 
def add_company():
    res = handler.add_company(flask.request.json)
    return handler.make_response(data=res.get("data"))

@api_bp.route("/companies/<int:id>/", methods=["PUT"])
@handler.token_required
@handler.permission_required("*")
def update_company(id: int):
    res = handler.update_company(id, flask.request.json)
    if res:
        return handler.make_response(data=res.get("data"))
    return handler.make_response(error="Company not found", status_code=404)

@api_bp.route("/companies/<int:id>/", methods=["DELETE"])
@handler.token_required
@handler.permission_required("*")
def delete_company(id: int):
    res = handler.delete_company(id)
    if res:
        return handler.make_response(data=res.get("data"))
    return handler.make_response(error="Company not found", status_code=404)

@api_bp.route("/stats/")
@handler.token_required
@handler.permission_required("view_revenue")
def get_stats():
    return handler.make_response(data=handler.get_stats())
