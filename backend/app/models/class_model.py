from app import db
from datetime import datetime

class Class(db.Model):
    """Class model for managing school classes and sections"""
    __tablename__ = 'classes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, index=True)
    section = db.Column(db.String(10), nullable=False)
    academic_year = db.Column(db.String(10), nullable=False)
    capacity = db.Column(db.Integer, default=40)
    current_strength = db.Column(db.Integer, default=0)
    class_teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'))
    room_number = db.Column(db.String(20))
    schedule = db.Column(db.Text)  # JSON string for class schedule
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='active')  # active, inactive, completed
    
    # School relationship (multi-tenant)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    school = db.relationship('School', back_populates='classes')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    students = db.relationship('Student', back_populates='current_class', lazy='dynamic')
    subjects = db.relationship('Subject', backref='class_obj', cascade='all, delete-orphan')
    attendances = db.relationship('Attendance', backref='class_obj', cascade='all, delete-orphan')
    grades = db.relationship('Grade', backref='class_obj', cascade='all, delete-orphan')
    
    def __init__(self, **kwargs):
        super(Class, self).__init__(**kwargs)
        self.update_current_strength()
    
    def update_current_strength(self):
        """Update current class strength"""
        self.current_strength = self.students.count()
    
    def get_full_name(self):
        """Get full class name with section"""
        return f"{self.name}-{self.section}"
    
    def get_class_teacher_name(self):
        """Get class teacher's name"""
        return self.class_teacher.get_full_name() if self.class_teacher else "Not Assigned"
    
    def get_available_seats(self):
        """Get number of available seats"""
        return max(0, self.capacity - self.current_strength)
    
    def is_full(self):
        """Check if class is full"""
        return self.current_strength >= self.capacity
    
    def can_enroll_student(self):
        """Check if student can be enrolled"""
        return not self.is_full() and self.status == 'active'
    
    def get_subject_list(self):
        """Get list of subjects in this class"""
        return [subject.name for subject in self.subjects]
    
    def get_student_list(self):
        """Get list of students in this class"""
        return [student.to_dict() for student in self.students.all()]
    
    def get_attendance_summary(self, date=None):
        """Get attendance summary for the class"""
        from .attendance import Attendance
        
        query = Attendance.query.filter_by(class_id=self.id)
        if date:
            query = query.filter_by(date=date)
        
        total_students = self.current_strength
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
    
    def to_dict(self):
        """Convert class to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'section': self.section,
            'full_name': self.get_full_name(),
            'academic_year': self.academic_year,
            'capacity': self.capacity,
            'current_strength': self.current_strength,
            'available_seats': self.get_available_seats(),
            'class_teacher_id': self.class_teacher_id,
            'class_teacher_name': self.get_class_teacher_name(),
            'room_number': self.room_number,
            'schedule': self.schedule,
            'description': self.description,
            'status': self.status,
            'is_full': self.is_full(),
            'subjects': self.get_subject_list(),
            'attendance_summary': self.get_attendance_summary(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Class {self.get_full_name()}>'

