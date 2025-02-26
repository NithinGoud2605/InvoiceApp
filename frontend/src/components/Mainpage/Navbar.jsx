import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles'; // Added `useTheme`
import {
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Box,
  Button,
  Drawer,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../../shared-theme/ColorModelconDropdown';
import Sitemark from '../SitemarkIcon';

// Simulating authentication state (Replace with actual logic)
const isAuthenticated = false; // Change this based on user authentication

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme(); // ✅ Using theme hook prevents re-renders

  const handleToggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: theme.palette.mode === 'light' ? '#B3E5FC' : '#121826', // ✅ Use theme hook instead
          boxShadow: 'none',
          transition: 'background 0.3s ease-in-out',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Logo / Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Sitemark />
              <Typography
                variant="h6"
                sx={{
                  ml: 1,
                  fontWeight: 'bold',
                  color: theme.palette.mode === 'light' ? '#003366' : '#FFF', // ✅ Use theme hook instead
                }}
              >
                InvoiceApp
              </Typography>
            </Box>

            {/* Right Side Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isAuthenticated ? (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: theme.palette.mode === 'light' ? '#0288D1' : '#F44336', // ✅ Use theme hook instead
                    color: '#FFF',
                  }}
                  href="/logout"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: theme.palette.mode === 'light' ? '#0288D1' : '#4CAF50', // ✅ Use theme hook instead
                    color: '#FFF',
                  }}
                  href="/sign-in"
                >
                  Sign in
                </Button>
              )}
              <ColorModeIconDropdown />
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}>
              <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={handleToggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleToggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 250,
            background: theme.palette.mode === 'light' ? '#E1F5FE' : '#1C1C1E', // ✅ Use theme hook instead
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Menu</Typography>
          <IconButton onClick={handleToggleDrawer(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 2 }}>
          {isAuthenticated ? (
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: theme.palette.mode === 'light' ? '#0288D1' : '#F44336',
                color: '#FFF',
              }}
              href="/logout"
              onClick={handleToggleDrawer(false)}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: theme.palette.mode === 'light' ? '#0288D1' : '#4CAF50',
                color: '#FFF',
              }}
              href="/sign-in"
              onClick={handleToggleDrawer(false)}
            >
              Sign in
            </Button>
          )}
        </Box>
      </Drawer>
    </>
  );
}
