import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword';
import EnterOTP from './pages/Auth/ForgotPassword/EnterOTP';
import ResetPassword from './pages/Auth/ForgotPassword/ResetPassword';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import OpenAccount from './pages/Savings/OpenAccount';
import Deposit from './pages/Savings/Deposit';
import Withdraw from './pages/Savings/Withdraw';
import SearchAccounts from './pages/Search/SearchAccounts';
import DailyReport from './pages/Reports/DailyReport';
import MonthlyReport from './pages/Reports/MonthlyReport';
import RegulationSettings from './pages/Regulations/RegulationSettings';
import UserManagement from './pages/Users/UserManagement';
import UserProfile from './pages/Profile/UserProfile';
import NotFound from './pages/Errors/NotFound';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();

  // Nếu chưa có user (vừa mount) thì tạm cho về dashboard,
  // ProtectedRoute sẽ tự chặn nếu chưa đăng nhập
  if (!user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/regulations" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        {/* Forgot Password Flow (Public) */}
        <Route path="/forgot-password" element={<ForgotPasswordRoute />} />
        <Route path="/forgot-password/otp" element={<EnterOTPRoute />} />
        <Route path="/forgot-password/reset" element={<ResetPasswordRoute />} />
        
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeRedirect />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Savings Routes */}
          <Route path="savings">
            <Route path="open" element={<OpenAccount />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdraw" element={<Withdraw />} />
          </Route>
          
          {/* Search Route */}
          <Route path="search" element={<SearchAccounts />} />
          
          {/* Reports Routes */}
          <Route path="reports">
            <Route path="daily" element={<DailyReport />} />
            <Route path="monthly" element={<MonthlyReport />} />
          </Route>
          
          {/* Regulations Route */}
          <Route path="regulations" element={<RegulationSettings />} />
          
          {/* Users Route */}
          <Route path="users" element={<UserManagement />} />
          
          {/* Profile Route */}
          <Route path="profile" element={<UserProfile />} />

          {/* 🔥 404 cho các đường dẫn sai nhưng vẫn nằm trong Layout */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Catch all ngoài Layout → đưa về login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Route wrappers to wire navigation + guard state
function ForgotPasswordRoute() {
  const navigate = useNavigate();
  return (
    <ForgotPassword
      onContinue={(email) => navigate('/forgot-password/otp', { state: { email } })}
      onBack={() => navigate('/login')}
    />
  );
}

function EnterOTPRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  if (!email) return <Navigate to="/forgot-password" replace />;
  return (
    <EnterOTP
      email={email}
      onVerify={(otp) => navigate('/forgot-password/reset', { state: { email, otp } })}
      onBack={() => navigate('/forgot-password')}
    />
  );
}

function ResetPasswordRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  // Guard direct access
  if (!email) return <Navigate to="/forgot-password" replace />;
  return (
    <ResetPassword
      onSuccess={() => navigate('/login')}
      onBack={() => navigate('/forgot-password/otp', { state: { email } })}
      onBackToLogin={() => navigate('/login')}
    />
  );
}
