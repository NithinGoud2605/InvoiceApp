import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, Box, Typography } from '@mui/material';
import { useInvoiceContext } from '../contexts/InvoiceContext';
import ImportJsonButton from '../Modals/ImportJsonButton';
import SavedInvoicesList from '../Lists/SavedInvoicesList';

const InvoiceLoaderModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { savedInvoices } = useInvoiceContext();

  return (
    <>
      <Box onClick={() => setOpen(true)}>{children}</Box>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Saved Invoices</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography>You have {savedInvoices.length} saved invoices</Typography>
            <ImportJsonButton setOpen={setOpen} />
          </Box>
          <SavedInvoicesList setModalState={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceLoaderModal;
