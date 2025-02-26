// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard'; // We'll define nested routes there
import AuthCallback from './pages/AuthCallback';
import Pricing from './components/Mainpage/Pricing';

import { ThemeProvider } from './shared-theme/ThemeContext'; // Our context
import AppTheme from './shared-theme/AppTheme';

// PrivateRoute for demonstration: checks token in localStorage
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/sign-in" replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AppTheme>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            {/* Protect everything under /dashboard */}
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
          </Routes>
        </Router>
      </AppTheme>
    </ThemeProvider>
  );
}

export default App;
