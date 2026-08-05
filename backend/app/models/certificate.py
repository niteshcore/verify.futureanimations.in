from datetime import datetime
from app.core.extensions import db

class Certificate(db.Model):
    __tablename__ = 'certificates'

    id = db.Column(db.Integer, primary_key=True)
    certificate_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    student_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    internship_role = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    issue_date = db.Column(db.Date, nullable=False)
    completion_status = db.Column(db.String(50), nullable=False)
    
    certificate_pdf_path = db.Column(db.String(255), nullable=True)
    qr_code_path = db.Column(db.String(255), nullable=False)
    
    company_name = db.Column(db.String(100), default='The Future Animations')
    signatory_name = db.Column(db.String(100), nullable=False)
    signatory_designation = db.Column(db.String(100), nullable=False)
    
    is_revoked = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    verification_logs = db.relationship('VerificationLog', backref='certificate', lazy=True, cascade="all, delete-orphan")

class VerificationLog(db.Model):
    __tablename__ = 'verification_logs'

    id = db.Column(db.Integer, primary_key=True)
    certificate_id = db.Column(db.Integer, db.ForeignKey('certificates.id'), nullable=False)
    ip_address = db.Column(db.String(50), nullable=True)
    user_agent = db.Column(db.String(255), nullable=True)
    verified_at = db.Column(db.DateTime, default=datetime.utcnow)
