import uuid
from datetime import datetime
from app.core.extensions import db

class Verification(db.Model):
    __tablename__ = 'verifications'

    verification_token = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    student_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    internship_role = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    issue_date = db.Column(db.Date, nullable=False)
    completion_status = db.Column(db.String(50), nullable=False)
    company_name = db.Column(db.String(100), default='The Future Animations', nullable=False)
    signatory_name = db.Column(db.String(100), nullable=False)
    signatory_designation = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
