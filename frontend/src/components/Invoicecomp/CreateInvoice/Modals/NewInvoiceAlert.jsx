import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useInvoiceContext } from '../contexts/InvoiceContext';

const NewInvoiceAlert = ({ children }) => {
  const { newInvoice } = useInvoiceContext();
  const { formState } = useFormContext();
  const [open, setOpen] = useState(false);

  const handleNewInvoice = () => {
    if (formState.isDirty) {
      setOpen(true);
    } else {
      newInvoice();
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleNewInvoice}>
        {children}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone. You might lose your unsaved changes.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={newInvoice} color="error">
            Create new invoice
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NewInvoiceAlert;
