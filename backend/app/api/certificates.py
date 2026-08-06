from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from app.models.certificate import Certificate
from app.core.extensions import db
from app.services.qr_service import generate_qr_code
from datetime import datetime

certificates_bp = Blueprint('certificates', __name__)


def generate_certificate_id():
    year = datetime.utcnow().year
    prefix = f"TFA-INT-{year}-"
    last_cert = Certificate.query.filter(Certificate.certificate_id.like(f"{prefix}%")).order_by(Certificate.id.desc()).first()

    if last_cert:
        try:
            last_seq = int(last_cert.certificate_id.split('-')[-1])
            new_seq = last_seq + 1
        except ValueError:
            new_seq = 1
    else:
        new_seq = 1

    return f"{prefix}{new_seq:03d}"


@certificates_bp.route('/', methods=['POST'])
@jwt_required()
def create_certificate():
    data = request.get_json(silent=True) or {}

    required = ['student_name', 'email', 'internship_role', 'department', 'start_date', 'end_date', 'issue_date', 'completion_status', 'signatory_name', 'signatory_designation']
    for req in required:
        if req not in data or not str(data[req]).strip():
            return jsonify({"msg": f"Missing required field: {req}"}), 400

    cert_id = generate_certificate_id()

    new_cert = Certificate(
        certificate_id=cert_id,
        student_name=data['student_name'],
        email=data['email'],
        internship_role=data['internship_role'],
        department=data['department'],
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date(),
        issue_date=datetime.strptime(data['issue_date'], '%Y-%m-%d').date(),
        completion_status=data['completion_status'],
        company_name=data.get('company_name', 'The Future Animations'),
        signatory_name=data['signatory_name'],
        signatory_designation=data['signatory_designation']
    )

    db.session.add(new_cert)
    db.session.flush()

    qr_path = generate_qr_code(new_cert)
    new_cert.qr_code_path = qr_path
    db.session.commit()

    return jsonify({
        "msg": "Verification QR generated successfully",
        "certificate_id": cert_id,
        "qr_code_path": qr_path,
        "qr_code_filename": qr_path.split('/')[-1]
    }), 201


@certificates_bp.route('/verify/<string:certificate_id>', methods=['GET'])
def verify_certificate(certificate_id):
    c = Certificate.query.filter_by(certificate_id=certificate_id).first()

    if not c:
        return jsonify({"msg": "Certificate not found", "valid": False}), 404

    return jsonify({
        "valid": True,
        "certificate_id": c.certificate_id,
        "student_name": c.student_name,
        "internship_role": c.internship_role,
        "department": c.department,
        "start_date": c.start_date.isoformat(),
        "end_date": c.end_date.isoformat(),
        "issue_date": c.issue_date.isoformat(),
        "completion_status": c.completion_status,
        "company_name": c.company_name,
        "signatory_name": c.signatory_name,
        "signatory_designation": c.signatory_designation,
        "verified_at": datetime.utcnow().isoformat()
    })


@certificates_bp.route('/public/qrcodes/<path:filename>', methods=['GET'])
def serve_qr(filename):
    from flask import send_from_directory
    return send_from_directory(current_app.config['QR_CODES_DIR'], filename)
