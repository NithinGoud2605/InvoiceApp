import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import Pricing from './components/Mainpage/Pricing';
import { ThemeProvider } from './shared-theme/ThemeContext';
import AppTheme from './shared-theme/AppTheme';
import { UserProvider } from './contexts/UserContext';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <ThemeProvider>
      <AppTheme>
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/pricing" element={<Pricing />} />
              {/* Protected Dashboard */}
              <Route
                path="/dashboard/*"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              {/* Optionally, redirect unknown paths */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </UserProvider>
      </AppTheme>
    </ThemeProvider>
  );
}

export default App;
