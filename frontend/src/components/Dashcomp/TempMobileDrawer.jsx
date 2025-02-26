// src/components/Dashcomp/TempMobileDrawer.jsx

import React from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
  Box,
  Divider,
  Stack,
  Avatar,
  Typography,
} from '@mui/material';

import SelectContent from './SelectContent'; // Company selector
import MenuContent from './MenuContent';     // Nav items
import CardAlert from './CardAlert';         // Plan about to expire
import OptionsMenu from './OptionsMenu';     // Profile & logout menu

export default function TempMobileDrawer({ open, setOpen }) {
  const handleClose = () => setOpen(false);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: 240 } }}
    >
      {/* Company Selector */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <SelectContent />
      </Box>

      {/* Nav items + Plan card */}
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        <MenuContent />
        <CardAlert />
      </Box>

      {/* Bottom: user info + 3-dot menu */}
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
    </Drawer>
  );
}

TempMobileDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};
