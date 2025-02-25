// src/shared-theme/ColorModeIconDropdown.jsx
import React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';

export default function ColorModeIconDropdown(props) {
  // You can add functionality to toggle the theme here
  return (
    <IconButton color="inherit" {...props}>
      <Brightness4Icon />
    </IconButton>
  );
}
