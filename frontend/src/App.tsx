import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Students from './pages/Students/Students';
import Teachers from './pages/Teachers/Teachers';
import Classes from './pages/Classes/Classes';
import Subjects from './pages/Subjects/Subjects';
import Attendance from './pages/Attendance/Attendance';
import Grades from './pages/Grades/Grades';
import Profile from './pages/Profile/Profile';
import Admin from './pages/Admin/Admin';
import Schools from './pages/Schools/Schools';

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
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/profile" element={<Profile />} />
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

