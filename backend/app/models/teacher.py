from app import db
from datetime import datetime

class Teacher(db.Model):
    """Teacher model for professional information"""
    __tablename__ = 'teachers'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    teacher_id = db.Column(db.String(20), unique=True, nullable=False, index=True)
    employee_id = db.Column(db.String(20), unique=True, nullable=False)
    hire_date = db.Column(db.Date, nullable=False)
    department = db.Column(db.String(100))
    designation = db.Column(db.String(100))
    qualification = db.Column(db.String(200))
    experience_years = db.Column(db.Integer)
    salary = db.Column(db.Numeric(10, 2))
    specialization = db.Column(db.String(200))
    office_location = db.Column(db.String(100))
    office_hours = db.Column(db.String(100))
    status = db.Column(db.String(20), default='active')  # active, inactive, on_leave, retired
    
    # School relationship (multi-tenant)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    school = db.relationship('School', backref='teachers')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    subjects = db.relationship('Subject', backref='teacher', cascade='all, delete-orphan')
    classes = db.relationship('Class', backref='class_teacher', cascade='all, delete-orphan')
    attendances = db.relationship('Attendance', backref='teacher', cascade='all, delete-orphan')
    grades = db.relationship('Grade', backref='teacher', cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        if 'teacher_id' not in kwargs:
            kwargs['teacher_id'] = self.generate_teacher_id()
        if 'employee_id' not in kwargs:
            kwargs['employee_id'] = self.generate_employee_id()
        super(Teacher, self).__init__(**kwargs)
    
    def generate_teacher_id(self):
        """Generate unique teacher ID"""
        import random
        import string
        year = datetime.now().year
        random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return f"TCH{year}{random_chars}"
    
    def generate_employee_id(self):
        """Generate unique employee ID"""
        import random
        import string
        year = datetime.now().year
        random_chars = ''.join(random.choices(string.digits, k=4))
        return f"EMP{year}{random_chars}"
    
    def get_full_name(self):
        """Get teacher's full name from user"""
        return self.user.get_full_name() if self.user else "Unknown"
    
    def get_subjects(self):
        """Get list of subjects taught by teacher"""
        return [subject.name for subject in self.subjects]
    
    def get_classes(self):
        """Get list of classes taught by teacher"""
        return [class_obj.name for class_obj in self.classes]
    
    def get_total_students(self):
        """Get total number of students taught by teacher"""
        total = 0
        for class_obj in self.classes:
            total += len(class_obj.students)
        return total
    
    def get_workload(self):
        """Calculate teacher's workload (number of classes and subjects)"""
        return {
            'subjects_count': len(self.subjects),
            'classes_count': len(self.classes),
            'total_students': self.get_total_students()
        }
    
    def to_dict(self):
        """Convert teacher to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'teacher_id': self.teacher_id,
            'employee_id': self.employee_id,
            'hire_date': self.hire_date.isoformat() if self.hire_date else None,
            'department': self.department,
            'designation': self.designation,
            'qualification': self.qualification,
            'experience_years': self.experience_years,
            'salary': float(self.salary) if self.salary else None,
            'specialization': self.specialization,
            'office_location': self.office_location,
            'office_hours': self.office_hours,
            'status': self.status,
            'full_name': self.get_full_name(),
            'subjects': self.get_subjects(),
            'classes': self.get_classes(),
            'workload': self.get_workload(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Teacher {self.teacher_id}>'

