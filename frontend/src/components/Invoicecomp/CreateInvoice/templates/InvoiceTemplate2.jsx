// src/components/Invoicecomp/CreateInvoice/templates/InvoiceTemplate2.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { formatNumberWithCommas, isDataUrl } from '../lib/helpers';
import { DATE_OPTIONS } from '../lib/variables';

const formatDate = (dateValue) => {
  const dateObj = new Date(dateValue);
  return isNaN(dateObj) ? 'Invalid Date' : dateObj.toLocaleDateString('en-US', DATE_OPTIONS);
};

const InvoiceTemplate2 = ({ sender, receiver, details, logo }) => {
  const totalAmount = details.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <img src={logo} alt={`${sender.name} Logo`} style={{ maxWidth: '140px', maxHeight: '100px', mb: 2 }} />
          <Typography variant="h4" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}>
            Invoice #{details.invoiceNumber || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h5" sx={{ fontFamily: 'Montserrat, sans-serif' }}>Invoice</Typography>
          <Typography>Issued: {formatDate(details.invoiceDate)}</Typography>
          <Typography>Due: {formatDate(details.dueDate)}</Typography>
          <Box component="address" sx={{ mt: 1 }}>
            {sender.address}<br />
            {sender.zipCode}, {sender.city}<br />
            {sender.country}
          </Box>
        </Box>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Bill To:</Typography>
        <Typography>{receiver.name}</Typography>
        <Typography>{receiver.address}</Typography>
        <Typography>{receiver.zipCode} {receiver.city}</Typography>
        <Typography>{receiver.country}</Typography>
        <Typography>{receiver.email}</Typography>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Items:</Typography>
        {details.items?.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px dashed #ccc' }}>
            <Typography>{item.name}</Typography>
            <Typography>{item.quantity} x ${item.unitPrice} = ${item.quantity * item.unitPrice}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ mb: 4, bgcolor: '#e3f2fd', p: 2, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ color: '#1976d2' }}>
          Total: {formatNumberWithCommas(totalAmount)} {details.currency}
        </Typography>
      </Box>
      {details.signature?.data && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Signature:</Typography>
          <img src={details.signature.data} alt="Signature" style={{ maxWidth: '200px' }} />
        </Box>
      )}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <img src={logo} alt={`${sender.name} Brand Mark`} style={{ maxWidth: '50px', opacity: 0.5 }} />
      </Box>
    </Box>
  );
};

export default InvoiceTemplate2;