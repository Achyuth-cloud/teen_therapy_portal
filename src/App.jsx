import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentDashboard from './components/Student/StudentDashboard';
import TherapistDashboard from './components/Therapist/TherapistDashboard';
import BookAppointment from './components/Student/BookAppointment';
import MyAppointments from './components/Student/MyAppointments';
import WellbeingQuestionnaire from './components/Student/WellbeingQuestionnaire';
import Resources from './components/Student/Resources';
import SessionHistory from './components/Student/SessionHistory';
import AppointmentRequests from './components/Therapist/AppointmentRequests';
import AvailabilityManager from './components/Therapist/AvailabilityManager';
import StudentResponses from './components/Therapist/StudentResponses';
import SessionNotes from './components/Therapist/SessionNotes';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/book" element={<BookAppointment />} />
          <Route path="/student/appointments" element={<MyAppointments />} />
          <Route path="/student/questionnaire" element={<WellbeingQuestionnaire />} />
          <Route path="/student/resources" element={<Resources />} />
          <Route path="/student/history" element={<SessionHistory />} />
          
          {/* Therapist Routes */}
          <Route path="/therapist" element={<TherapistDashboard />} />
          <Route path="/therapist/requests" element={<AppointmentRequests />} />
          <Route path="/therapist/availability" element={<AvailabilityManager />} />
          <Route path="/therapist/responses" element={<StudentResponses />} />
          <Route path="/therapist/notes/:appointmentId" element={<SessionNotes />} />
        </Route>
      </Route>
      
      <Route path="/" element={<Navigate to={user?.role === 'student' ? '/student' : user?.role === 'therapist' ? '/therapist' : '/login'} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
