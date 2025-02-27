import React, { useContext } from 'react';
import { styled } from '@mui/material/styles';
import { Drawer, Box, Divider, Stack, Avatar, Typography } from '@mui/material';
import { drawerClasses } from '@mui/material/Drawer';
import SelectContent from './SelectContent'; // The company selector
import MenuContent from './MenuContent';     // The main nav items
import CardAlert from './CardAlert';         // “Plan about to expire” card
import OptionsMenu from './OptionsMenu';     // The small 3-dot menu for “Profile”, “Logout”, etc.
import { UserContext } from '../../contexts/UserContext';

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
  const { user } = useContext(UserContext);
  const displayName = user ? user.name : 'Loading...';
  const displayEmail = user ? user.email : '';

  return (
    <StyledDrawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
      }}
    >
      {/* Top: company selector */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <SelectContent />
      </Box>

      {/* Middle: nav + plan alert (fixed height, hidden overflow) */}
      <Box
        sx={{
          height: 'calc(100vh - 160px)', // Adjust based on header/footer heights
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
          alt={displayName}
          src="/static/images/avatar/1.jpg" // Optionally replace with user.avatar if available
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {displayName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary',fontSize: 10 }}>
            {displayEmail}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </StyledDrawer>
  );
}
