from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import School, User
from app.decorators import super_admin_required, can_manage_school_required, school_access_required

schools_bp = Blueprint('schools', __name__, url_prefix='/api/schools')

@schools_bp.route('/', methods=['GET'])
@jwt_required()
def get_schools():
    """Get all schools (super admin) or current user's school"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    if current_user.is_super_admin():
        # Super admin can see all schools; use read replica when available
        read_session = None
        if current_app.read_session_factory:
            read_session = current_app.read_session_factory()
            schools = read_session.query(School).all()
            read_session.close()
        else:
            schools = School.query.all()
        return jsonify({
            'success': True,
            'schools': [school.to_dict() for school in schools]
        }), 200
    else:
        # Regular users can only see their school
        if not current_user.school_id:
            return jsonify({'success': False, 'message': 'User not assigned to any school'}), 404
        
        school = School.query.get(current_user.school_id)
        if not school:
            return jsonify({'success': False, 'message': 'School not found'}), 404
        
        return jsonify({
            'success': True,
            'school': school.to_dict()
        }), 200

@schools_bp.route('/<int:school_id>', methods=['GET'])
@jwt_required()
@school_access_required
def get_school(school_id):
    """Get specific school details"""
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # Prefer read replica
    if current_app.read_session_factory:
        rs = current_app.read_session_factory()
        school = rs.query(School).get(school_id)
        rs.close()
        if not school:
            return jsonify({'success': False, 'message': 'School not found'}), 404
    else:
        school = School.query.get_or_404(school_id)
    
    return jsonify({
        'success': True,
        'school': school.to_dict(),
        'statistics': school.get_statistics()
    }), 200

@schools_bp.route('/', methods=['POST'])
@super_admin_required
def create_school():
    """Create a new school (super admin only)"""
    data = request.get_json()
    
    required_fields = ['name', 'address', 'city', 'state', 'country']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'success': False, 'message': f'{field} is required'}), 400
    
    # Check if school with same name already exists
    existing_school = School.query.filter_by(name=data['name']).first()
    if existing_school:
        return jsonify({'success': False, 'message': 'School with this name already exists'}), 400
    
    try:
        school = School(
            name=data['name'],
            address=data['address'],
            city=data['city'],
            state=data['state'],
            country=data['country'],
            postal_code=data.get('postal_code'),
            phone=data.get('phone'),
            email=data.get('email'),
            website=data.get('website'),
            academic_year=data.get('academic_year', '2024-2025'),
            semester_system=data.get('semester_system', True),
            grading_system=data.get('grading_system', 'percentage'),
            attendance_system=data.get('attendance_system', 'daily'),
            primary_color=data.get('primary_color', '#1976d2'),
            secondary_color=data.get('secondary_color', '#dc004e'),
            max_students_per_class=data.get('max_students_per_class', 40),
            max_teachers_per_subject=data.get('max_teachers_per_subject', 3),
            enable_sms_notifications=data.get('enable_sms_notifications', False),
            enable_email_notifications=data.get('enable_email_notifications', True)
        )
        
        db.session.add(school)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'School created successfully',
            'school': school.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@schools_bp.route('/<int:school_id>', methods=['PUT'])
@jwt_required()
@can_manage_school_required
def update_school(school_id):
    """Update school details (super admin or school admin/principal/director)"""
    school = School.query.get_or_404(school_id)
    data = request.get_json()
    
    try:
        # Update fields
        if 'name' in data:
            school.name = data['name']
        if 'address' in data:
            school.address = data['address']
        if 'city' in data:
            school.city = data['city']
        if 'state' in data:
            school.state = data['state']
        if 'country' in data:
            school.country = data['country']
        if 'postal_code' in data:
            school.postal_code = data['postal_code']
        if 'phone' in data:
            school.phone = data['phone']
        if 'email' in data:
            school.email = data['email']
        if 'website' in data:
            school.website = data['website']
        if 'academic_year' in data:
            school.academic_year = data['academic_year']
        if 'semester_system' in data:
            school.semester_system = data['semester_system']
        if 'grading_system' in data:
            school.grading_system = data['grading_system']
        if 'attendance_system' in data:
            school.attendance_system = data['attendance_system']
        if 'primary_color' in data:
            school.primary_color = data['primary_color']
        if 'secondary_color' in data:
            school.secondary_color = data['secondary_color']
        if 'max_students_per_class' in data:
            school.max_students_per_class = data['max_students_per_class']
        if 'max_teachers_per_subject' in data:
            school.max_teachers_per_subject = data['max_teachers_per_subject']
        if 'enable_sms_notifications' in data:
            school.enable_sms_notifications = data['enable_sms_notifications']
        if 'enable_email_notifications' in data:
            school.enable_email_notifications = data['enable_email_notifications']
        if 'is_active' in data:
            school.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'School updated successfully',
            'school': school.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@schools_bp.route('/<int:school_id>', methods=['DELETE'])
@super_admin_required
def delete_school(school_id):
    """Delete a school (super admin only)"""
    school = School.query.get_or_404(school_id)
    
    # Check if school has any users
    if school.users.count() > 0:
        return jsonify({
            'success': False, 
            'message': 'Cannot delete school with existing users. Please transfer or delete users first.'
        }), 400
    
    try:
        db.session.delete(school)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'School deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@schools_bp.route('/<int:school_id>/statistics', methods=['GET'])
@jwt_required()
@school_access_required
def get_school_statistics(school_id):
    """Get school statistics"""
    school = School.query.get_or_404(school_id)
    
    return jsonify({
        'success': True,
        'statistics': school.get_statistics()
    }), 200

@schools_bp.route('/<int:school_id>/config', methods=['GET'])
@jwt_required()
@school_access_required
def get_school_config(school_id):
    """Get school configuration for frontend"""
    school = School.query.get_or_404(school_id)
    
    config = {
        'school_name': school.name,
        'school_code': school.code,
        'academic_year': school.academic_year,
        'semester_system': school.semester_system,
        'grading_system': school.grading_system,
        'attendance_system': school.attendance_system,
        'branding': {
            'logo_url': school.logo_url,
            'primary_color': school.primary_color,
            'secondary_color': school.secondary_color
        },
        'limits': {
            'max_students_per_class': school.max_students_per_class,
            'max_teachers_per_subject': school.max_teachers_per_subject
        },
        'notifications': {
            'sms_enabled': school.enable_sms_notifications,
            'email_enabled': school.enable_email_notifications
        }
    }
    
    return jsonify({
        'success': True,
        'config': config
    }), 200
