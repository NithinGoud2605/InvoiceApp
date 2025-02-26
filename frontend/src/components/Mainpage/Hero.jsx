import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import visuallyHidden from '@mui/utils/visuallyHidden';
import { styled } from '@mui/material/styles';

const StyledBox = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  width: '100%',
  height: 500,
  marginTop: theme.spacing(8),
  borderRadius: theme.shape.borderRadius,
  outline: '6px solid hsla(220, 25%, 80%, 0.2)',
  border: '1px solid',
  borderColor: theme.palette.grey[200],
  boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
  backgroundImage: `url('https://example.com/hero-image-invoices.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(12),
    height: 700,
  },
}));

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={{
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
      }}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              textAlign: 'center',
              fontWeight: 700,
            }}
          >
            Simplify Your Contract & Invoice Management
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
              fontSize: '1.1rem',
            }}
          >
            Our platform streamlines contract creation, invoice management, and more. Create invoices
            for free or upgrade to get a full-featured dashboard, robust analytics, direct sending
            to clients, and secure cloud storage — all in one place.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}
          >
            <InputLabel htmlFor="email-hero" sx={visuallyHidden}>
              Email
            </InputLabel>
            <TextField
              id="email-hero"
              size="small"
              variant="outlined"
              placeholder="Your email address"
              fullWidth
              inputProps={{
                autoComplete: 'off',
                'aria-label': 'Enter your email address',
              }}
            />
            <Button variant="contained" color="primary" size="small">
              Start Now
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
            By clicking "Start Now" you agree to our{' '}
            <Link href="#" color="primary">
              Terms & Conditions
            </Link>
            .
          </Typography>
        </Stack>
        <StyledBox id="image" />
      </Container>
    </Box>
  );
}
