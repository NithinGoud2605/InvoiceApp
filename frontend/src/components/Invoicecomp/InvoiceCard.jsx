import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Button, Chip } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { updateInvoice } from '../../services/api';

const InvoiceCard = ({ invoice, formatCurrency, onEdit, onDelete, refetchInvoices }) => {
  const clientName = invoice.clientName ? invoice.clientName.trim() : '';
  // Use createdAt if available, otherwise use invoice.date
  const createdDate = invoice.created_at || invoice.createdAt || invoice.date;
  const formattedCreatedDate = createdDate ? new Date(createdDate).toLocaleDateString() : 'N/A';
  const formattedDueDate = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A';

  // Use dynamic current date for production-level setting
  const currentDate = new Date();
  // Compare using invoice.dueDate. Ensure we compare at the end of the due day.
  const dueDateEnd = invoice.dueDate ? new Date(`${invoice.dueDate}T23:59:59Z`) : null;
  const isOverdue = dueDateEnd ? currentDate > dueDateEnd : false;

  const statusColors = {
    DRAFT: 'secondary',
    SENT: 'primary',
    PAID: 'success',
    CANCELLED: 'error',
  };

  const handleStatusToggle = async () => {
    if (isOverdue) return;

    const nextStatusOrder = ['DRAFT', 'SENT', 'PAID', 'CANCELLED'];
    const currentIndex = nextStatusOrder.indexOf(invoice.status);
    const nextIndex = (currentIndex + 1) % nextStatusOrder.length;
    const newStatus = nextStatusOrder[nextIndex];

    try {
      await updateInvoice(invoice.id, { status: newStatus });
      refetchInvoices();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <Card
      sx={{
        minHeight: 420,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: clientName && invoice.dueDate && invoice.totalAmount && parseFloat(invoice.totalAmount) > 0
          ? '2px solid green'
          : '2px solid red',
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
        <Typography 
  variant="h6" 
  gutterBottom
  sx={{ fontSize: 'min(1rem, 3vw)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
>
  Client: {clientName || 'Missing Client Info'}
</Typography>
<Typography 
  variant="body2" 
  color="text.secondary" 
  gutterBottom
  sx={{ fontSize: 'min(0.8rem, 2.5vw)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
>
  Created: {formattedCreatedDate}
</Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Due Date: {formattedDueDate}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Amount: {invoice.totalAmount ? formatCurrency(invoice.totalAmount) : 'Missing Amount'}
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            aspectRatio: '210/297',
            border: '0px solid #ddd',
            borderRadius: '10px',
            overflow: 'hidden',
            mt: 0,
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
        <Box>
        <Chip
            label={invoice.status}
            color={statusColors[invoice.status] || 'default'}
            onClick={handleStatusToggle}
            sx={{ cursor: isOverdue ? 'default' : 'pointer', mt: -5 }}
          />
        </Box>

      </CardContent>
      <Stack direction="row" spacing={1} sx={{mt: -3, p: 1, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => onEdit(invoice.id)}
          disabled={isOverdue}
        >
          {isOverdue ? 'Completed' : 'Edit'}
        </Button>
        <Button variant="outlined" color="secondary" size="small" onClick={() => onDelete(invoice.id)}>
          Delete
        </Button>
      </Stack>
    </Card>
  );
};

export default InvoiceCard;
