import React from 'react';
import { Box, Typography } from '@mui/material';
import DynamicInvoiceTemplate from '../templates/DynamicInvoiceTemplate';

// Provide default data for the preview if form data is missing
const defaultData = {
  sender: {
    name: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
    email: ''
  },
  receiver: {
    name: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
    email: ''
  },
  details: {
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    currency: '',
    items: [],
    pdfTemplate: 1
  }
};

const LivePreview = ({ data }) => {
  // Merge user data with defaultData, ensuring no missing fields in the UI
  const previewData = {
    ...defaultData,
    ...data,
    sender: { ...defaultData.sender, ...data?.sender },
    receiver: { ...defaultData.receiver, ...data?.receiver },
    details: { ...defaultData.details, ...data?.details }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      {/* If you want a heading for the live preview */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Live Preview
      </Typography>
      <DynamicInvoiceTemplate {...previewData} />
    </Box>
  );
};

export default LivePreview;
