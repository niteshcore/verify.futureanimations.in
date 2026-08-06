from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.admin import Admin

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])

def login():

    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    data = request.get_json()

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"msg": "Missing username or password"}), 400

    admin = Admin.query.filter_by(username=data.get('username')).first()

    if not admin or not admin.check_password(data.get('password')):
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=str(admin.id))

    return jsonify(
        access_token=access_token,
        user={
            "username": admin.username,
            "role": admin.role
        }
    )

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    admin = Admin.query.get(current_user_id)
    if not admin:
        return jsonify({"msg": "Admin not found"}), 404
    return jsonify({"username": admin.username, "email": admin.email, "role": admin.role})
