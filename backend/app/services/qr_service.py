import json
import os
from urllib.parse import quote

import qrcode
from flask import current_app

from app.models.certificate import Certificate


def generate_qr_code(certificate_id_or_obj):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )

    if isinstance(certificate_id_or_obj, Certificate):
        certificate = certificate_id_or_obj
        certificate_id = certificate.certificate_id
    else:
        certificate_id = certificate_id_or_obj
        certificate = Certificate.query.filter_by(certificate_id=certificate_id).first()
        if not certificate:
            raise ValueError(f"Certificate {certificate_id} not found")

    payload = {
        "type": "certificate_verification",
        "verified": True,
        "message": "Intern verified",
        "certificate_id": certificate.certificate_id,
        "student_name": certificate.student_name,
        "internship_role": certificate.internship_role,
        "department": certificate.department,
        "completion_status": certificate.completion_status,
        "start_date": certificate.start_date.isoformat(),
        "end_date": certificate.end_date.isoformat(),
        "issue_date": certificate.issue_date.isoformat(),
        "company_name": certificate.company_name,
        "signatory_name": certificate.signatory_name,
        "signatory_designation": certificate.signatory_designation,
        "email": certificate.email,
        "phone": certificate.phone,
    }

    frontend_urls = current_app.config.get('FRONTEND_URLS', [])
    if isinstance(frontend_urls, str):
        frontend_urls = [origin.strip() for origin in frontend_urls.split(',') if origin.strip()]

    base_url = frontend_urls[0] if frontend_urls else 'http://127.0.0.1:5173'
    encoded_payload = quote(json.dumps(payload, ensure_ascii=False, separators=(",", ":")))
    verify_url = f"{base_url}/verify/{certificate_id}?details={encoded_payload}"

    qr.add_data(verify_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    filename = f"{certificate_id}.png"
    filepath = os.path.join(current_app.config['QR_CODES_DIR'], filename)
    img.save(filepath)

    return f"qrcodes/{filename}"
