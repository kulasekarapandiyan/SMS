#!/bin/bash

echo "🚀 Setting up School Management Software..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Create virtual environment for Python
echo "🐍 Setting up Python virtual environment..."
cd backend
python3 -m venv venv

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # macOS/Linux
    source venv/bin/activate
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Initialize database
echo "🗄️ Initializing database..."
export FLASK_APP=run.py
export FLASK_ENV=development
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

echo "✅ Backend setup completed!"

# Setup frontend
echo "⚛️ Setting up React frontend..."
cd ../frontend

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup completed!"

# Create .env file for backend
echo "🔧 Creating environment configuration..."
cd ../backend
cat > .env << EOF
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production
DATABASE_URL=sqlite:///school_management.db
EOF

echo "✅ Environment configuration created!"

# Instructions
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To run the application:"
echo ""
echo "1. Start the backend server:"
echo "   cd backend"
echo "   source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "   python run.py"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
echo "Default credentials:"
echo "   Admin: admin@school.com / admin123"
echo "   Teacher: teacher@school.com / teacher123"
echo "   Student: student@school.com / student123"
echo ""
echo "Happy coding! 🚀"


