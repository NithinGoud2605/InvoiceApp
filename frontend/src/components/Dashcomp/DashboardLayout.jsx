// src/components/Dashcomp/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from './Sidebar';        // permanent on md+
import Header from './Header';         // universal top bar

export default function DashboardLayout() {
  return (
    <>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Permanent sidebar for md+ screens */}
        <Sidebar />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* The top bar (Header) for all screens */}
          <Header />

          {/* The main content area */}
          <Box sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
}
