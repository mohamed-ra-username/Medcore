import flask
from persistence import data_handler

# The main API Blueprint (Public REST API)
api_bp = flask.Blueprint("api_routes", __name__, url_prefix="/api")


# Register sub-modules from the same folder
from . import auth
from . import patients
from . import finance
from . import clinic
from . import dashboard
