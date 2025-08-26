from datetime import datetime
from app import db
from sqlalchemy import Index

class School(db.Model):
    """School model for multi-tenant support"""
    __tablename__ = 'schools'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    code = db.Column(db.String(20), unique=True, nullable=False)
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    country = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    website = db.Column(db.String(200))
    
    # School configuration
    academic_year = db.Column(db.String(20), default='2024-2025')
    semester_system = db.Column(db.Boolean, default=True)
    grading_system = db.Column(db.String(50), default='percentage')  # percentage, letter, gpa
    attendance_system = db.Column(db.String(50), default='daily')  # daily, period-wise
    
    # School branding
    logo_url = db.Column(db.String(500))
    primary_color = db.Column(db.String(7), default='#1976d2')
    secondary_color = db.Column(db.String(7), default='#dc004e')
    
    # School settings
    max_students_per_class = db.Column(db.Integer, default=40)
    max_teachers_per_subject = db.Column(db.Integer, default=3)
    enable_sms_notifications = db.Column(db.Boolean, default=False)
    enable_email_notifications = db.Column(db.Boolean, default=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    users = db.relationship('User', back_populates='school', lazy='dynamic')
    classes = db.relationship('Class', back_populates='school', lazy='dynamic')
    subjects = db.relationship('Subject', back_populates='school', lazy='dynamic')

    __table_args__ = (
        Index('ix_schools_code', 'code'),
    )
    
    def __init__(self, **kwargs):
        super(School, self).__init__(**kwargs)
        if not self.code:
            self.code = self.generate_school_code()
    
    def generate_school_code(self):
        """Generate a unique school code"""
        import random
        import string
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        while School.query.filter_by(code=code).first():
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return code
    
    def to_dict(self):
        """Convert school to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'postal_code': self.postal_code,
            'phone': self.phone,
            'email': self.email,
            'website': self.website,
            'academic_year': self.academic_year,
            'semester_system': self.semester_system,
            'grading_system': self.grading_system,
            'attendance_system': self.attendance_system,
            'logo_url': self.logo_url,
            'primary_color': self.primary_color,
            'secondary_color': self.secondary_color,
            'max_students_per_class': self.max_students_per_class,
            'max_teachers_per_subject': self.max_teachers_per_subject,
            'enable_sms_notifications': self.enable_sms_notifications,
            'enable_email_notifications': self.enable_email_notifications,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_active': self.is_active
        }
    
    def get_statistics(self):
        """Get school statistics"""
        return {
            'total_students': self.users.filter_by(role='student').count(),
            'total_teachers': self.users.filter_by(role='teacher').count(),
            'total_classes': self.classes.count(),
            'total_subjects': self.subjects.count(),
            'total_admins': self.users.filter_by(role='admin').count()
        }

