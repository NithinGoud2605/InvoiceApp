// src/components/Dashcomp/MenuContent.jsx
import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { Link as RouterLink } from 'react-router-dom';

export default function MenuContent() {
  return (
    <List dense sx={{ flexGrow: 1 }}>
      {/* Example main items */}
      <ListItem disablePadding>
        <ListItemButton component={RouterLink} to="/dashboard">
          <ListItemIcon>
            <HomeRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={RouterLink} to="/dashboard/invoices">
          <ListItemIcon>
            <ReceiptLongRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Invoices" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={RouterLink} to="/dashboard/contracts">
          <ListItemIcon>
            <DescriptionRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Contracts" />
        </ListItemButton>
      </ListItem>

      {/* Just 'About' remains */}
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <InfoRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItemButton>
      </ListItem>
    </List>
  );
}
