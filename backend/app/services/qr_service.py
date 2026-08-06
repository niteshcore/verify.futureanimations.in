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


def generate_verification_qr_code(verification):
    """Generate a QR code and return it as a base64 data URI.

    Stores the QR in-memory only — no filesystem writes — so it works on
    ephemeral cloud platforms like Render where the disk is wiped on redeploy.
    """
    import io
    import base64

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )

    verification_url_base = current_app.config.get('VERIFICATION_URL_BASE', 'https://verify.futureanimations.in')
    verify_url = f"{verification_url_base}/verify/{verification.verification_token}"

    qr.add_data(verify_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    # Encode to base64 in-memory (no disk write)
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    qr_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    data_uri = f"data:image/png;base64,{qr_base64}"

    # Also try to save to disk as a fallback (local dev convenience)
    try:
        qr_dir = current_app.config.get('QR_DIR')
        if qr_dir:
            os.makedirs(qr_dir, exist_ok=True)
            filename = f"{verification.verification_token}.png"
            filepath = os.path.join(qr_dir, filename)
            img.save(filepath)
    except Exception:
        pass  # Silently skip on read-only/ephemeral filesystems

    return data_uri

