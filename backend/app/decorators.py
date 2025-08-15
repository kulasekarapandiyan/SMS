from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app.models import User

def super_admin_required(f):
    """Decorator to require super admin role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user or not current_user.is_super_admin():
            return jsonify({'success': False, 'message': 'Super Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def school_admin_required(f):
    """Decorator to require school admin or higher role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user or not current_user.is_admin_level():
            return jsonify({'success': False, 'message': 'School Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Decorator to require any admin-level role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user or not current_user.is_admin_level():
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def teacher_required(f):
    """Decorator to require teacher or higher role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user or not (current_user.is_teacher() or current_user.is_admin_level()):
            return jsonify({'success': False, 'message': 'Teacher access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def student_required(f):
    """Decorator to require student or higher role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user or not (current_user.is_student() or current_user.is_teacher() or current_user.is_admin_level()):
            return jsonify({'success': False, 'message': 'Student access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

def school_access_required(f):
    """Decorator to ensure user has access to the school"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401
        
        # Super admin can access any school
        if current_user.is_super_admin():
            return f(*args, **kwargs)
        
        # Check if school_id is in kwargs
        school_id = kwargs.get('school_id')
        if not school_id:
            return jsonify({'success': False, 'message': 'School ID required'}), 400
        
        # Check if user belongs to the school
        if current_user.school_id != school_id:
            return jsonify({'success': False, 'message': 'Access denied to this school'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

def can_manage_school_required(f):
    """Decorator to ensure user can manage the school"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401
        
        # Super admin can manage any school
        if current_user.is_super_admin():
            return f(*args, **kwargs)
        
        # Check if school_id is in kwargs
        school_id = kwargs.get('school_id')
        if not school_id:
            return jsonify({'success': False, 'message': 'School ID required'}), 400
        
        # Check if user can manage this school
        if not current_user.can_manage_school(school_id):
            return jsonify({'success': False, 'message': 'Access denied to manage this school'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

def can_manage_users_required(f):
    """Decorator to ensure user can manage other users"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user:
            return jsonify({'success': False, 'message': 'Authentication required'}), 401
        
        # Super admin can manage any user
        if current_user.is_super_admin():
            return f(*args, **kwargs)
        
        # Check if target_user_id is in kwargs
        target_user_id = kwargs.get('user_id')
        if not target_user_id:
            return jsonify({'success': False, 'message': 'User ID required'}), 400
        
        # Get target user
        from app.models import User
        target_user = User.query.get(target_user_id)
        if not target_user:
            return jsonify({'success': False, 'message': 'Target user not found'}), 404
        
        # Check if user can manage target user
        if not current_user.can_manage_users(target_user):
            return jsonify({'success': False, 'message': 'Access denied to manage this user'}), 403
        
        return f(*args, **kwargs)
    return decorated_function
