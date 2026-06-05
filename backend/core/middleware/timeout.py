import jwt
from flask import request, jsonify, g
from functools import wraps
from core.security.logic import SECRET_KEY, ACCESS_CONTROL

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'success': False, 'error': 'Token is missing!'}), 401
        try:
            if token.startswith("Bearer "):
                token = token.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            g.current_user = data['user']
            g.current_role = data['role']
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'error': 'Token has expired!'}), 401
        except Exception:
            return jsonify({'success': False, 'error': 'Token is invalid!'}), 401
        return f(*args, **kwargs)
    return decorated

def permission_required(permission):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user_permissions = ACCESS_CONTROL.get(g.current_role, [])
            if "*" in user_permissions or permission in user_permissions:
                return f(*args, **kwargs)
            return jsonify({"success": False, "error": "Access Denied"}), 403
        return decorated
    return decorator
