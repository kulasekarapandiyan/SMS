from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app import db, bcrypt
from app.models import User, Student, Teacher
from app.models.user import UserRole
from datetime import datetime
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    return True, "Password is valid"

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'username', 'password', 'first_name', 'last_name', 'role']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password strength
        is_valid_password, password_message = validate_password(data['password'])
        if not is_valid_password:
            return jsonify({'error': password_message}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        if User.query.filter_by(username=data['email']).first():
            return jsonify({'error': 'Username already taken'}), 409
        
        # Normalize role to enum (accepts 'student' or 'STUDENT')
        role_value = data['role']
        if isinstance(role_value, str):
            try:
                role_enum = UserRole[role_value.upper()]
            except KeyError:
                return jsonify({'error': f"Invalid role '{role_value}'"}), 400
        elif isinstance(role_value, UserRole):
            role_enum = role_value
        else:
            return jsonify({'error': 'Invalid role type'}), 400

        # Create user
        user_data = {
            'email': data['email'],
            'username': data['username'],
            'password': data['password'],
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'role': role_enum,
            'phone': data.get('phone'),
            'address': data.get('address'),
            'date_of_birth': datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date() if data.get('date_of_birth') else None,
            'gender': data.get('gender')
        }

        # Optional multi-tenant context
        school_id = data.get('school_id')
        if school_id is not None:
            user_data['school_id'] = school_id
        
        user = User(**user_data)
        db.session.add(user)
        db.session.commit()
        
        # Create role-specific profile
        if role_enum == UserRole.STUDENT:
            # Ensure we have tenant context for student profile
            if school_id is None:
                return jsonify({'error': 'school_id is required for student registration'}), 400
            student_data = {
                'user_id': user.id,
                'admission_date': datetime.now().date(),
                'parent_name': data.get('parent_name'),
                'parent_phone': data.get('parent_phone'),
                'parent_email': data.get('parent_email'),
                'emergency_contact': data.get('emergency_contact'),
                'blood_group': data.get('blood_group'),
                'medical_conditions': data.get('medical_conditions'),
                'previous_school': data.get('previous_school'),
                'academic_year': str(datetime.now().year),
                'school_id': school_id
            }
            student = Student(**student_data)
            db.session.add(student)
            
        elif data['role'] == 'teacher':
            teacher_data = {
                'user_id': user.id,
                'hire_date': datetime.now().date(),
                'department': data.get('department'),
                'designation': data.get('designation'),
                'qualification': data.get('qualification'),
                'experience_years': data.get('experience_years'),
                'specialization': data.get('specialization'),
                'office_location': data.get('office_location'),
                'office_hours': data.get('office_hours')
            }
            teacher = Teacher(**teacher_data)
            db.session.add(teacher)
        
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user by email
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is deactivated'}), 403
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token endpoint"""
    try:
        current_user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user_id)
        
        return jsonify({
            'access_token': new_access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        allowed_fields = ['first_name', 'last_name', 'phone', 'address', 'gender']
        for field in allowed_fields:
            if field in data:
                setattr(user, field, data[field])
        
        # Update password if provided
        if data.get('password'):
            is_valid_password, password_message = validate_password(data['password'])
            if not is_valid_password:
                return jsonify({'error': password_message}), 400
            user.set_password(data['password'])
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """User logout endpoint (client should discard tokens)"""
    return jsonify({'message': 'Logout successful'}), 200

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        # Verify current password
        if not user.check_password(data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Validate new password
        is_valid_password, password_message = validate_password(data['new_password'])
        if not is_valid_password:
            return jsonify({'error': password_message}), 400
        
        # Set new password
        user.set_password(data['new_password'])
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


