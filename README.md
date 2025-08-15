# School Management Software (SMS)

A comprehensive web-based school management system built with modern technologies to streamline administrative tasks, student management, and academic operations.

## 🚀 Features

### Core Modules
- **Student Management**: Registration, profiles, enrollment, attendance tracking
- **Teacher Management**: Staff profiles, subject assignments, schedules
- **Class Management**: Course creation, class assignments, capacity management
- **Attendance System**: Daily attendance tracking with reports
- **Grade Management**: Assignment grades, report cards, academic progress
- **Timetable Management**: Class schedules, room assignments
- **User Authentication**: Role-based access control (Admin, Teacher, Student)

### Technical Features
- **Responsive Web Interface**: Modern UI built with React and TypeScript
- **RESTful API**: Flask backend with comprehensive endpoints
- **Database Management**: SQLAlchemy ORM with SQLite/PostgreSQL support
- **Security**: JWT authentication, password hashing, role-based permissions
- **Real-time Updates**: WebSocket support for live notifications

## 🛠️ Tech Stack

### Backend
- **Python 3.8+**
- **Flask**: Web framework
- **SQLAlchemy**: ORM and database management
- **Flask-JWT-Extended**: Authentication
- **Flask-CORS**: Cross-origin resource sharing
- **Flask-Migrate**: Database migrations

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Material-UI**: Component library
- **React Router**: Navigation
- **Axios**: HTTP client
- **React Query**: Data fetching and caching

### Database
- **SQLite**: Development database
- **PostgreSQL**: Production database (optional)

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd SMS
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
flask db init
flask db migrate
flask db upgrade

# Run backend server
flask run
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Access the Application
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

## 📁 Project Structure

```
SMS/
├── backend/                 # Flask backend
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── migrations/         # Database migrations
│   ├── requirements.txt    # Python dependencies
│   └── run.py             # Application entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Helper functions
│   ├── package.json        # Node dependencies
│   └── tsconfig.json       # TypeScript configuration
├── docs/                   # Documentation
└── README.md              # This file
```

## 🔐 Default Credentials

- **Admin**: admin@school.com / admin123
- **Teacher**: teacher@school.com / teacher123
- **Student**: student@school.com / student123

## 📚 API Documentation

The API documentation is available at `/api/docs` when running the backend server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.


