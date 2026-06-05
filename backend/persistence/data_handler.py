# --- AGGREGATOR INTERFACE ---
# This file is the one and only entry point for the rest of the backend.

# 1. Import raw data lists
from .json_repository import *

# 2. Import all CRUD functions
from .crud.get import *
from .crud.post import *
from .crud.put import *
from .crud.delete import *
