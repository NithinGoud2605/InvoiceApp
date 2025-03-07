import React from 'react';
import { Box, Card, CardContent, Button, Typography } from '@mui/material';
import { useInvoiceContext } from '../contexts/InvoiceContext';
import { useFormContext } from 'react-hook-form';
import { formatNumberWithCommas } from '../lib/helpers';
import { DATE_OPTIONS } from '../lib/variables';

const SavedInvoicesList = ({ setModalState }) => {
  const { savedInvoices, onFormSubmit, deleteInvoice } = useInvoiceContext();
  const { reset } = useFormContext();

  const updateFields = (selected) => {
    selected.details.dueDate = new Date(selected.details.dueDate);
    selected.details.invoiceDate = new Date(selected.details.invoiceDate);
    selected.details.invoiceLogo = '';
    selected.details.signature = { data: '' };
  };

  const transformDates = (selected) => {
    selected.details.dueDate = new Date(selected.details.dueDate).toLocaleDateString('en-US', DATE_OPTIONS);
    selected.details.invoiceDate = new Date(selected.details.invoiceDate).toLocaleDateString('en-US', DATE_OPTIONS);
  };

  const loadInvoice = (invoice) => {
    if (invoice) {
      updateFields(invoice);
      reset(invoice);
      transformDates(invoice);
      setModalState(false);
    }
  };

  const loadAndGeneratePdf = (invoice) => {
    loadInvoice(invoice);
    onFormSubmit(invoice);
  };

  return (
    <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
      {savedInvoices.length > 0 ? (
        savedInvoices.map((invoice, idx) => (
          <Card key={idx} sx={{ mb: 1, cursor: 'pointer' }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle1">Invoice #{invoice.details.invoiceNumber}</Typography>
                <Typography variant="caption">Updated at: {invoice.details.updatedAt}</Typography>
                <Typography variant="body2">Sender: {invoice.sender.name}</Typography>
                <Typography variant="body2">Receiver: {invoice.receiver.name}</Typography>
                <Typography variant="body2">
                  Total: <strong>{formatNumberWithCommas(Number(invoice.details.totalAmount))} {invoice.details.currency}</strong>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="outlined" size="small" onClick={() => loadInvoice(invoice)}>
                  Load
                </Button>
                <Button variant="outlined" size="small" onClick={() => loadAndGeneratePdf(invoice)}>
                  Load & Generate
                </Button>
                <Button variant="contained" color="error" size="small" onClick={(e) => { e.stopPropagation(); deleteInvoice(idx); }}>
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No saved invoices</Typography>
      )}
    </Box>
  );
};

export default SavedInvoicesList;
