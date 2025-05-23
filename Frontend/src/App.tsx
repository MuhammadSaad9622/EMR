import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import DashboardLayout from './components/layouts/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import PatientList from './pages/patients/PatientList';
import PatientDetail from './pages/patients/PatientDetail';
import PatientForm from './pages/patients/PatientForm';
import Appointments from './pages/appointments/Appointments';
import VisitNotes from './pages/visits/VisitNotes';
import Billing from './pages/billing/Billing';
import LabReports from './pages/labs/LabReports';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" />;
}

// Public route wrapper (redirects to dashboard if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/signin"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="patients/new" element={<PatientForm />} />
        <Route path="patients/:id/edit" element={<PatientForm />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="visits/:id" element={<VisitNotes />} />
        <Route path="billing" element={<Billing />} />
        <Route path="lab-reports" element={<LabReports />} />
      </Route>
      <Route path="/appointments" element={<Navigate to="/dashboard/appointments" replace />} />
      <Route path="/patients" element={<Navigate to="/dashboard/patients" replace />} />
      <Route path="/patients/new" element={<Navigate to="/dashboard/patients/new" replace />} />
      <Route path="/" element={<Navigate to="/signin" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;