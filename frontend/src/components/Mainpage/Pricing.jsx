import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Pricing() {
  return (
    <Container id="pricing" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography component="h2" variant="h4" gutterBottom>
          Pricing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose the plan that’s right for you
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Free Plan */}
        <Card
          variant="outlined"
          sx={{
            width: { xs: '100%', sm: '300px' },
            textAlign: 'center',
            p: 2,
            boxShadow: (theme) => theme.shadows[2],
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Free Plan
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              $0
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Perfect if you just need to create and download invoices
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Generate unlimited invoices
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Download as PDF
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • Basic email support
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              href="/sign-up"
            >
              Get Started
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card
          variant="outlined"
          sx={{
            width: { xs: '100%', sm: '300px' },
            textAlign: 'center',
            p: 2,
            boxShadow: (theme) => theme.shadows[2],
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Premium Plan
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              $29/mo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Advanced contract & invoice management for growing businesses
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • All Free Plan features
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Manage contracts in a custom dashboard
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Send invoices & contracts directly to clients
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Secure cloud storage
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Online payment integration (Stripe, PayPal & bank transfers)
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Automated recurring invoices & reminders
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • E-signature & compliance alerts
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Priority email & phone support
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="/sign-up"
            >
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
