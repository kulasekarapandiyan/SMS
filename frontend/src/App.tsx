import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Students from './pages/Students/Students';
import StudentList from './pages/Students/StudentList';
import StudentDetails from './pages/Students/StudentDetails';
import AddStudent from './pages/Students/AddStudent';
import Teachers from './pages/Teachers/Teachers';
import TeacherList from './pages/Teachers/TeacherList';
import TeacherForm from './pages/Teachers/TeacherForm';
import Classes from './pages/Classes/Classes';
import Subjects from './pages/Subjects/Subjects';
import AddSubject from './pages/Subjects/AddSubject';
import SubjectDetails from './pages/Subjects/SubjectDetails';
import EditSubject from './pages/Subjects/EditSubject';
import Attendance from './pages/Attendance/Attendance';
import Grades from './pages/Grades/Grades';
import Profile from './pages/Profile/Profile';
import Admin from './pages/Admin/Admin';
import Schools from './pages/Schools/Schools';
import Fees from './pages/Fees/Fees';
import Income from './pages/Income/Income';
import AddIncome from './pages/Income/AddIncome';
// New placeholder pages to support left menu items
const Parents = () => <Box>Parents</Box>;
const Account = () => <Box>Account</Box>;
const Exam = () => <Box>Exam</Box>;
const Transport = () => <Box>Transport</Box>;
const Notice = () => <Box>Notice</Box>;
const SettingsPage = () => <Box>Settings</Box>;

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        Loading...
      </Box>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/students/:id" element={<StudentDetails />} />
        <Route path="/students/add" element={<AddStudent />} />
        {/* Teachers */}
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/teachers/add" element={<TeacherForm />} />
        <Route path="/teachers/:id" element={<Teachers />} />
        <Route path="/teachers/:id/edit" element={<TeacherForm />} />
        <Route path="/parents" element={<Parents />} />
        <Route path="/account" element={<Account />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/income" element={<Income />} />
        <Route path="/income/add" element={<AddIncome />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subjects/add" element={<AddSubject />} />
        <Route path="/subjects/:id" element={<SubjectDetails />} />
        <Route path="/subjects/:id/edit" element={<EditSubject />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<SettingsPage />} />
        {(user.role === 'super_admin' || user.role === 'school_admin' || user.role === 'principal' || user.role === 'director') && (
          <>
            <Route path="/admin" element={<Admin />} />
            {user.role === 'super_admin' && (
              <Route path="/schools" element={<Schools />} />
            )}
          </>
        )}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;

