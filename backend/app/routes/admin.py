from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, School, Student, Teacher, Class, Subject, Attendance, Grade
from app.decorators import super_admin_required, admin_required, can_manage_school_required
from datetime import datetime

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@admin_required
def admin_dashboard():
    """Get admin dashboard statistics"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if current_user.is_super_admin():
        # Super admin sees all schools data
        schools = School.query.all()
        total_schools = len(schools)
        total_users = User.query.count()
        total_students = Student.query.count()
        total_teachers = Teacher.query.count()
        total_classes = Class.query.count()
        total_subjects = Subject.query.count()
        
        dashboard_data = {
            'total_schools': total_schools,
            'total_users': total_users,
            'total_students': total_students,
            'total_teachers': total_teachers,
            'total_classes': total_classes,
            'total_subjects': total_subjects,
            'schools': [school.to_dict() for school in schools]
        }
    else:
        # School admin/principal/director sees only their school data
        if not current_user.school_id:
            return jsonify({'success': False, 'message': 'User not assigned to any school'}), 404
        
        school = School.query.get(current_user.school_id)
        if not school:
            return jsonify({'success': False, 'message': 'School not found'}), 404
        
        dashboard_data = {
            'school': school.to_dict(),
            'statistics': school.get_statistics()
        }
    
    return jsonify({
        'success': True,
        'dashboard': dashboard_data
    }), 200

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_all_users():
    """Get all users (filtered by school for non-super admins)"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if current_user.is_super_admin():
        # Super admin sees all users
        users = User.query.all()
    else:
        # School admin/principal/director sees only their school users
        if not current_user.school_id:
            return jsonify({'success': False, 'message': 'User not assigned to any school'}), 404
        
        users = User.query.filter_by(school_id=current_user.school_id).all()
    
    return jsonify({
        'success': True,
        'users': [user.to_dict() for user in users]
    }), 200

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@can_manage_users_required
def update_user(user_id):
    """Update user details"""
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    try:
        # Update fields
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            user.email = data['email']
        if 'phone' in data:
            user.phone = data['phone']
        if 'address' in data:
            user.address = data['address']
        if 'is_active' in data:
            user.is_active = data['is_active']
        if 'role' in data:
            # Only super admin can change roles
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            if current_user.is_super_admin():
                user.role = data['role']
            else:
                return jsonify({'success': False, 'message': 'Only Super Admin can change user roles'}), 403
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@can_manage_users_required
def delete_user(user_id):
    """Delete a user"""
    user = User.query.get_or_404(user_id)
    
    try:
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@admin_bp.route('/schools/<int:school_id>/users', methods=['POST'])
@jwt_required()
@can_manage_school_required
def create_school_user(school_id):
    """Create a new user in a school"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    data = request.get_json()
    
    required_fields = ['email', 'username', 'password', 'first_name', 'last_name', 'role']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'message': f'{field} is required'}), 400
    
    # Check if user with same email/username already exists
    existing_user = User.query.filter(
        (User.email == data['email']) | (User.username == data['username'])
    ).first()
    if existing_user:
        return jsonify({'success': False, 'message': 'User with this email or username already exists'}), 400
    
    try:
        # Only super admin can create super admin users
        if data['role'] == 'super_admin' and not current_user.is_super_admin():
            return jsonify({'success': False, 'message': 'Only Super Admin can create Super Admin users'}), 403
        
        # School admin/principal/director can only create users in their school
        if not current_user.is_super_admin():
            data['school_id'] = school_id
        
        new_user = User(
            email=data['email'],
            username=data['username'],
            password=data['password'],
            role=data['role'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone'),
            address=data.get('address'),
            date_of_birth=data.get('date_of_birth'),
            gender=data.get('gender'),
            school_id=data.get('school_id', school_id),
            is_active=data.get('is_active', True),
            email_verified=data.get('email_verified', False)
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'user': new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@admin_bp.route('/system/health', methods=['GET'])
@jwt_required()
@super_admin_required
def system_health():
    """Get system health information (super admin only)"""
    try:
        # Database connection test
        db.session.execute('SELECT 1')
        
        # Get system statistics
        total_schools = School.query.count()
        total_users = User.query.count()
        total_students = Student.query.count()
        total_teachers = Teacher.query.count()
        
        health_data = {
            'status': 'healthy',
            'database': 'connected',
            'statistics': {
                'total_schools': total_schools,
                'total_users': total_users,
                'total_students': total_students,
                'total_teachers': total_teachers
            },
            'timestamp': datetime.utcnow().isoformat()
        }
        
        return jsonify({
            'success': True,
            'health': health_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'health': {
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
        }), 500

@admin_bp.route('/schools/<int:school_id>/reports/attendance', methods=['GET'])
@jwt_required()
@can_manage_school_required
def attendance_report(school_id):
    """Get attendance report for a school"""
    school = School.query.get_or_404(school_id)
    
    # Get attendance data for the school
    attendances = Attendance.query.filter_by(school_id=school_id).all()
    
    # Calculate statistics
    total_records = len(attendances)
    present_count = sum(1 for a in attendances if a.status == 'present')
    absent_count = sum(1 for a in attendances if a.status == 'absent')
    late_count = sum(1 for a in attendances if a.status == 'late')
    
    attendance_rate = (present_count / total_records * 100) if total_records > 0 else 0
    
    report_data = {
        'school_name': school.name,
        'total_records': total_records,
        'present_count': present_count,
        'absent_count': absent_count,
        'late_count': late_count,
        'attendance_rate': round(attendance_rate, 2),
        'period': 'All Time'
    }
    
    return jsonify({
        'success': True,
        'report': report_data
    }), 200

@admin_bp.route('/schools/<int:school_id>/reports/grades', methods=['GET'])
@jwt_required()
@can_manage_school_required
def grades_report(school_id):
    """Get grades report for a school"""
    school = School.query.get_or_404(school_id)
    
    # Get grades data for the school
    grades = Grade.query.filter_by(school_id=school_id).all()
    
    # Calculate statistics
    total_grades = len(grades)
    if total_grades > 0:
        avg_score = sum(float(g.score) for g in grades) / total_grades
        passing_grades = sum(1 for g in grades if g.is_passing())
        passing_rate = (passing_grades / total_grades) * 100
    else:
        avg_score = 0
        passing_rate = 0
    
    report_data = {
        'school_name': school.name,
        'total_grades': total_grades,
        'average_score': round(avg_score, 2),
        'passing_rate': round(passing_rate, 2),
        'period': 'All Time'
    }
    
    return jsonify({
        'success': True,
        'report': report_data
    }), 200

