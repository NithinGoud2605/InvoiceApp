import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateInvoiceActions = () => {
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    // Handle file import logic
    console.log('File uploaded:', e.target.files[0]);
  };

  const handleAddExpense = () => {
    console.log('Toggle Expense Form');
  };

  return (
    <Box sx={{ width: '45%' }}>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="contained" onClick={() => navigate('/dashboard/create-invoice')}>
          Create Invoice
        </Button>
        <Button variant="contained" component="label">
          Import Invoice
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>
        <Button variant="contained" onClick={handleAddExpense}>
          Add Expense
        </Button>
      </Stack>
    </Box>
  );
};

export default CreateInvoiceActions;
