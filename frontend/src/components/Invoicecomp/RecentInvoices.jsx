import React, { useState } from 'react';
import { Grid, Typography, Paper, Box, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import InvoiceCard from './InvoiceCard';

const RecentInvoices = ({ invoices, formatCurrency, onEdit, onDelete }) => {
  // State for filtering: use "date" (created date) or "dueDate"
  const [filterType, setFilterType] = useState('date');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // State for sorting: sort by created date or due date, and sort order
  const [sortBy, setSortBy] = useState('date'); // "date" or "dueDate"
  const [sortOrder, setSortOrder] = useState('asc'); // "asc" or "desc"

  // Filter invoices based on the selected filter type and date range
  const filteredInvoices = invoices.filter((invoice) => {
    // Determine which date field to use based on filterType
    const dateField = filterType === 'date' ? (invoice.createdAt || invoice.date) : invoice.dueDate;
    if (!dateField) return false;
    const invoiceDate = new Date(dateField);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (from && invoiceDate < from) return false;
    if (to && invoiceDate > to) return false;
    return true;
  });

  // Sort the filtered invoices based on the selected sort criteria and order
  filteredInvoices.sort((a, b) => {
    const fieldA = new Date(sortBy === 'date' ? (a.createdAt || a.date) : a.dueDate);
    const fieldB = new Date(sortBy === 'date' ? (b.createdAt || b.date) : b.dueDate);
    return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
  });

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
     

      {/* Sorting Controls */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Button
              variant={sortBy === 'date' ? 'contained' : 'outlined'}
              onClick={() => setSortBy('date')}
              fullWidth
            >
              Sort by Created Date
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant={sortBy === 'dueDate' ? 'contained' : 'outlined'}
              onClick={() => setSortBy('dueDate')}
              fullWidth
            >
              Sort by Due Date
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              fullWidth
            >
              Toggle Sort Order ({sortOrder})
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <Typography variant="h6" align="center">
          No invoices match the selected filters.
        </Typography>
      ) : (
        <Box
          sx={{
            maxHeight: '600px',
            overflowY: 'auto',
            paddingRight: 1,
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
            {filteredInvoices.map((invoice) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={invoice.id}>
                <InvoiceCard
                  invoice={invoice}
                  formatCurrency={formatCurrency}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
                {/* Display invoice dates in the container */}
                <Typography variant="caption" display="block">
  Created: {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}
</Typography>

              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default RecentInvoices;
