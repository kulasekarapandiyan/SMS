from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import asc, desc
from app import db
from app.models import Student, User

students_bp = Blueprint('students', __name__)

def cache_key(prefix, school_id, **params):
    items = "&".join(f"{k}={v}" for k, v in sorted(params.items()))
    return f"{prefix}:s:{school_id}:{items}"

def set_tenant_in_db(school_id):
    try:
        db.session.execute(db.text("SELECT set_config('app.school_id', :sid, true)"), {"sid": str(school_id)})
    except Exception:
        pass

@students_bp.route('/', methods=['GET'])
@jwt_required()
def list_students():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    if not user.school_id and not user.is_super_admin():
        return jsonify({"success": False, "message": "No school assigned"}), 400

    school_id = request.args.get('school_id', type=int) if user.is_super_admin() else user.school_id
    q = request.args.get('q', '', type=str)
    class_id = request.args.get('class_id', type=int)
    limit = min(request.args.get('limit', 25, type=int), 100)
    after_id = request.args.get('after_id', type=int)

    r = getattr(current_app, 'cache', None)
    ck = cache_key('students:list', school_id, q=q, class_id=class_id, limit=limit, after_id=after_id)
    if r:
        cached = r.get(ck)
        if cached:
            return jsonify(eval(cached))

    # Use read replica for read-only path when available
    read_session = None
    if current_app.read_session_factory:
        read_session = current_app.read_session_factory()
        # Manual query via Core/ORM session
        set_tenant_in_db(school_id)
        query = read_session.query(Student).filter_by(school_id=school_id)
    else:
        set_tenant_in_db(school_id)
        query = Student.query.filter_by(school_id=school_id)
    if class_id:
        query = query.filter_by(current_class_id=class_id)
    if q:
        like = f"%{q}%"
        query = query.join(User, Student.user_id == User.id).filter(
            db.or_(User.first_name.ilike(like), User.last_name.ilike(like))
        )
    if after_id:
        query = query.filter(Student.id > after_id)

    query = query.order_by(asc(Student.id)).limit(limit + 1)
    rows = query.all()
    if read_session:
        read_session.close()
    has_more = len(rows) > limit
    rows = rows[:limit]
    payload = {
        "success": True,
        "items": [s.to_dict() for s in rows],
        "next_after_id": rows[-1].id if has_more else None
    }
    if r:
        r.setex(ck, 30, str(payload))
    return jsonify(payload)

@students_bp.route('/', methods=['POST'])
@jwt_required()
def create_student():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    school_id = user.school_id
    if user.is_super_admin():
        school_id = request.json.get('school_id', school_id)
    if not school_id:
        return jsonify({"success": False, "message": "school_id required"}), 400

    data = request.get_json() or {}
    required = ['user_id', 'admission_date']
    for f in required:
        if not data.get(f):
            return jsonify({"success": False, "message": f"{f} is required"}), 400

    try:
        student = Student(
            user_id=data['user_id'],
            admission_date=data['admission_date'],
            current_class_id=data.get('current_class_id'),
            parent_name=data.get('parent_name'),
            parent_phone=data.get('parent_phone'),
            parent_email=data.get('parent_email'),
            emergency_contact=data.get('emergency_contact'),
            blood_group=data.get('blood_group'),
            medical_conditions=data.get('medical_conditions'),
            previous_school=data.get('previous_school'),
            academic_year=data.get('academic_year'),
            status=data.get('status', 'active'),
            school_id=school_id,
        )
        db.session.add(student)
        db.session.commit()

        # Invalidate cached lists for this school
        r = getattr(current_app, 'cache', None)
        if r:
            for key in r.scan_iter(match=f"students:list:s:{school_id}:*"):
                r.delete(key)

        return jsonify({"success": True, "student": student.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

@students_bp.route('/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student(student_id):
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    s = Student.query.get_or_404(student_id)
    if not user.is_super_admin() and s.school_id != user.school_id:
        return jsonify({"success": False, "message": "Forbidden"}), 403
    return jsonify({"success": True, "student": s.to_dict()})


