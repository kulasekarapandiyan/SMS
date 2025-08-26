# School Management Software (SMS)

A multi-tenant, role-based school management platform with a Python Flask backend and a React/TypeScript frontend.

## 🚀 Key Features

- **Multi-tenancy**: `School` model with `school_id` foreign keys across `User`, `Student`, `Teacher`, `Class`, `Subject`, `Attendance`, `Grade` for strict data isolation.
- **Role-Based Access Control (RBAC)**: Hierarchical roles with decorators on the backend and dynamic navigation on the frontend.
  - Roles: `super_admin`, `school_admin`, `principal`, `director`, `teacher`, `student`.
  - Super Admin manages all schools; School Admin manages only their school (no school creation).
- **Authentication**: JWT-based auth with hashed passwords (bcrypt) and protected routes.
- **Core Modules**: Students, Teachers, Classes, Subjects, Attendance, Grades.
- **Admin & School Management**: School CRUD (restricted), dashboards, and reports endpoints.
- **Modern UI**: React 18 + TypeScript + MUI with dashboard KPIs and chart placeholders.

## 🛠️ Tech Stack

- Backend: Flask, SQLAlchemy, Flask-Migrate, Flask-JWT-Extended, Flask-CORS, Flask-Bcrypt, Marshmallow, python-dotenv
- Frontend: React 18, TypeScript, Material-UI (MUI), React Router, Axios, React Query
- Databases: SQLite (dev), PostgreSQL/MySQL (prod)

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+
- npm (or yarn)

## 🚀 Quick Start

### 1) Clone
```bash
git clone <repository-url>
cd SMS
```

### 2) Backend (Flask)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Database migrations (uses app factory)
export FLASK_APP=run.py
flask db upgrade

# Optional: seed demo data (creates Demo School and users below)
python3 seed_data.py

# Run the API server
python3 run.py
```

### 3) Frontend (React)
```bash
cd frontend
npm install
npm start
```

### 4) Access
- Backend API: http://localhost:5000
- Frontend app: http://localhost:3000

## 🔐 Default Demo Credentials (after seeding)

- Super Admin: `superadmin@sms.com` / `superadmin123`
- School Admin: `schooladmin@school.com` / `schooladmin123`
- Principal: `principal@school.com` / `principal123`
- Director: `director@school.com` / `director123`
- Teacher: `teacher@school.com` / `teacher123`
- Student: `student@school.com` / `student123`

## 🧭 RBAC Overview

- Super Admin: manage all schools and users; can create/update/delete schools.
- School Admin: manage their school’s data and users; cannot create schools.
- Principal/Director: admin-level within their school; manage academics/users as permitted.
- Teacher: teacher-level access; can view/record attendance and grades for their classes.
- Student: student-level access to their own data.

Backend decorators in `app/decorators.py`:
- `@super_admin_required`
- `@school_admin_required` (admin-level within a school)
- `@admin_required` (any admin-level: school_admin/principal/director/super_admin)
- `@teacher_required`
- `@student_required`
- `@school_access_required` (ensures access to `school_id` in route)
- `@can_manage_school_required`
- `@can_manage_users_required`

## 🧩 API Highlights

- Auth: `POST /api/auth/login`, `GET /api/auth/profile`
- Admin Dashboard: `GET /api/admin/dashboard` (admin-level)
- Schools: `GET /api/schools`, `POST /api/schools` (super admin), `GET /api/schools/<int:school_id>`, `PUT /api/schools/<int:school_id>`, `DELETE /api/schools/<int:school_id>` (restricted)
- Reports (examples): `/api/admin/schools/<int:school_id>/reports/*` (role-guarded)

Planned: Resource routes for Students/Teachers/Classes/Subjects/Attendance/Grades (models are present; routes will follow with RBAC guards).

## 🗂️ Project Structure

```
SMS/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── decorators.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── school.py
│   │   │   ├── class_model.py
│   │   │   ├── student.py
│   │   │   ├── teacher.py
│   │   │   ├── subject.py
│   │   │   ├── attendance.py
│   │   │   └── grade.py
│   │   └── routes/
│   │       ├── auth.py
│   │       ├── admin.py
│   │       └── schools.py
│   ├── migrations/
│   ├── run.py
│   ├── seed_data.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       └── services/
└── README.md
```

## 🧪 Development Tips

- If a port is busy: `lsof -ti:5000 | xargs -r kill -9` (backend) or `lsof -ti:3000 | xargs -r kill -9` (frontend).
- Environment variables: place a `.env` file in `backend/` as needed (JWT settings, DB URL, etc.).
- SQLite dev DB is stored under `backend/instance/school_management.db` by default.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License

## 🆘 Support

Open an issue for bugs and feature requests.

