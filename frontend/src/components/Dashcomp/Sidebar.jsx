// src/components/Dashcomp/Sidebar.jsx
import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Drawer,
  Box,
  Divider,
  Stack,
  Avatar,
  Typography,
} from '@mui/material';
import { drawerClasses } from '@mui/material/Drawer';
import SelectContent from './SelectContent'; // The company selector
import MenuContent from './MenuContent';     // The main nav items
import CardAlert from './CardAlert';         // “Plan about to expire” card
import OptionsMenu from './OptionsMenu';     // The small 3-dot menu for “Profile”, “Logout”, etc.

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function Sidebar() {
  return (
    <StyledDrawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
      }}
    >
      {/* Top: company selector with spacing */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <SelectContent />
      </Box>

      <Box
        sx={{
          overflow: 'auto',
          flexGrow: 1, // so nav + alert fill remaining space
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Middle: nav + plan about to expire card */}
        <MenuContent />
        <CardAlert />
      </Box>

      {/* Bottom: current user + menu */}
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          alt="John Doe"
          src="/static/images/avatar/1.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            John Doe
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            john@example.com
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </StyledDrawer>
  );
}
