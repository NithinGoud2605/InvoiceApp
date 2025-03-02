import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Button } from '@mui/material';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const InvoiceCard = ({ invoice, formatCurrency, onEdit, onDelete }) => {
  // Trim the clientName to remove extra spaces
  const clientName = invoice.clientName ? invoice.clientName.trim() : '';

  const isComplete =
    clientName && invoice.dueDate && invoice.totalAmount && parseFloat(invoice.totalAmount) > 0;

  return (
    <Card
      sx={{
        minHeight: 420,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: isComplete ? '2px solid green' : '2px solid red',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 2,
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Client: {clientName || 'Missing Client Info'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Due Date: {invoice.dueDate || 'Missing Due Date'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Amount: {invoice.totalAmount ? formatCurrency(invoice.totalAmount) : 'Missing Amount'}
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            aspectRatio: '210/297', // A4 paper ratio
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            mt: 2,
          }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={invoice.pdfUrl}
              defaultScale={SpecialZoomLevel.PageFit}
              initialPage={0}
            />
          </Worker>
        </Box>
      </CardContent>
      <Stack direction="row" spacing={1} sx={{ p: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" color="primary" size="small" onClick={() => onEdit(invoice.id)}>
          Edit
        </Button>
        <Button variant="outlined" color="secondary" size="small" onClick={() => onDelete(invoice.id)}>
          Delete
        </Button>
      </Stack>
    </Card>
  );
};

export default InvoiceCard;
