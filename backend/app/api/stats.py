from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models.certificate import Certificate, VerificationLog
from sqlalchemy import func
from app.core.extensions import db

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/summary', methods=['GET'])
@jwt_required()
def summary():
    total_certificates = Certificate.query.count()
    verified_certificates = VerificationLog.query.distinct(VerificationLog.certificate_id).count()
    
    # recent certificates (last 5)
    recent = Certificate.query.order_by(Certificate.created_at.desc()).limit(5).all()
    recent_data = [{"certificate_id": c.certificate_id, "student_name": c.student_name, "issue_date": c.issue_date.isoformat()} for c in recent]
    
    return jsonify({
        "total_certificates": total_certificates,
        "verified_certificates": verified_certificates,
        "recent_certificates": recent_data
    })
