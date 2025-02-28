import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import { Box, CircularProgress } from '@mui/material';

function PrivateRoute({ children }) {
  const { user, loading } = useContext(UserContext);

  // While user data is loading, show a centered spinner
  if (loading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // optional overlay effect
          zIndex: 9999,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If no user data, redirect to sign in
  return user ? children : <Navigate to="/sign-in" replace />;
}

export default PrivateRoute;
