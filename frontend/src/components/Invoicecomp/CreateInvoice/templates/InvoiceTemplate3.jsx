// src/components/Invoicecomp/CreateInvoice/templates/InvoiceTemplate3.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const InvoiceTemplate3 = ({ sender, receiver, details, logo }) => {
  const totalAmount = details.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;

  return (
    <Box sx={{ p: 4, background: 'linear-gradient(to bottom right, #f5f7fa 0%, #c3cfe2 100%)', borderRadius: 8 }}>
      <Box sx={{ position: 'relative', mb: 4 }}>
        <img src={logo} alt={`${sender.name} Logo`} style={{ maxWidth: '150px', position: 'absolute', top: -20, left: 20 }} />
        <Typography variant="h3" sx={{ fontFamily: 'Pacifico, cursive', color: '#333', textAlign: 'center', mb: 2 }}>
          Invoice
        </Typography>
        <Typography variant="h6" sx={{ fontFamily: 'Pacifico, cursive', color: '#666', textAlign: 'center' }}>
          Crafting Your Vision
        </Typography>
      </Box>
      <Box sx={{ mb: 4, p: 2, background: '#fff', borderRadius: 8, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6">Bill To:</Typography>
        <Typography>{receiver.name}</Typography>
        <Typography>{receiver.address}</Typography>
        <Typography>{receiver.zipCode} {receiver.city}</Typography>
        <Typography>{receiver.country}</Typography>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Details:</Typography>
        <Typography>Invoice #: {details.invoiceNumber}</Typography>
        <Typography>Issue Date: {details.invoiceDate}</Typography>
        <Typography>Due Date: {details.dueDate}</Typography>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Items:</Typography>
        {details.items?.map((item, index) => (
          <Box key={index} sx={{ p: 2, mb: 2, background: '#fff', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Typography>{item.name} - {item.description}</Typography>
            <Typography sx={{ fontStyle: 'italic' }}>Qty: {item.quantity} x ${item.unitPrice} = ${item.quantity * item.unitPrice}</Typography>
          </Box>
        ))}
      </Box>
      <Typography variant="h5" sx={{ fontFamily: 'Pacifico, cursive', color: '#333', textAlign: 'right', mb: 4 }}>
        Total: ${totalAmount} {details.currency}
      </Typography>
      {details.signature?.data && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Signature:</Typography>
          <img src={details.signature.data} alt="Signature" style={{ maxWidth: '200px', border: '1px solid #ccc', padding: 5 }} />
        </Box>
      )}
      <Box sx={{ mt: 4, textAlign: 'center', color: '#666' }}>
        <Typography sx={{ fontFamily: 'Pacifico, cursive' }}>Made with Love by {sender.name}</Typography>
      </Box>
    </Box>
  );
};

export default InvoiceTemplate3;