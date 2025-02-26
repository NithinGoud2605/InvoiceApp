import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const benefitsData = [
  {
    title: 'Save Time & Reduce Errors',
    detail:
      'Automate repetitive tasks such as invoice generation and contract reminders, avoiding common manual errors.',
  },
  {
    title: 'Instant Client Communication',
    detail:
      'Send invoices and contracts directly to your clients without leaving the dashboard, improving turnaround times.',
  },
  {
    title: 'Secure Cloud Storage',
    detail:
      'Access all your important documents from anywhere, with top-tier encryption and backup solutions.',
  },
  {
    title: 'Scalable Solutions',
    detail:
      'Whether you’re a freelancer or an enterprise, scale your contract and invoice management as your business grows.',
  },
  {
    title: 'Customizable Templates',
    detail:
      'Use and edit professional templates for contracts and invoices, ensuring consistency and brand integrity.',
  },
  {
    title: 'Advanced Analytics & Reporting',
    detail:
      'Get real-time data on payments, outstanding invoices, contract renewal dates, and more, all in one place.',
  },
];

export default function Benefits() {
  return (
    <Container sx={{ py: { xs: 8, sm: 16 } }} id="benefits">
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography component="h2" variant="h4" gutterBottom>
          Why Choose Our Platform?
        </Typography>
        <Typography variant="body1" color="text.secondary">
          A comprehensive set of tools to streamline your business operations and boost productivity.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {benefitsData.map((benefit, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <CheckCircleRoundedIcon
                color="primary"
                sx={{ fontSize: 32, mr: 2, mt: 0.5 }}
              />
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {benefit.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {benefit.detail}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
