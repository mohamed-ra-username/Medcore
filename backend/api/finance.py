from typing import Any
import flask
from persistence import data_handler
from core.security.logic import make_response
from core.middleware.security import token_required, permission_required
from . import api_bp

@api_bp.route("/invoices/")
@api_bp.route("/invoices/<id>/")
@token_required
@permission_required("view_revenue")
def get_invoices(id: Any | None = None):
    return make_response(data=data_handler.get_invoices(id))

@api_bp.route("/invoices/", methods=["POST"])
@token_required
@permission_required("view_revenue")
def add_invoice():
    res = data_handler.add_invoice(flask.request.json)
    return make_response(data=res.get("data"))

@api_bp.route("/invoices/<id>/", methods=["PUT"])
@token_required
@permission_required("view_revenue")
def update_invoice(id: Any):
    res = data_handler.update_invoice(id, flask.request.json)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Invoice not found", status_code=404)

@api_bp.route("/invoices/<id>/", methods=["DELETE"])
@token_required
@permission_required("view_revenue")
def delete_invoice(id: Any):
    res = data_handler.delete_invoice(id)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Invoice not found", status_code=404)

@api_bp.route("/claims/")
@api_bp.route("/claims/<id>/")
@token_required
@permission_required("view_claims")
def get_claims(id: Any | None = None):
    return make_response(data=data_handler.get_claims(id))

@api_bp.route("/claims/", methods=["POST"])
@token_required
@permission_required("view_claims")
def add_claim():
    res = data_handler.add_claim(flask.request.json)
    return make_response(data=res.get("data"))

@api_bp.route("/claims/<id>/", methods=["PUT"])
@token_required
@permission_required("view_claims")
def update_claim(id: Any):
    res = data_handler.update_claim(id, flask.request.json)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Claim not found", status_code=404)

@api_bp.route("/claims/<id>/status/", methods=["PUT"])
@token_required
@permission_required("view_claims")
def update_claim_status(id: Any):
    res = data_handler.update_claim_status(id, flask.request.json.get("status"))
    if res:
        return make_response(data=res)
    return make_response(error="Claim not found", status_code=404)

@api_bp.route("/claims/<id>/", methods=["DELETE"])
@token_required
@permission_required("view_claims")
def delete_claim(id: Any):
    res = data_handler.delete_claim(id)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Claim not found", status_code=404)

@api_bp.route("/approvals/")
@api_bp.route("/approvals/<id>/")
@token_required
@permission_required("view_approvals")
def get_approvals(id: Any | None = None):
    return make_response(data=data_handler.get_approvals(id))

@api_bp.route("/approvals/", methods=["POST"])
@token_required
@permission_required("view_approvals")
def add_approval():
    res = data_handler.add_approval(flask.request.json)
    return make_response(data=res.get("data"))

@api_bp.route("/approvals/<id>/", methods=["PUT"])
@token_required
@permission_required("view_approvals")
def update_approval(id: Any):
    res = data_handler.update_approval(id, flask.request.json)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Approval not found", status_code=404)

@api_bp.route("/approvals/<id>/", methods=["DELETE"])
@token_required
@permission_required("view_approvals")
def delete_approval(id: Any):
    res = data_handler.delete_approval(id)
    if res:
        return make_response(data=res.get("data"))
    return make_response(error="Approval not found", status_code=404)
