from app import db
from datetime import datetime

class Subject(db.Model):
    """Subject model for managing academic subjects"""
    __tablename__ = 'subjects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, index=True)
    code = db.Column(db.String(20), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False)
    credits = db.Column(db.Integer, default=1)
    hours_per_week = db.Column(db.Integer, default=5)
    syllabus = db.Column(db.Text)
    books = db.Column(db.Text)
    status = db.Column(db.String(20), default='active')  # active, inactive, completed
    
    # School relationship (multi-tenant)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    school = db.relationship('School', back_populates='subjects')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    attendances = db.relationship('Attendance', backref='subject', cascade='all, delete-orphan')
    grades = db.relationship('Grade', backref='subject', cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        if 'code' not in kwargs:
            kwargs['code'] = self.generate_subject_code(kwargs.get('name', ''))
        super(Subject, self).__init__(**kwargs)
    
    def generate_subject_code(self, name):
        """Generate subject code from name"""
        if not name:
            return "SUB001"
        
        # Take first 3 letters and add random numbers
        import random
        prefix = name[:3].upper()
        suffix = str(random.randint(100, 999))
        return f"{prefix}{suffix}"
    
    def get_class_name(self):
        """Get class name"""
        return self.class_obj.get_full_name() if self.class_obj else "Unknown"
    
    def get_teacher_name(self):
        """Get teacher name"""
        return self.teacher.get_full_name() if self.teacher else "Unknown"
    
    def get_total_students(self):
        """Get total number of students in this subject"""
        return self.class_obj.current_strength if self.class_obj else 0
    
    def get_attendance_summary(self, date=None):
        """Get attendance summary for this subject"""
        from .attendance import Attendance
        
        query = Attendance.query.filter_by(subject_id=self.id)
        if date:
            query = query.filter_by(date=date)
        
        total_students = self.get_total_students()
        present_students = query.filter_by(status='present').count()
        absent_students = query.filter_by(status='absent').count()
        late_students = query.filter_by(status='late').count()
        
        return {
            'total_students': total_students,
            'present': present_students,
            'absent': absent_students,
            'late': late_students,
            'attendance_percentage': round((present_students / total_students * 100), 2) if total_students > 0 else 0
        }
    
    def get_average_grade(self):
        """Get average grade for this subject"""
        from .grade import Grade
        
        grades = Grade.query.filter_by(subject_id=self.id).all()
        if not grades:
            return 0
        
        total_score = sum(grade.score for grade in grades)
        return round(total_score / len(grades), 2)
    
    def get_schedule(self):
        """Get subject schedule (placeholder for future implementation)"""
        # This would typically integrate with a timetable system
        return {
            'days': ['Monday', 'Wednesday', 'Friday'],
            'time': '09:00 AM - 10:00 AM',
            'room': self.class_obj.room_number if self.class_obj else 'TBD'
        }
    
    def to_dict(self):
        """Convert subject to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'description': self.description,
            'class_id': self.class_id,
            'class_name': self.get_class_name(),
            'teacher_id': self.teacher_id,
            'teacher_name': self.get_teacher_name(),
            'credits': self.credits,
            'hours_per_week': self.hours_per_week,
            'syllabus': self.syllabus,
            'books': self.books,
            'status': self.status,
            'total_students': self.get_total_students(),
            'attendance_summary': self.get_attendance_summary(),
            'average_grade': self.get_average_grade(),
            'schedule': self.get_schedule(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Subject {self.code}: {self.name}>'

