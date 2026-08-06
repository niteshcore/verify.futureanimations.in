import uuid
from datetime import datetime
from app.core.extensions import db

class Verification(db.Model):
    __tablename__ = 'verifications'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    verification_token = db.Column(db.String(36), default=lambda: str(uuid.uuid4()), unique=True, index=True)
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

    @property
    def certificate_id(self):
        year = self.issue_date.year if self.issue_date else datetime.utcnow().year
        return f"TFA-INT-{year}-{self.id:03d}"
