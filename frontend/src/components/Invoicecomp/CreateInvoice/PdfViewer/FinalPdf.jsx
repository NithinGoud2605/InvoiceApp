// src/components/Invoicecomp/CreateInvoice/PdfViewer/FinalPdf.jsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ArrowBack, Visibility, Download, Print, Bookmark, Mail } from '@mui/icons-material';
import { useInvoiceContext } from '../contexts/InvoiceContext';

const FinalPdf = () => {
  const {
    invoicePdf: { url },
    removeFinalPdf,
    previewPdfInTab,
    downloadPdf,
    printPdf,
    saveInvoice,
    sendPdfToMail,
  } = useInvoiceContext();

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>Final PDF</Typography>
      <Button
        variant="outlined"
        onClick={removeFinalPdf}
        startIcon={<ArrowBack />}
        sx={{ mb: 2 }}
      >
        Back to Live Preview
      </Button>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Button variant="outlined" onClick={previewPdfInTab} startIcon={<Visibility />}>
          Preview
        </Button>
        <Button variant="outlined" onClick={downloadPdf} startIcon={<Download />}>
          Download
        </Button>
        <Button variant="outlined" onClick={printPdf} startIcon={<Print />}>
          Print
        </Button>
        <Button variant="outlined" onClick={saveInvoice} startIcon={<Bookmark />}>
          Save
        </Button>
        <Button
          variant="outlined"
          onClick={() => sendPdfToMail('example@example.com')}
          startIcon={<Mail />}
        >
          Send to Mail
        </Button>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <iframe
          title="Final Invoice"
          src={`${url}#toolbar=0`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </Box>
    </Box>
  );
};

export default FinalPdf;