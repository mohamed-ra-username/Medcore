import flask
from database import handler

# We define the blueprint here so it can be imported by sub-modules
api_bp = flask.Blueprint("api_routes", __name__, url_prefix="/api")

# Now import the routes to register them with the blueprint
from . import auth_routes
from . import patient_routes
from . import finance_routes
from . import clinic_routes
