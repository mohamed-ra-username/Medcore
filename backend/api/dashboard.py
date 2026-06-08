import flask
from persistence import data_handler
from core.services import statistics
from core.security.logic import make_response
from core.middleware.timeout import token_required, permission_required
from . import api_bp


@api_bp.route("/stats/")
@token_required
@permission_required("view_revenue")
def get_stats():
    return make_response(data=data_handler.get_stats())


@api_bp.route("/statistics/")
@token_required
@permission_required("view_statistics")
def get_statistics():
    return make_response(data={"revenue": statistics.get_revenue(), "patients": statistics.get_patients_increase(), "appointments": statistics.get_appointments_increase()})
