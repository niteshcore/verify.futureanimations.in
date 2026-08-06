import uuid
import hashlib
from datetime import datetime
from app.core.extensions import db

class Verification(db.Model):
    __tablename__ = 'verifications'

    # Primary key — matches production Supabase schema (never changed)
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

    @property
    def certificate_id(self):
        """
        Generates a stable, human-readable Certificate ID from the verification_token.
        Uses a SHA-256 hash so the same token always produces the same ID.
        No database column required — works with the existing production schema.
        Format: TFA-INT-<YEAR>-<4-digit-number>
        """
        year = self.issue_date.year if self.issue_date else datetime.utcnow().year
        digest = hashlib.sha256(self.verification_token.encode()).hexdigest()
        # Take first 8 hex chars → integer → clamp to 4-digit range (1000–9999)
        num = (int(digest[:8], 16) % 9000) + 1000
        return f"TFA-INT-{year}-{num}"
