from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required
from app.models.verification import Verification
from app.core.extensions import db
from app.services.qr_service import generate_verification_qr_code
from datetime import datetime
from werkzeug.utils import secure_filename
import os

verification_bp = Blueprint('verification', __name__)

@verification_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_verification():
    data = request.get_json(silent=True) or {}

    required = [
        'student_name', 'email', 'internship_role', 'department',
        'start_date', 'end_date', 'issue_date', 'completion_status',
        'signatory_name', 'signatory_designation'
    ]
    for req in required:
        if req not in data or not str(data[req]).strip():
            return jsonify({"msg": f"Missing required field: {req}"}), 400

    # Ensure company_name is fixed on the backend
    company_name = "The Future Animations"

    try:
        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        issue_date = datetime.strptime(data['issue_date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"msg": "Invalid date format. Expected YYYY-MM-DD."}), 400

    new_verification = Verification(
        student_name=data['student_name'].strip(),
        email=data['email'].strip(),
        internship_role=data['internship_role'].strip(),
        department=data['department'].strip(),
        start_date=start_date,
        end_date=end_date,
        issue_date=issue_date,
        completion_status=data['completion_status'].strip(),
        company_name=company_name,
        signatory_name=data['signatory_name'].strip(),
        signatory_designation=data['signatory_designation'].strip()
    )

    db.session.add(new_verification)
    db.session.commit()

    # Generate QR code (returns base64 data URI — no disk writes)
    qr_data_uri = generate_verification_qr_code(new_verification)

    # Persist QR data in the DB so it survives across restarts/redeployments
    new_verification.qr_code_data = qr_data_uri
    db.session.commit()

    verification_url_base = current_app.config.get('VERIFICATION_URL_BASE', 'https://verify.futureanimations.in')
    verification_url = f"{verification_url_base}/verify/{new_verification.verification_token}"

    return jsonify({
        "msg": "Verification record and QR generated successfully",
        "verification_token": new_verification.verification_token,
        "verification_url": verification_url,
        "qr_image_data": qr_data_uri,
        "qr_filename": f"{new_verification.verification_token}.png"
    }), 201


@verification_bp.route('/<string:verification_token>', methods=['GET'])
def get_verification(verification_token):
    # Fetch record using token
    v = Verification.query.filter_by(verification_token=verification_token).first()

    if not v:
        # Prevent exposing backend errors, show a simple 404 message
        return jsonify({"msg": "Verification Record Not Found."}), 404

    return jsonify({
        "student_name": v.student_name,
        "email": v.email,
        "internship_role": v.internship_role,
        "department": v.department,
        "start_date": v.start_date.isoformat(),
        "end_date": v.end_date.isoformat(),
        "issue_date": v.issue_date.isoformat(),
        "completion_status": v.completion_status,
        "company_name": v.company_name,
        "signatory_name": v.signatory_name,
        "signatory_designation": v.signatory_designation,
        "created_at": v.created_at.isoformat(),
        "verified_at": datetime.utcnow().isoformat()
    })


@verification_bp.route('/qr/<path:filename>', methods=['GET'])
def serve_qr(filename):
    # Security check: Prevent directory traversal
    safe_filename = secure_filename(filename)
    if not safe_filename.endswith('.png') or safe_filename != filename:
        return jsonify({"msg": "Access denied"}), 403

    qr_dir = current_app.config['QR_DIR']
    file_path = os.path.join(qr_dir, safe_filename)
    
    # Verify that the file actually exists inside the QR directory
    if not os.path.exists(file_path):
        return jsonify({"msg": "File not found"}), 404
        
    return send_from_directory(qr_dir, safe_filename)
