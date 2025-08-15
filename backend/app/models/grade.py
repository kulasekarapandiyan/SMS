from app import db
from datetime import datetime

class Grade(db.Model):
    """Grade model for managing student grades and academic performance"""
    __tablename__ = 'grades'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False, index=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False, index=True)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False, index=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False, index=True)
    assignment_name = db.Column(db.String(200), nullable=False)
    assignment_type = db.Column(db.String(50), nullable=False)  # quiz, test, exam, project, homework
    score = db.Column(db.Numeric(5, 2), nullable=False)  # Score out of 100
    max_score = db.Column(db.Numeric(5, 2), nullable=False, default=100)
    percentage = db.Column(db.Numeric(5, 2))  # Calculated percentage
    letter_grade = db.Column(db.String(5))  # A, B, C, D, F
    remarks = db.Column(db.Text)
    date_assigned = db.Column(db.Date, nullable=False, default=datetime.utcnow().date())
    due_date = db.Column(db.Date)
    submitted_date = db.Column(db.Date)
    status = db.Column(db.String(20), default='graded')  # pending, graded, late, excused
    
    # School relationship (multi-tenant)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    school = db.relationship('School', backref='grades')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __init__(self, **kwargs):
        super(Grade, self).__init__(**kwargs)
        self.calculate_percentage()
        self.assign_letter_grade()
    
    def calculate_percentage(self):
        """Calculate percentage score"""
        if self.score and self.max_score:
            self.percentage = round((self.score / self.max_score) * 100, 2)
    
    def assign_letter_grade(self):
        """Assign letter grade based on percentage"""
        if not self.percentage:
            return
        
        if self.percentage >= 90:
            self.letter_grade = 'A'
        elif self.percentage >= 80:
            self.letter_grade = 'B'
        elif self.percentage >= 70:
            self.letter_grade = 'C'
        elif self.percentage >= 60:
            self.letter_grade = 'D'
        else:
            self.letter_grade = 'F'
    
    def get_student_name(self):
        """Get student name"""
        return self.student.get_full_name() if self.student else "Unknown"
    
    def get_class_name(self):
        """Get class name"""
        return self.class_obj.get_full_name() if self.class_obj else "Unknown"
    
    def get_subject_name(self):
        """Get subject name"""
        return self.subject.name if self.subject else "Unknown"
    
    def get_teacher_name(self):
        """Get teacher name"""
        return self.teacher.get_full_name() if self.teacher else "Unknown"
    
    def get_grade_point(self):
        """Get grade point (4.0 scale)"""
        grade_points = {
            'A': 4.0,
            'B': 3.0,
            'C': 2.0,
            'D': 1.0,
            'F': 0.0
        }
        return grade_points.get(self.letter_grade, 0.0)
    
    def is_passing(self):
        """Check if grade is passing (D or above)"""
        return self.letter_grade != 'F'
    
    def is_excellent(self):
        """Check if grade is excellent (A)"""
        return self.letter_grade == 'A'
    
    def is_late(self):
        """Check if assignment was submitted late"""
        if self.due_date and self.submitted_date:
            return self.submitted_date > self.due_date
        return False
    
    def get_performance_level(self):
        """Get performance level description"""
        if self.percentage >= 90:
            return "Excellent"
        elif self.percentage >= 80:
            return "Good"
        elif self.percentage >= 70:
            return "Satisfactory"
        elif self.percentage >= 60:
            return "Needs Improvement"
        else:
            return "Failing"
    
    def get_grade_color(self):
        """Get color code for grade display"""
        grade_colors = {
            'A': 'green',
            'B': 'blue',
            'C': 'orange',
            'D': 'yellow',
            'F': 'red'
        }
        return grade_colors.get(self.letter_grade, 'gray')
    
    def to_dict(self):
        """Convert grade to dictionary"""
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student_name': self.get_student_name(),
            'class_id': self.class_id,
            'class_name': self.get_class_name(),
            'subject_id': self.subject_id,
            'subject_name': self.get_subject_name(),
            'teacher_id': self.teacher_id,
            'teacher_name': self.get_teacher_name(),
            'assignment_name': self.assignment_name,
            'assignment_type': self.assignment_type,
            'score': float(self.score) if self.score else None,
            'max_score': float(self.max_score) if self.max_score else None,
            'percentage': float(self.percentage) if self.percentage else None,
            'letter_grade': self.letter_grade,
            'grade_point': self.get_grade_point(),
            'remarks': self.remarks,
            'date_assigned': self.date_assigned.isoformat() if self.date_assigned else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'submitted_date': self.submitted_date.isoformat() if self.submitted_date else None,
            'status': self.status,
            'is_passing': self.is_passing(),
            'is_excellent': self.is_excellent(),
            'is_late': self.is_late(),
            'performance_level': self.get_performance_level(),
            'grade_color': self.get_grade_color(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    @classmethod
    def get_class_average(cls, class_id, subject_id=None):
        """Get class average grade"""
        query = cls.query.filter_by(class_id=class_id)
        if subject_id:
            query = query.filter_by(subject_id=subject_id)
        
        grades = query.all()
        if not grades:
            return 0
        
        total_percentage = sum(grade.percentage for grade in grades if grade.percentage)
        return round(total_percentage / len(grades), 2)
    
    @classmethod
    def get_student_average(cls, student_id, subject_id=None):
        """Get student average grade"""
        query = cls.query.filter_by(student_id=student_id)
        if subject_id:
            query = query.filter_by(subject_id=subject_id)
        
        grades = query.all()
        if not grades:
            return 0
        
        total_percentage = sum(grade.percentage for grade in grades if grade.percentage)
        return round(total_percentage / len(grades), 2)
    
    def __repr__(self):
        return f'<Grade {self.student_id} - {self.assignment_name} - {self.letter_grade}>'

