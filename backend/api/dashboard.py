import flask
from core.services import statistics
from core.security.logic import make_response
from core.middleware.security import token_required, permission_required
from . import api_bp


@api_bp.route("/statistics/")
@token_required
@permission_required("view_statistics")
def get_statistics():
    return make_response(data={
        "revenue": statistics.get_revenue(),
        "patients": statistics.get_patients_increase(),
        "appointments": statistics.get_appointments_increase()
    })
