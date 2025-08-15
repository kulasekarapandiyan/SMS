#!/usr/bin/env python3
"""
Data seeding script for School Management Software
Creates initial users, classes, and sample data
"""

import sys
import os
from datetime import datetime, date
from flask_bcrypt import generate_password_hash as bcrypt_generate

# Add the parent directory to the path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models import User, Student, Teacher, Class, Subject, Attendance, Grade, School
from app.models.user import UserRole
from flask_bcrypt import generate_password_hash as bcrypt_generate
from datetime import datetime, date
import random

def seed_data():
    """Seed the database with initial data"""
    print("🌱 Starting data seeding...")
    
    # Clear existing data
    print("🗑️ Clearing existing data...")
    db.drop_all()
    db.create_all()
    
    # Create a default school
    print("🏫 Creating default school...")
    default_school = School(
        name="Demo School",
        code="DEMO01",
        address="123 Education Street",
        city="Demo City",
        state="Demo State",
        country="Demo Country",
        postal_code="12345",
        phone="+1-234-567-8900",
        email="info@demoschool.com",
        website="https://demoschool.com",
        academic_year="2024-2025",
        semester_system=True,
        grading_system="percentage",
        attendance_system="daily",
        primary_color="#1976d2",
        secondary_color="#dc004e",
        max_students_per_class=40,
        max_teachers_per_subject=3,
        enable_sms_notifications=False,
        enable_email_notifications=True
    )
    db.session.add(default_school)
    db.session.commit()
    
    # Create super admin user (no school assigned)
    print("👑 Creating super admin user...")
    super_admin_user = User(
        email='superadmin@sms.com',
        username='superadmin',
        password_hash=bcrypt_generate('superadmin123').decode('utf-8'),
        role=UserRole.SUPER_ADMIN,
        first_name='Super',
        last_name='Admin',
        phone='+1234567890',
        address='123 Admin Street, City, State',
        date_of_birth=date(1980, 1, 1),
        gender='Other',
        school_id=None,  # Super admin not tied to any school
        is_active=True,
        email_verified=True
    )
    db.session.add(super_admin_user)
    
    # Create school admin user
    print("👨‍💼 Creating school admin user...")
    school_admin_user = User(
        email='schooladmin@school.com',
        username='schooladmin',
        password_hash=bcrypt_generate('schooladmin123').decode('utf-8'),
        role=UserRole.SCHOOL_ADMIN,
        first_name='School',
        last_name='Admin',
        phone='+1234567891',
        address='456 Admin Street, City, State',
        date_of_birth=date(1982, 3, 15),
        gender='Male',
        school_id=default_school.id,
        is_active=True,
        email_verified=True
    )
    db.session.add(school_admin_user)
    
    # Create principal user
    print("👨‍🏫 Creating principal user...")
    principal_user = User(
        email='principal@school.com',
        username='principal',
        password_hash=bcrypt_generate('principal123').decode('utf-8'),
        role=UserRole.PRINCIPAL,
        first_name='John',
        last_name='Principal',
        phone='+1234567892',
        address='789 Principal Street, City, State',
        date_of_birth=date(1975, 6, 20),
        gender='Male',
        school_id=default_school.id,
        is_active=True,
        email_verified=True
    )
    db.session.add(principal_user)
    
    # Create director user
    print("👨‍💼 Creating director user...")
    director_user = User(
        email='director@school.com',
        username='director',
        password_hash=bcrypt_generate('director123').decode('utf-8'),
        role=UserRole.DIRECTOR,
        first_name='Jane',
        last_name='Director',
        phone='+1234567893',
        address='321 Director Street, City, State',
        date_of_birth=date(1978, 9, 10),
        gender='Female',
        school_id=default_school.id,
        is_active=True,
        email_verified=True
    )
    db.session.add(director_user)
    
    # Create teacher user
    print("👨‍🏫 Creating teacher user...")
    teacher_user = User(
        email='teacher@school.com',
        username='teacher',
        password_hash=bcrypt_generate('teacher123').decode('utf-8'),
        role=UserRole.TEACHER,
        first_name='Mike',
        last_name='Teacher',
        phone='+1234567894',
        address='654 Teacher Street, City, State',
        date_of_birth=date(1985, 5, 15),
        gender='Male',
        school_id=default_school.id,
        is_active=True,
        email_verified=True
    )
    db.session.add(teacher_user)
    
    # Create student user
    print("👨‍🎓 Creating student user...")
    student_user = User(
        email='student@school.com',
        username='student',
        password_hash=bcrypt_generate('student123').decode('utf-8'),
        role=UserRole.STUDENT,
        first_name='Alice',
        last_name='Student',
        phone='+1234567895',
        address='987 Student Street, City, State',
        date_of_birth=date(2010, 8, 20),
        gender='Female',
        school_id=default_school.id,
        is_active=True,
        email_verified=True
    )
    db.session.add(student_user)
    
    db.session.commit()
    
    # Create teacher profile
    teacher = Teacher(
        user_id=teacher_user.id,
        department='Mathematics',
        designation='Senior Teacher',
        qualification='M.Sc. Mathematics',
        experience_years=5,
        hire_date=date(2020, 1, 15),
        salary=50000,
        specialization='Advanced Mathematics',
        office_location='Room 201',
        office_hours='9:00 AM - 4:00 PM',
        school_id=default_school.id
    )
    db.session.add(teacher)
    
    # Create student profile
    student = Student(
        user_id=student_user.id,
        admission_date=date(2023, 6, 1),
        parent_name='Robert Student',
        parent_phone='+1234567896',
        parent_email='parent@email.com',
        emergency_contact='+1234567897',
        blood_group='O+',
        school_id=default_school.id
    )
    db.session.add(student)
    
    db.session.commit()
    
    # Create classes
    print("🏫 Creating classes...")
    class_10a = Class(
        name='10',
        section='A',
        academic_year='2024-2025',
        capacity=35,
        class_teacher_id=teacher.id,
        room_number='101',
        description='Class 10 Section A',
        school_id=default_school.id
    )
    db.session.add(class_10a)
    
    class_9b = Class(
        name='9',
        section='B',
        academic_year='2024-2025',
        capacity=30,
        room_number='102',
        description='Class 9 Section B',
        school_id=default_school.id
    )
    db.session.add(class_9b)
    
    db.session.commit()
    
    # Assign student to class
    student.current_class_id = class_10a.id
    db.session.commit()
    
    # Create subjects
    print("📚 Creating subjects...")
    math_subject = Subject(
        name='Mathematics',
        code='MATH101',
        description='Advanced Mathematics',
        class_id=class_10a.id,
        teacher_id=teacher.id,
        credits=5,
        hours_per_week=6,
        syllabus='Algebra, Geometry, Trigonometry',
        books='Mathematics Textbook Class 10',
        school_id=default_school.id
    )
    db.session.add(math_subject)
    
    science_subject = Subject(
        name='Science',
        code='SCI101',
        description='General Science',
        class_id=class_10a.id,
        teacher_id=teacher.id,
        credits=4,
        hours_per_week=5,
        syllabus='Physics, Chemistry, Biology',
        books='Science Textbook Class 10',
        school_id=default_school.id
    )
    db.session.add(science_subject)
    
    db.session.commit()
    
    # Create sample attendance records
    print("📝 Creating sample attendance records...")
    today = date.today()
    
    # Math attendance
    math_attendance = Attendance(
        student_id=student.id,
        class_id=class_10a.id,
        subject_id=math_subject.id,
        teacher_id=teacher.id,
        date=today,
        status='present',
        remarks='Good participation',
        school_id=default_school.id
    )
    db.session.add(math_attendance)
    
    # Science attendance
    science_attendance = Attendance(
        student_id=student.id,
        class_id=class_10a.id,
        subject_id=science_subject.id,
        teacher_id=teacher.id,
        date=today,
        status='present',
        remarks='Active in class',
        school_id=default_school.id
    )
    db.session.add(science_attendance)
    
    db.session.commit()
    
    # Create sample grades
    print("📊 Creating sample grades...")
    math_grade = Grade(
        student_id=student.id,
        class_id=class_10a.id,
        subject_id=math_subject.id,
        teacher_id=teacher.id,
        assignment_name='Mid Term Exam',
        assignment_type='exam',
        score=85,
        max_score=100,
        remarks='Excellent work',
        date_assigned=today,
        school_id=default_school.id
    )
    db.session.add(math_grade)
    
    science_grade = Grade(
        student_id=student.id,
        class_id=class_10a.id,
        subject_id=science_subject.id,
        teacher_id=teacher.id,
        assignment_name='Mid Term Exam',
        assignment_type='exam',
        score=92,
        max_score=100,
        remarks='Outstanding performance',
        date_assigned=today,
        school_id=default_school.id
    )
    db.session.add(science_grade)
    
    db.session.commit()
    
    print("✅ Data seeding completed successfully!")
    
    # Print summary
    print("\n📋 Created data summary:")
    print(f"   - Schools: {School.query.count()}")
    print(f"   - Users: {User.query.count()}")
    print(f"   - Students: {Student.query.count()}")
    print(f"   - Teachers: {Teacher.query.count()}")
    print(f"   - Classes: {Class.query.count()}")
    print(f"   - Subjects: {Subject.query.count()}")
    print(f"   - Attendance records: {Attendance.query.count()}")
    print(f"   - Grades: {Grade.query.count()}")
    
    print("\n🔑 Default login credentials:")
    print("   Super Admin: superadmin@sms.com / superadmin123")
    print("   School Admin: schooladmin@school.com / schooladmin123")
    print("   Principal: principal@school.com / principal123")
    print("   Director: director@school.com / director123")
    print("   Teacher: teacher@school.com / teacher123")
    print("   Student: student@school.com / student123")
    
    print(f"\n🏫 School Details:")
    print(f"   Name: {default_school.name}")
    print(f"   Code: {default_school.code}")
    print(f"   Address: {default_school.address}")
    
    print(f"\n👥 Role Hierarchy:")
    print(f"   Super Admin: {super_admin_user.get_full_name()} (No school assigned)")
    print(f"   School Admin: {school_admin_user.get_full_name()} (School: {default_school.name})")
    print(f"   Principal: {principal_user.get_full_name()} (School: {default_school.name})")
    print(f"   Director: {director_user.get_full_name()} (School: {default_school.name})")
    print(f"   Teacher: {teacher_user.get_full_name()} (School: {default_school.name})")
    print(f"   Student: {student_user.get_full_name()} (School: {default_school.name})")

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        seed_data()

