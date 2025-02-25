// src/components/Pricing.jsx
import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const tiers = [
  {
    title: 'Free',
    price: '0',
    description: [
      '10 users included',
      '2 GB of storage',
      'Help center access',
      'Email support',
    ],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
  },
  {
    title: 'Professional',
    subheader: 'Recommended',
    price: '15',
    description: [
      '20 users included',
      '10 GB of storage',
      'Help center access',
      'Priority email support',
      'Dedicated team',
      'Best deals',
    ],
    buttonText: 'Start now',
    buttonVariant: 'contained',
    buttonColor: 'secondary',
  },
  {
    title: 'Enterprise',
    price: '30',
    description: [
      '50 users included',
      '30 GB of storage',
      'Help center access',
      'Phone & email support',
    ],
    buttonText: 'Contact us',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
  },
];

export default function Pricing() {
  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box sx={{ width: { sm: '100%', md: '60%' }, textAlign: { sm: 'left', md: 'center' } }}>
        <Typography component="h2" variant="h4" gutterBottom>
          Pricing
        </Typography>
        <Typography variant="body1">
          Choose the plan that best suits your business needs.
        </Typography>
      </Box>
      <Grid container spacing={3} sx={{ justifyContent: 'center', mt: 4 }}>
        {tiers.map((tier) => (
          <Grid item xs={12} sm={tier.title === 'Enterprise' ? 12 : 6} md={4} key={tier.title}>
            <Card
              sx={[
                {
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                },
                tier.title === 'Professional' && {
                  border: 'none',
                  background:
                    'radial-gradient(circle at 50% 0%, hsl(220, 20%, 35%), hsl(220, 30%, 6%))',
                  boxShadow: '0 8px 12px hsla(220, 20%, 42%, 0.2)',
                },
              ]}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6">{tier.title}</Typography>
                  {tier.title === 'Professional' && (
                    <Chip icon={<AutoAwesomeIcon />} label={tier.subheader} />
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography variant="h2">${tier.price}</Typography>
                  <Typography variant="h6">&nbsp;per month</Typography>
                </Box>
                <Divider sx={{ my: 2, opacity: 0.8 }} />
                {tier.description.map((line) => (
                  <Box key={line} sx={{ display: 'flex', gap: 1.5, py: 1, alignItems: 'center' }}>
                    <CheckCircleRoundedIcon sx={{ width: 20, color: tier.title === 'Professional' ? 'primary.light' : 'primary.main' }} />
                    <Typography variant="subtitle2">{line}</Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions>
                <Button fullWidth variant={tier.buttonVariant} color={tier.buttonColor}>
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
