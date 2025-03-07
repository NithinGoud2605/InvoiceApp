// src/components/Invoicecomp/CreateInvoice/PdfViewer/PdfViewer.jsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useInvoiceContext } from '../contexts/InvoiceContext';
import { Box } from '@mui/material';
import LivePreview from './LivePreview';
import FinalPdf from './FinalPdf';

const PdfViewer = () => {
  const { watch } = useFormContext();
  const { invoicePdf } = useInvoiceContext();
  const formValues = watch();

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        bgcolor: '#f5f5f5',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '595px', // A4 width in pixels (at 72 DPI)
          height: '842px', // A4 height in pixels
          bgcolor: '#fff',
          boxShadow: 3,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {invoicePdf.size === 0 ? <LivePreview data={formValues} /> : <FinalPdf />}
      </Box>
    </Box>
  );
};

export default PdfViewer;