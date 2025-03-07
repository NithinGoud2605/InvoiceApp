// src/components/Invoicecomp/CreateInvoice/templates/InvoiceTemplate4.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const InvoiceTemplate4 = ({ sender, receiver, details, logo }) => {
  const totalAmount = details.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;

  return (
    <Box sx={{ p: 4, fontFamily: 'Times New Roman, serif' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, borderBottom: '2px solid #000' }}>
        <img src={logo} alt={`${sender.name} Logo`} style={{ maxWidth: '140px', maxHeight: '100px' }} />
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{sender.name}</Typography>
          <Typography>Excellence in Service</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Bill To:</Typography>
          <Typography>{receiver.name}</Typography>
          <Typography>{receiver.address}</Typography>
          <Typography>{receiver.zipCode} {receiver.city}</Typography>
          <Typography>{receiver.country}</Typography>
          <Typography>{receiver.email}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Invoice Details:</Typography>
          <Typography>Invoice #: {details.invoiceNumber}</Typography>
          <Typography>Issue Date: {details.invoiceDate}</Typography>
          <Typography>Due Date: {details.dueDate}</Typography>
        </Box>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Items:</Typography>
        </Box>
        {details.items?.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #ddd' }}>
            <Typography>{item.name}</Typography>
            <Typography>{item.quantity}</Typography>
            <Typography>${item.unitPrice}</Typography>
            <Typography>${item.quantity * item.unitPrice}</Typography>
          </Box>
        ))}
        <Box sx={{ mt: 2, textAlign: 'right', bgcolor: '#f5f5f5', p: 2 }}>
          <Typography variant="h6">Total: ${totalAmount} {details.currency}</Typography>
        </Box>
      </Box>
      {details.signature?.data && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Signature:</Typography>
          <img src={details.signature.data} alt="Signature" style={{ maxWidth: '200px' }} />
        </Box>
      )}
      <Box sx={{ mt: 4, textAlign: 'center', color: '#666', fontSize: '12px' }}>
        <Typography>{sender.address} | Phone: {sender.phone} | Email: {sender.email} | Tax ID: 12345</Typography>
      </Box>
    </Box>
  );
};

export default InvoiceTemplate4;