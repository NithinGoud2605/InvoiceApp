import React from 'react';
import { Grid, Typography, Paper } from '@mui/material';
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
      )}
    </Paper>
  );
};

export default RecentInvoices;
