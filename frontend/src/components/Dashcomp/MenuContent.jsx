import React, { useContext, useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import LockIcon from '@mui/icons-material/Lock';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import SubscriptionAlertDialog from '../SubscriptionAlertDailog';

export default function MenuContent() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (loading) return null; // or a spinner


  const isSubscribed = user && user.isSubscribed;

  // For restricted routes, navigate if subscribed; otherwise, show the alert dialog.
  const handleRestrictedClick = (path) => {
    if (isSubscribed) {
      navigate(path);
    } else {
      setDialogOpen(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          height: '100%', // ensure the container has a fixed height based on parent
          overflow: 'hidden', // hide any overflow and prevent scrollbars
        }}
      >
        <List dense sx={{ flexGrow: 1 }}>
          {/* Home: Restricted */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleRestrictedClick('/dashboard')}>
              <ListItemIcon>
                <HomeRoundedIcon />
                {!isSubscribed && <LockIcon fontSize="small" sx={{ ml: 0.5 }} />}
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          {/* Invoices: Accessible */}
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/dashboard/invoices">
              <ListItemIcon>
                <ReceiptLongRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Invoices" />
            </ListItemButton>
          </ListItem>
          {/* Contracts: Restricted */}
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleRestrictedClick('/dashboard/contracts')}>
              <ListItemIcon>
                <DescriptionRoundedIcon />
                {!isSubscribed && <LockIcon fontSize="small" sx={{ ml: 0.5 }} />}
              </ListItemIcon>
              <ListItemText primary="Contracts" />
            </ListItemButton>
          </ListItem>
          {/* About: Accessible */}
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InfoRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <SubscriptionAlertDialog open={dialogOpen} handleClose={() => setDialogOpen(false)} />
    </>
  );
}
