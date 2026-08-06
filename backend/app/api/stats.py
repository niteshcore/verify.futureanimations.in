from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models.certificate import Certificate

stats_bp = Blueprint('stats', __name__)


@stats_bp.route('/summary', methods=['GET'])
@jwt_required()
def summary():
    total_certificates = Certificate.query.count()
    recent = Certificate.query.order_by(Certificate.created_at.desc()).limit(5).all()
    recent_data = [{"certificate_id": c.certificate_id, "student_name": c.student_name, "issue_date": c.issue_date.isoformat()} for c in recent]

    return jsonify({
        "total_certificates": total_certificates,
        "verified_certificates": total_certificates,
        "recent_certificates": recent_data
    })
