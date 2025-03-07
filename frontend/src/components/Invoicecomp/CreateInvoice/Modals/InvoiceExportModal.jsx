import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Box, Button, Typography } from '@mui/material';
import { useInvoiceContext } from '../contexts/InvoiceContext';
import { useTranslation } from 'react-i18next';

const InvoiceExportModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { invoicePdfLoading, exportInvoiceAs } = useInvoiceContext();
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <Box onClick={() => setOpen(true)}>{children}</Box>
      <DialogContent>
        <DialogTitle>Export the invoice</DialogTitle>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Please select export option for your invoice
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" disabled={invoicePdfLoading} onClick={() => exportInvoiceAs('JSON')}>
            Export as JSON
          </Button>
          <Button variant="outlined" disabled={invoicePdfLoading} onClick={() => exportInvoiceAs('CSV')}>
            Export as CSV
          </Button>
          <Button variant="outlined" disabled={invoicePdfLoading} onClick={() => exportInvoiceAs('XML')}>
            Export as XML
          </Button>
          <Button variant="outlined" disabled={invoicePdfLoading} onClick={() => exportInvoiceAs('XLSX')}>
            Export as XLSX
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceExportModal;
