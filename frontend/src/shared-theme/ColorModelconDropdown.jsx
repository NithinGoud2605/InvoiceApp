// src/shared-theme/ColorModeIconDropdown.jsx
import React, { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { ThemeContext } from './ThemeContext';

export default function ColorModeIconDropdown(props) {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <IconButton color="inherit" onClick={toggleTheme} {...props}>
      <Brightness4Icon />
    </IconButton>
  );
}
