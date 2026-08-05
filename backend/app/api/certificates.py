from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from app.models.certificate import Certificate, VerificationLog
from app.core.extensions import db
from app.services.qr_service import generate_qr_code
from datetime import datetime
import os

certificates_bp = Blueprint('certificates', __name__)

def generate_certificate_id():
    # Format: TFA-INT-2026-001
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
    data = request.get_json()
    
    # Required fields
    required = ['student_name', 'email', 'internship_role', 'department', 'start_date', 'end_date', 'issue_date', 'completion_status', 'signatory_name', 'signatory_designation']
    for req in required:
        if req not in data:
            return jsonify({"msg": f"Missing required field: {req}"}), 400
            
    cert_id = generate_certificate_id()
    
    new_cert = Certificate(
        certificate_id=cert_id,
        student_name=data['student_name'],
        email=data['email'],
        phone=data.get('phone'),
        internship_role=data['internship_role'],
        department=data['department'],
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date(),
        issue_date=datetime.strptime(data['issue_date'], '%Y-%m-%d').date(),
        completion_status=data['completion_status'],
        qr_code_path=qr_path,
        company_name=data.get('company_name', 'The Future Animations'),
        signatory_name=data['signatory_name'],
        signatory_designation=data['signatory_designation']
    )
    
    db.session.add(new_cert)
    qr_path = generate_qr_code(new_cert)
    db.session.commit()
    
    return jsonify({"msg": "Certificate created successfully", "certificate_id": cert_id}), 201

@certificates_bp.route('/', methods=['GET'])
@jwt_required()
def list_certificates():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', '')
    
    query = Certificate.query
    if search:
        query = query.filter(
            db.or_(
                Certificate.certificate_id.ilike(f'%{search}%'),
                Certificate.student_name.ilike(f'%{search}%'),
                Certificate.email.ilike(f'%{search}%'),
                Certificate.internship_role.ilike(f'%{search}%')
            )
        )
        
    pagination = query.order_by(Certificate.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    
    results = []
    for c in pagination.items:
        results.append({
            "id": c.id,
            "certificate_id": c.certificate_id,
            "student_name": c.student_name,
            "email": c.email,
            "internship_role": c.internship_role,
            "department": c.department,
            "issue_date": c.issue_date.isoformat(),
            "completion_status": c.completion_status,
            "is_revoked": c.is_revoked
        })
        
    return jsonify({
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page,
        "certificates": results
    })

@certificates_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_certificate(id):
    c = Certificate.query.get_or_404(id)
    return jsonify({
        "id": c.id,
        "certificate_id": c.certificate_id,
        "student_name": c.student_name,
        "email": c.email,
        "phone": c.phone,
        "internship_role": c.internship_role,
        "department": c.department,
        "start_date": c.start_date.isoformat(),
        "end_date": c.end_date.isoformat(),
        "issue_date": c.issue_date.isoformat(),
        "completion_status": c.completion_status,
        "qr_code_path": c.qr_code_path,
        "company_name": c.company_name,
        "signatory_name": c.signatory_name,
        "signatory_designation": c.signatory_designation,
        "is_revoked": c.is_revoked
    })

@certificates_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_certificate(id):
    c = Certificate.query.get_or_404(id)
    db.session.delete(c)
    db.session.commit()
    return jsonify({"msg": "Certificate deleted successfully"})

@certificates_bp.route('/verify/<string:certificate_id>', methods=['GET'])
def verify_certificate(certificate_id):
    c = Certificate.query.filter_by(certificate_id=certificate_id).first()
    
    if not c or c.is_revoked:
        return jsonify({"msg": "Certificate not found or revoked", "valid": False}), 404
        
    # Log the verification
    ip = request.remote_addr
    user_agent = request.user_agent.string
    log = VerificationLog(certificate_id=c.id, ip_address=ip, user_agent=user_agent)
    db.session.add(log)
    db.session.commit()
    
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
        "verified_at": log.verified_at.isoformat()
    })

@certificates_bp.route('/public/qrcodes/<path:filename>', methods=['GET'])
def serve_qr(filename):
    from flask import send_from_directory
    return send_from_directory(current_app.config['QR_CODES_DIR'], filename)
