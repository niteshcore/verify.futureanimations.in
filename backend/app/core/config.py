import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///./certificates.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-dev-secret-key")
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 1 day

    # QR codes will encode this URL + /verify/<token>
    # Defaults to the canonical custom domain. Override with VERIFICATION_URL_BASE env var if needed.
    VERIFICATION_URL_BASE = os.environ.get(
        "VERIFICATION_URL_BASE",
        "https://verify.futureanimations.in"
    )

    FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173,http://127.0.0.1:5173")
    PORT = int(os.environ.get("PORT", "5001"))
    HOST = os.environ.get("HOST", "0.0.0.0")

    # Build allowed origins list from env or default to local dev URLs
    _raw_origins = os.environ.get("FRONTEND_URLS", FRONTEND_URL)
    FRONTEND_URLS = [o.strip() for o in _raw_origins.split(",") if o.strip()]

    # Always include all known frontend origins so CORS never blocks the frontend
    _known_origins = [
        "https://futureanimations-verify.vercel.app",   # Vercel deployment (live)
        "https://verify.futureanimations.in",           # custom domain (when DNS is configured)
        "https://www.verify.futureanimations.in",
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ]
    for _o in _known_origins:
        if _o not in FRONTEND_URLS:
            FRONTEND_URLS.append(_o)

    CORS_ALLOWED_ORIGINS = FRONTEND_URLS

    STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'storage')
    QR_CODES_DIR = os.path.join(STORAGE_DIR, 'qrcodes')
    PDFS_DIR = os.path.join(STORAGE_DIR, 'pdfs')
    QR_DIR = os.path.join(STORAGE_DIR, 'qr')
