// src/components/Footer.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: 'background.paper', py: 3, textAlign: 'center', mt: 4 }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} InvoiceApp. All rights reserved.
      </Typography>
    </Box>
  );
}
