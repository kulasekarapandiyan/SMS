from app import db
from datetime import datetime

class Student(db.Model):
    """Student model for academic information"""
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    student_id = db.Column(db.String(20), unique=True, nullable=False, index=True)
    admission_date = db.Column(db.Date, nullable=False)
    current_class_id = db.Column(db.Integer, db.ForeignKey('classes.id'))
    parent_name = db.Column(db.String(100))
    parent_phone = db.Column(db.String(20))
    parent_email = db.Column(db.String(120))
    emergency_contact = db.Column(db.String(20))
    blood_group = db.Column(db.String(5))
    medical_conditions = db.Column(db.Text)
    previous_school = db.Column(db.String(200))
    academic_year = db.Column(db.String(10))
    status = db.Column(db.String(20), default='active')  # active, inactive, graduated, transferred
    
    # School relationship (multi-tenant)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    school = db.relationship('School', backref='students')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    current_class = db.relationship('Class', back_populates='students')
    attendances = db.relationship('Attendance', backref='student', cascade='all, delete-orphan')
    grades = db.relationship('Grade', backref='student', cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        if 'student_id' not in kwargs:
            # Generate student ID if not provided
            kwargs['student_id'] = self.generate_student_id()
        super(Student, self).__init__(**kwargs)
    
    def generate_student_id(self):
        """Generate unique student ID"""
        import random
        import string
        year = datetime.now().year
        random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return f"STU{year}{random_chars}"
    
    def get_full_name(self):
        """Get student's full name from user"""
        return self.user.get_full_name() if self.user else "Unknown"
    
    def get_current_class_name(self):
        """Get current class name"""
        return self.current_class.name if self.current_class else "Not Assigned"
    
    def get_attendance_percentage(self, subject_id=None, start_date=None, end_date=None):
        """Calculate attendance percentage"""
        from .attendance import Attendance
        
        query = Attendance.query.filter_by(student_id=self.id)
        
        if subject_id:
            query = query.filter_by(subject_id=subject_id)
        if start_date:
            query = query.filter(Attendance.date >= start_date)
        if end_date:
            query = query.filter(Attendance.date <= end_date)
        
        total_classes = query.count()
        present_classes = query.filter_by(status='present').count()
        
        if total_classes == 0:
            return 0
        return round((present_classes / total_classes) * 100, 2)
    
    def get_average_grade(self, subject_id=None):
        """Calculate average grade"""
        from .grade import Grade
        
        query = Grade.query.filter_by(student_id=self.id)
        if subject_id:
            query = query.filter_by(subject_id=subject_id)
        
        grades = query.all()
        if not grades:
            return 0
        
        total_score = sum(grade.score for grade in grades)
        return round(total_score / len(grades), 2)
    
    def to_dict(self):
        """Convert student to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'student_id': self.student_id,
            'admission_date': self.admission_date.isoformat() if self.admission_date else None,
            'current_class_id': self.current_class_id,
            'current_class_name': self.get_current_class_name(),
            'parent_name': self.parent_name,
            'parent_phone': self.parent_phone,
            'parent_email': self.parent_email,
            'emergency_contact': self.emergency_contact,
            'blood_group': self.blood_group,
            'medical_conditions': self.medical_conditions,
            'previous_school': self.previous_school,
            'academic_year': self.academic_year,
            'status': self.status,
            'full_name': self.get_full_name(),
            'attendance_percentage': self.get_attendance_percentage(),
            'average_grade': self.get_average_grade(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Student {self.student_id}>'

