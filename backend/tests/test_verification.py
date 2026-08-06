import unittest
import json
from app import create_app
from app.core.extensions import db
from app.models.verification import Verification
from app.models.admin import Admin
from flask_jwt_extended import create_access_token

class TestConfig:
    SECRET_KEY = "test-secret"
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "test-jwt-secret"
    JWT_ACCESS_TOKEN_EXPIRES = 3600
    QR_DIR = "/tmp/test-qr"
    QR_CODES_DIR = "/tmp/test-qrcodes"
    PDFS_DIR = "/tmp/test-pdfs"
    CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
    VERIFICATION_URL_BASE = "https://verify.futureanimations.in"

class VerificationTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
        
        with self.app.app_context():
            # Retrieve seeded admin
            admin = Admin.query.filter_by(username='admin').first()
            self.token = create_access_token(identity=str(admin.id))

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_generate_verification_requires_auth(self):
        response = self.client.post('/api/v1/verification/generate', json={})
        self.assertEqual(response.status_code, 401)

    def test_generate_verification_success(self):
        payload = {
            "student_name": "Test Intern",
            "email": "intern@test.com",
            "internship_role": "Software Developer Intern",
            "department": "Engineering",
            "start_date": "2026-01-01",
            "end_date": "2026-06-30",
            "issue_date": "2026-07-01",
            "completion_status": "Completed",
            "signatory_name": "Jane Director",
            "signatory_designation": "Director"
        }
        
        headers = {
            "Authorization": f"Bearer {self.token}"
        }
        
        response = self.client.post('/api/v1/verification/generate', json=payload, headers=headers)
        self.assertEqual(response.status_code, 201)
        
        data = response.get_json()
        self.assertIn("verification_token", data)
        self.assertIn("verification_url", data)
        self.assertIn("qr_image_data", data)
        self.assertTrue(data["qr_image_data"].startswith("data:image/png;base64,"))
        self.assertEqual(data["qr_filename"], f"{data['verification_token']}.png")
        self.assertIn("certificate_id", data)
        self.assertTrue(data["certificate_id"].startswith("TFA-INT-"))
        
        # Verify it is in database
        with self.app.app_context():
            record = Verification.query.filter_by(verification_token=data["verification_token"]).first()
            self.assertIsNotNone(record)
            self.assertEqual(record.student_name, "Test Intern")
            self.assertEqual(record.company_name, "The Future Animations")

    def test_get_verification_public(self):
        with self.app.app_context():
            v = Verification(
                verification_token="test-token-uuid-12345",
                student_name="Alice Smith",
                email="alice@test.com",
                internship_role="Designer Intern",
                department="Design",
                start_date=datetime_from_str("2026-01-01"),
                end_date=datetime_from_str("2026-03-31"),
                issue_date=datetime_from_str("2026-04-01"),
                completion_status="Completed",
                company_name="The Future Animations",
                signatory_name="Bob Director",
                signatory_designation="HR Lead"
            )
            db.session.add(v)
            db.session.commit()

        response = self.client.get('/api/v1/verification/test-token-uuid-12345')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["student_name"], "Alice Smith")
        self.assertEqual(data["company_name"], "The Future Animations")
        self.assertIn("verified_at", data)
        self.assertIn("certificate_id", data)
        self.assertTrue(data["certificate_id"].startswith("TFA-INT-"))

    def test_get_verification_not_found(self):
        response = self.client.get('/api/v1/verification/non-existent-token')
        self.assertEqual(response.status_code, 404)
        data = response.get_json()
        self.assertEqual(data["msg"], "Verification Record Not Found.")

    def test_serve_qr_directory_traversal_prevention(self):
        # Generate a verification first to get a real token
        payload = {
            "student_name": "QR Test",
            "email": "qr@test.com",
            "internship_role": "Dev Intern",
            "department": "Engineering",
            "start_date": "2026-01-01",
            "end_date": "2026-06-30",
            "issue_date": "2026-07-01",
            "completion_status": "Completed",
            "signatory_name": "Jane Director",
            "signatory_designation": "Director"
        }
        headers = {"Authorization": f"Bearer {self.token}"}
        gen_res = self.client.post('/api/v1/verification/generate', json=payload, headers=headers)
        self.assertEqual(gen_res.status_code, 201)
        token = gen_res.get_json()["verification_token"]

        # Valid token returns QR data
        response = self.client.get(f'/api/v1/verification/qr/{token}')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("qr_image_data", data)
        self.assertTrue(data["qr_image_data"].startswith("data:image/png;base64,"))

        # Non-existent token returns 404
        response = self.client.get('/api/v1/verification/qr/non-existent-token')
        self.assertEqual(response.status_code, 404)

    def test_list_verifications_requires_auth(self):
        response = self.client.get('/api/v1/verification/')
        self.assertEqual(response.status_code, 401)

    def test_list_verifications_success(self):
        with self.app.app_context():
            v1 = Verification(
                verification_token="token-1",
                student_name="Alice Smith",
                email="alice@test.com",
                internship_role="Designer Intern",
                department="Design",
                start_date=datetime_from_str("2026-01-01"),
                end_date=datetime_from_str("2026-03-31"),
                issue_date=datetime_from_str("2026-04-01"),
                completion_status="Completed",
                company_name="The Future Animations",
                signatory_name="Bob Director",
                signatory_designation="HR Lead"
            )
            v2 = Verification(
                verification_token="token-2",
                student_name="Charlie Brown",
                email="charlie@test.com",
                internship_role="Developer Intern",
                department="Engineering",
                start_date=datetime_from_str("2026-02-01"),
                end_date=datetime_from_str("2026-04-30"),
                issue_date=datetime_from_str("2026-05-01"),
                completion_status="Completed",
                company_name="The Future Animations",
                signatory_name="Bob Director",
                signatory_designation="HR Lead"
            )
            db.session.add(v1)
            db.session.add(v2)
            db.session.commit()

        headers = {"Authorization": f"Bearer {self.token}"}
        response = self.client.get('/api/v1/verification/', headers=headers)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["student_name"], "Charlie Brown") # Sorted desc by created_at
        self.assertEqual(data[1]["student_name"], "Alice Smith")
        self.assertIn("certificate_id", data[0])
        self.assertIn("certificate_id", data[1])
        self.assertTrue(data[0]["certificate_id"].startswith("TFA-INT-"))
        self.assertTrue(data[1]["certificate_id"].startswith("TFA-INT-"))

def datetime_from_str(s):
    from datetime import datetime
    return datetime.strptime(s, '%Y-%m-%d').date()

if __name__ == '__main__':
    unittest.main()
