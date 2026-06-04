import flask
from database import handler
from .api import api_bp

@api_bp.route("/invoices/")
@api_bp.route("/invoices/<int:id>/")
@handler.token_required
@handler.permission_required("view_revenue")
def get_invoices(id: int | slice | None = None):
    return handler.make_response(data=handler.get_invoices(id))

@api_bp.route("/invoices/", methods=["POST"])
@handler.token_required
@handler.permission_required("view_revenue")
def add_invoice():
    res = handler.add_invoice(flask.request.json)
    return handler.make_response(data=res.get("data"))

@api_bp.route("/invoices/<int:id>/", methods=["PUT"])
@handler.token_required
@handler.permission_required("view_revenue")
def update_invoice(id: int):
    res = handler.update_invoice(id, flask.request.json)
    if res:
        return handler.make_response(data=res.get("data"))
    return handler.make_response(error="Invoice not found", status_code=404)

@api_bp.route("/invoices/<int:id>/", methods=["DELETE"])
@handler.token_required
@handler.permission_required("view_revenue")
def delete_invoice(id: int):
    res = handler.delete_invoice(id)
    if res:
        return handler.make_response(data=res.get("data"))
    return handler.make_response(error="Invoice not found", status_code=404)

@api_bp.route("/claims/")
@api_bp.route("/claims/<int:id>/")
@handler.token_required
@handler.permission_required("view_claims")
def get_claims(id: int | slice | None = None):
    return handler.make_response(data=handler.get_claims(id))

@api_bp.route("/claims/", methods=["POST"])
@handler.token_required
@handler.permission_required("view_claims")
def add_claim():
    res = handler.add_claim(flask.request.json)
    return handler.make_response(data=res.get("data"))

@api_bp.route("/claims/<int:id>/", methods=["PUT"])
@handler.token_required
@handler.permission_required("view_claims")
def update_claim(id: int):
    res = handler.update_claim(id, flask.request.json)
    if res:
        return handler.make_response(data=res.get("data"))
    return handler.make_response(error="Claim not found", status_code=404)

@api_bp.route("/claims/<int:id>/status/", methods=["PUT"])
@handler.token_required
@handler.permission_required("view_claims")
def update_claim_status(id: int):
    res = handler.update_claim_status(id, flask.request.json.get("status"))
    if res:
        return handler.make_response(data=res)
    return handler.make_response(error="Claim not found", status_code=404)

@api_bp.route("/claims/<int:id>/", methods=["DELETE"])
@handler.token_required
@handler.permission_required("view_claims")
def delete_claim(id: int):
    res = handler.delete_claim(id)
    if res:
        return handler.make_response(data=res.get("data"))
    return handler.make_response(error="Claim not found", status_code=404)

@api_bp.route("/approvals/")
@api_bp.route("/approvals/<int:id>/")
@handler.token_required
@handler.permission_required("view_approvals")
def get_approvals(id: int | slice | None = None):
    return handler.make_response(data=handler.get_approvals(id))

@api_bp.route("/approvals/", methods=["POST"])
@handler.token_required
@handler.permission_required("view_approvals")
def add_approval():
    res = handler.add_approval(flask.request.json)
    return handler.make_response(data=res.get("data"))

@api_bp.route("/approvals/<int:id>/", methods=["PUT"])
@handler.token_required
@handler.permission_required("view_approvals")
def update_approval(id: int):
    res = handler.update_approval(id, flask.request.json)
    if res:
        return handler.make_response(data=res.get("data"))
    return handler.make_response(error="Approval not found", status_code=404)

@api_bp.route("/approvals/<int:id>/", methods=["DELETE"])
@handler.token_required
@handler.permission_required("view_approvals")
def delete_approval(id: int):
    res = handler.delete_approval(id)
    if res:
        return handler.make_response(data=res.get("data"))
    return handler.make_response(error="Approval not found", status_code=404)
