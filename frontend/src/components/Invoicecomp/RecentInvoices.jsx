import React from 'react';
import { Grid, Typography, Paper, Box } from '@mui/material';
import InvoiceCard from './InvoiceCard';

const RecentInvoices = ({ invoices, formatCurrency, onEdit, onDelete }) => {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        borderRadius: '16px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      {invoices.length === 0 ? (
        <Typography variant="h6" align="center">
          No recent invoices found.
        </Typography>
      ) : (
        <Box
          sx={{
            maxHeight: '600px', // Adjust so about 8 items are visible initially
            overflowY: 'auto',
            paddingRight: 1,
            // Custom scrollbar styling for WebKit browsers
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
          }}
        >
          <Grid container spacing={2}>
            {invoices.map((invoice) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={invoice.id}>
                <InvoiceCard
                  invoice={invoice}
                  formatCurrency={formatCurrency}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default RecentInvoices;
