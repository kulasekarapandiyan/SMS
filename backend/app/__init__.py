from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app(config_class=Config):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    # Register blueprints (auth required, others optional)
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    try:
        from app.routes.schools import schools_bp
        app.register_blueprint(schools_bp, url_prefix='/api/schools')
    except Exception:
        pass

    try:
        from app.routes.students import students_bp
        app.register_blueprint(students_bp, url_prefix='/api/students')
    except Exception:
        pass

    try:
        from app.routes.teachers import teachers_bp
        app.register_blueprint(teachers_bp, url_prefix='/api/teachers')
    except Exception:
        pass

    try:
        from app.routes.classes import classes_bp
        app.register_blueprint(classes_bp, url_prefix='/api/classes')
    except Exception:
        pass

    try:
        from app.routes.subjects import subjects_bp
        app.register_blueprint(subjects_bp, url_prefix='/api/subjects')
    except Exception:
        pass

    try:
        from app.routes.attendance import attendance_bp
        app.register_blueprint(attendance_bp, url_prefix='/api/attendance')
    except Exception:
        pass

    try:
        from app.routes.grades import grades_bp
        app.register_blueprint(grades_bp, url_prefix='/api/grades')
    except Exception:
        pass

    try:
        from app.routes.admin import admin_bp
        app.register_blueprint(admin_bp, url_prefix='/api/admin')
    except Exception:
        pass

    # Create database tables
    with app.app_context():
        db.create_all()

    return app

