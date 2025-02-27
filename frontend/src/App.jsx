// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import Pricing from './components/Mainpage/Pricing';
import TestAPIs from './components/TestAPIs'; // Import your test component
import { ThemeProvider } from './shared-theme/ThemeContext';
import AppTheme from './shared-theme/AppTheme';
import { UserProvider } from './contexts/UserContext'; // Import UserProvider

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/sign-in" replace />;
}

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
              <Route
                path="/dashboard/*"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/pricing" element={<Pricing />} />
              {/* New route to test all APIs */}
              <Route
                path="/test-apis"
                element={
                  <PrivateRoute>
                    <TestAPIs />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Router>
        </UserProvider>
      </AppTheme>
    </ThemeProvider>
  );
}

export default App;
