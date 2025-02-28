import React from 'react';
import { Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ActionButtons = ({ onFileUpload }) => {
  const navigate = useNavigate();

  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button variant="contained" onClick={() => navigate('/dashboard/create-invoice')}>
        Create Invoice
      </Button>
      <Button variant="contained" component="label">
        Import Invoice
        <input type="file" hidden onChange={onFileUpload} />
      </Button>
      <Button variant="contained" onClick={() => navigate('/dashboard/add-expense')}>
        Add Expense
      </Button>
    </Stack>
  );
};

export default ActionButtons;
