// src/shared-theme/ColorModeIconDropdown.jsx
import React, { useContext, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// Icons:
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';

import { ThemeContext } from './ThemeContext';

export default function ColorModeIconDropdown(props) {
  const { mode, setMode } = useContext(ThemeContext);

  // Menu anchor state:
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // For the main icon, show a sun if light, a moon if dark, or a gear if system...
  const getCurrentIcon = () => {
    if (mode === 'light') return <WbSunnyIcon />;
    if (mode === 'dark') return <NightsStayIcon />;
    // If you had 'system' as a possibility:
    return <SettingsBrightnessIcon />;
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeMode = (newMode) => {
    setMode(newMode);
    handleClose();
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        {...props}
      >
        {getCurrentIcon()}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Light Mode */}
        <MenuItem onClick={() => handleChangeMode('light')}>
          <ListItemIcon>
            <WbSunnyIcon />
          </ListItemIcon>
          <ListItemText primary="Light Mode" />
        </MenuItem>

        {/* Dark Mode */}
        <MenuItem onClick={() => handleChangeMode('dark')}>
          <ListItemIcon>
            <NightsStayIcon />
          </ListItemIcon>
          <ListItemText primary="Dark Mode" />
        </MenuItem>

        {/* Optionally, if you want a 'System' mode: */}
        {/* 
        <MenuItem onClick={() => handleChangeMode('system')}>
          <ListItemIcon>
            <SettingsBrightnessIcon />
          </ListItemIcon>
          <ListItemText primary="System Default" />
        </MenuItem>
        */}
      </Menu>
    </>
  );
}
