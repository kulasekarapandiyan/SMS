from app import db, bcrypt
from datetime import datetime
from enum import Enum

class UserRole(Enum):
    SUPER_ADMIN = 'super_admin'      # Software-level admin, manages all schools
    SCHOOL_ADMIN = 'school_admin'    # School-level admin, manages their school only
    PRINCIPAL = 'principal'          # School principal
    DIRECTOR = 'director'            # School director
    TEACHER = 'teacher'              # Teacher
    STUDENT = 'student'              # Student

class User(db.Model):
    """User model for authentication and role management"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(
        db.Enum(UserRole, values_callable=lambda enum_cls: [member.name for member in enum_cls]),
        nullable=False,
        default=UserRole.STUDENT,
    )
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(10))
    profile_picture = db.Column(db.String(255))
    
    # School relationship (multi-tenant)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=True)  # Super admin may not have school
    school = db.relationship('School', back_populates='users')
    
    is_active = db.Column(db.Boolean, default=True)
    email_verified = db.Column(db.Boolean, default=False)
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    student = db.relationship('Student', backref='user', uselist=False, cascade='all, delete-orphan')
    teacher = db.relationship('Teacher', backref='user', uselist=False, cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        if 'password' in kwargs:
            kwargs['password_hash'] = bcrypt.generate_password_hash(kwargs.pop('password')).decode('utf-8')
        super(User, self).__init__(**kwargs)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def get_full_name(self):
        """Get user's full name"""
        return f"{self.first_name} {self.last_name}"
    
    def is_super_admin(self):
        """Check if user is super admin"""
        return self.role == UserRole.SUPER_ADMIN
    
    def is_school_admin(self):
        """Check if user is school admin"""
        return self.role == UserRole.SCHOOL_ADMIN
    
    def is_principal(self):
        """Check if user is principal"""
        return self.role == UserRole.PRINCIPAL
    
    def is_director(self):
        """Check if user is director"""
        return self.role == UserRole.DIRECTOR
    
    def is_admin_level(self):
        """Check if user has admin-level privileges"""
        return self.role in [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.DIRECTOR]
    
    def is_teacher(self):
        """Check if user is teacher"""
        return self.role == UserRole.TEACHER
    
    def is_student(self):
        """Check if user is student"""
        return self.role == UserRole.STUDENT
    
    def can_manage_schools(self):
        """Check if user can manage schools (super admin only)"""
        return self.role == UserRole.SUPER_ADMIN
    
    def can_manage_school(self, school_id):
        """Check if user can manage a specific school"""
        if self.role == UserRole.SUPER_ADMIN:
            return True
        if self.role in [UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.DIRECTOR]:
            return self.school_id == school_id
        return False
    
    def can_manage_users(self, target_user):
        """Check if user can manage another user"""
        if self.role == UserRole.SUPER_ADMIN:
            return True
        if self.role in [UserRole.SCHOOL_ADMIN, UserRole.PRINCIPAL, UserRole.DIRECTOR]:
            return self.school_id == target_user.school_id
        return False
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'role': self.role.value,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'address': self.address,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'gender': self.gender,
            'profile_picture': self.profile_picture,
            'school_id': self.school_id,
            'school_name': self.school.name if self.school else None,
            'is_active': self.is_active,
            'email_verified': self.email_verified,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<User {self.username}>'

