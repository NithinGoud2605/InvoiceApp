// src/components/Invoicecomp/CreateInvoice/PdfViewer/LivePreview.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import DynamicInvoiceTemplate from '../templates/DynamicInvoiceTemplate';

const LivePreview = ({ data }) => {
  // Provide default data if none exists
  const defaultData = {
    sender: {
      name: '',
      address: '',
      zipCode: '',
      city: '',
      country: '',
      email: '',
    },
    receiver: {
      name: '',
      address: '',
      zipCode: '',
      city: '',
      country: '',
      email: '',
    },
    details: {
      invoiceNumber: '',
      invoiceDate: '',
      dueDate: '',
      currency: '',
      items: [],
      pdfTemplate: 1, // Ensure Template 1 is used
    },
  };

  const previewData = { ...defaultData, ...data };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <DynamicInvoiceTemplate {...previewData} />
    </Box>
  );
};

export default LivePreview;