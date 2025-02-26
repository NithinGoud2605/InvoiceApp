import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';

const whiteLogos = [
  'https://example.com/logo1-white.png',
  'https://example.com/logo2-white.png',
  'https://example.com/logo3-white.png',
  'https://example.com/logo4-white.png',
  'https://example.com/logo5-white.png',
  'https://example.com/logo6-white.png',
];

const darkLogos = [
  'https://example.com/logo1-black.png',
  'https://example.com/logo2-black.png',
  'https://example.com/logo3-black.png',
  'https://example.com/logo4-black.png',
  'https://example.com/logo5-black.png',
  'https://example.com/logo6-black.png',
];

const logoStyle = {
  width: '100px',
  height: '80px',
  margin: '0 32px',
  opacity: 0.7,
};

export default function LogoCollection() {
  const theme = useTheme();
  const logos = theme.palette.mode === 'light' ? darkLogos : whiteLogos;

  return (
    <Box id="logoCollection" sx={{ py: 4 }}>
      <Typography variant="subtitle2" align="center" sx={{ color: 'text.secondary' }}>
        Trusted by the best companies
      </Typography>
      <Grid container sx={{ justifyContent: 'center', mt: 0.5, opacity: 0.6 }}>
        {logos.map((logo, index) => (
          <Grid item key={index}>
            <img src={logo} alt={`Company logo ${index + 1}`} style={logoStyle} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}