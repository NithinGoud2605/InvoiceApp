import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AuthCallback from './pages/AuthCallback';
import Pricing from './components/Mainpage/Pricing';
import { ThemeProvider } from './shared-theme/ThemeContext';
import AppTheme from './shared-theme/AppTheme';
import { UserProvider } from './contexts/UserContext';
import PrivateRoute from './PrivateRoute';
import CircularProgress from '@mui/material/CircularProgress';

// Lazy-load the Dashboard page
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <ThemeProvider>
      <AppTheme>
        <UserProvider>
          <Router>
            {/* Wrap your Routes with Suspense so that lazy components show a fallback while loading */}
            <Suspense fallback={
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CircularProgress />
                <p>Loading...</p>
              </div>
            }>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/pricing" element={<Pricing />} />
                {/* Protected Dashboard is lazy-loaded */}
                <Route
                  path="/dashboard/*"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                {/* Redirect unknown paths */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </UserProvider>
      </AppTheme>
    </ThemeProvider>
  );
}

export default App;
