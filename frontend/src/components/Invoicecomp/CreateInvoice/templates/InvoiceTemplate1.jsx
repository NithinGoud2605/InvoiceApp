// src/components/Invoicecomp/CreateInvoice/templates/InvoiceTemplate1.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const InvoiceTemplate1 = ({ sender, receiver, details, logo }) => {
  const totalAmount = details.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;

  return (
    <Box sx={{ p: 4, fontFamily: 'Arial, sans-serif', width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <img src={logo} alt={`${sender.name || 'Company'} Logo`} style={{ maxWidth: '140px', maxHeight: '100px' }} />
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{sender.name || 'Company Name'}</Typography>
          <Typography>{sender.address || 'Address'}</Typography>
          <Typography>{sender.zipCode || 'ZIP'} {sender.city || 'City'}</Typography>
          <Typography>{sender.country || 'Country'}</Typography>
          <Typography>{sender.email || 'email@company.com'}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h6">Bill To:</Typography>
          <Typography>{receiver.name || 'Client Name'}</Typography>
          <Typography>{receiver.address || 'Address'}</Typography>
          <Typography>{receiver.zipCode || 'ZIP'} {receiver.city || 'City'}</Typography>
          <Typography>{receiver.country || 'Country'}</Typography>
          <Typography>{receiver.email || 'client@example.com'}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6">Invoice Details:</Typography>
          <Typography>Invoice #: {details.invoiceNumber || 'N/A'}</Typography>
          <Typography>Issue Date: {details.invoiceDate || 'N/A'}</Typography>
          <Typography>Due Date: {details.dueDate || 'N/A'}</Typography>
        </Box>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Items:</Typography>
        {details.items?.length > 0 ? (
          details.items.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #e0e0e0' }}>
              <Typography>{item.name} - {item.description}</Typography>
              <Typography>{item.quantity} x ${item.unitPrice} = ${item.quantity * item.unitPrice}</Typography>
            </Box>
          ))
        ) : (
          <Typography>No items added yet.</Typography>
        )}
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'right' }}>Total: ${totalAmount} {details.currency || 'USD'}</Typography>
      </Box>
      {details.signature?.data && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Signature:</Typography>
          <img src={details.signature.data} alt="Signature" style={{ maxWidth: '200px' }} />
        </Box>
      )}
      <Box sx={{ mt: 4, textAlign: 'center', color: '#666' }}>
        <Typography>Thank you for your business!</Typography>
      </Box>
    </Box>
  );
};

export default InvoiceTemplate1;