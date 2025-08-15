from app import db
from datetime import datetime, date

class Attendance(db.Model):
    """Attendance model for tracking student attendance"""
    __tablename__ = 'attendance'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False, index=True)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False, index=True)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False, index=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False, index=True)
    date = db.Column(db.Date, nullable=False, index=True)
    status = db.Column(db.String(20), nullable=False, default='present')  # present, absent, late, excused
    time_in = db.Column(db.Time)
    time_out = db.Column(db.Time)
    remarks = db.Column(db.Text)
    
    # School relationship (multi-tenant)
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=False)
    school = db.relationship('School', backref='attendances')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Composite unique constraint
    __table_args__ = (
        db.UniqueConstraint('student_id', 'class_id', 'subject_id', 'date', name='unique_attendance'),
    )
    
    def __init__(self, **kwargs):
        super(Attendance, self).__init__(**kwargs)
        if not self.date:
            self.date = date.today()
    
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
    
    def is_present(self):
        """Check if student is present"""
        return self.status == 'present'
    
    def is_absent(self):
        """Check if student is absent"""
        return self.status == 'absent'
    
    def is_late(self):
        """Check if student is late"""
        return self.status == 'late'
    
    def is_excused(self):
        """Check if absence is excused"""
        return self.status == 'excused'
    
    def get_duration(self):
        """Get duration of attendance if time_in and time_out are set"""
        if self.time_in and self.time_out:
            from datetime import datetime, timedelta
            
            # Convert to datetime objects for calculation
            time_in_dt = datetime.combine(date.today(), self.time_in)
            time_out_dt = datetime.combine(date.today(), self.time_out)
            
            # Handle case where time_out is on next day
            if time_out_dt < time_in_dt:
                time_out_dt += timedelta(days=1)
            
            duration = time_out_dt - time_in_dt
            return str(duration).split('.')[0]  # Remove microseconds
        
        return None
    
    def get_status_color(self):
        """Get color code for attendance status"""
        status_colors = {
            'present': 'green',
            'absent': 'red',
            'late': 'orange',
            'excused': 'blue'
        }
        return status_colors.get(self.status, 'gray')
    
    def to_dict(self):
        """Convert attendance to dictionary"""
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
            'date': self.date.isoformat() if self.date else None,
            'status': self.status,
            'time_in': self.time_in.isoformat() if self.time_in else None,
            'time_out': self.time_out.isoformat() if self.time_out else None,
            'duration': self.get_duration(),
            'remarks': self.remarks,
            'is_present': self.is_present(),
            'is_absent': self.is_absent(),
            'is_late': self.is_late(),
            'is_excused': self.is_excused(),
            'status_color': self.get_status_color(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    @classmethod
    def get_attendance_summary(cls, class_id=None, subject_id=None, date=None, start_date=None, end_date=None):
        """Get attendance summary for given parameters"""
        query = cls.query
        
        if class_id:
            query = query.filter_by(class_id=class_id)
        if subject_id:
            query = query.filter_by(subject_id=subject_id)
        if date:
            query = query.filter_by(date=date)
        if start_date:
            query = query.filter(cls.date >= start_date)
        if end_date:
            query = query.filter(cls.date <= end_date)
        
        total_records = query.count()
        present_count = query.filter_by(status='present').count()
        absent_count = query.filter_by(status='absent').count()
        late_count = query.filter_by(status='late').count()
        excused_count = query.filter_by(status='excused').count()
        
        attendance_percentage = round((present_count / total_records * 100), 2) if total_records > 0 else 0
        
        return {
            'total_records': total_records,
            'present': present_count,
            'absent': absent_count,
            'late': late_count,
            'excused': excused_count,
            'attendance_percentage': attendance_percentage
        }
    
    def __repr__(self):
        return f'<Attendance {self.student_id} - {self.date} - {self.status}>'

