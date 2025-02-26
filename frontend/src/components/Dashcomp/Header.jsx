// src/components/Dashcomp/Header.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Box,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import ColorModeIconDropdown from '../../shared-theme/ColorModelconDropdown';

import TempMobileDrawer from './TempMobileDrawer';

export default function Header() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  // Mobile drawer open/close
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Example user name
  const userName = 'John';

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
        {/* Left side: user greeting */}
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Hello, {userName}
        </Typography>

        {/* Grow space */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Right side: notifications + theme toggle */}
        <IconButton sx={{ mr: 1 }}>
          <Badge color="error" variant="dot" overlap="circular">
            <NotificationsRoundedIcon />
          </Badge>
        </IconButton>

        <ColorModeIconDropdown />

        {/* Hamburger icon only on mobile */}
        {!isMdUp && (
          <IconButton onClick={handleDrawerToggle} sx={{ ml: 1 }}>
            <MenuRoundedIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* The mobile drawer for navigation + company selector */}
      <TempMobileDrawer open={mobileOpen} setOpen={setMobileOpen} />
    </AppBar>
  );
}
