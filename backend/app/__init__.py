import os
from flask import Flask
from app.core.config import Config
from app.core.extensions import db, jwt, migrate
from app.models.admin import Admin

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    
    from flask_cors import CORS
    
    print(app.config["CORS_ALLOWED_ORIGINS"])

    CORS(
        app,
        resources={r"/api/*": {"origins": app.config.get('CORS_ALLOWED_ORIGINS', app.config.get('FRONTEND_URLS', [app.config.get('FRONTEND_URL')]))}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    # Ensure storage dirs exist
    os.makedirs(app.config['QR_CODES_DIR'], exist_ok=True)
    os.makedirs(app.config['PDFS_DIR'], exist_ok=True)
    os.makedirs(app.config['QR_DIR'], exist_ok=True)

    # Register Blueprints
    from app.api.auth import auth_bp
    from app.api.certificates import certificates_bp
    from app.api.stats import stats_bp
    from app.api.verification import verification_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(certificates_bp, url_prefix='/api/v1/certificates')
    app.register_blueprint(stats_bp, url_prefix='/api/v1/stats')
    app.register_blueprint(verification_bp, url_prefix='/api/v1/verification')

    @app.route('/')
    def index():
        from flask import jsonify
        return jsonify({
            "status": "online", 
            "service": "TFA Certificate Verification API",
            "message": "The backend API is running. The frontend UI runs on port 5173."
        })


    # Create tables
    with app.app_context():
        db.create_all()
        # Seed an admin user if none exists
        if not Admin.query.filter_by(username='admin').first():
            admin = Admin(username='admin', email='admin@futureanimations.in')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()

    return app
