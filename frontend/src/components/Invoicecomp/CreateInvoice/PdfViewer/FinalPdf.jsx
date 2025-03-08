import React, { useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import {
  ArrowBack,
  Visibility,
  Download,
  Print,
  Bookmark,
  Mail
} from '@mui/icons-material';
import { useInvoiceContext } from '../contexts/InvoiceContext';

const FinalPdf = () => {
  const {
    invoicePdf: { url },
    removeFinalPdf,
    previewPdfInTab,
    downloadPdf,
    printPdf,
    saveInvoice,
    sendPdfToMail
  } = useInvoiceContext();

  // Wrap button handlers in useCallback for potential performance benefits
  const handleRemovePdf = useCallback(() => {
    removeFinalPdf();
  }, [removeFinalPdf]);

  const handlePreviewPdf = useCallback(() => {
    previewPdfInTab();
  }, [previewPdfInTab]);

  const handleDownloadPdf = useCallback(() => {
    downloadPdf();
  }, [downloadPdf]);

  const handlePrintPdf = useCallback(() => {
    printPdf();
  }, [printPdf]);

  const handleSavePdf = useCallback(() => {
    saveInvoice();
  }, [saveInvoice]);

  const handleSendPdf = useCallback(() => {
    // In a real-world scenario, you might dynamically pick the email address
    sendPdfToMail('example@example.com');
  }, [sendPdfToMail]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Final PDF
      </Typography>
      <Button
        variant="outlined"
        onClick={handleRemovePdf}
        startIcon={<ArrowBack />}
        sx={{ mb: 2 }}
      >
        Back to Live Preview
      </Button>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Button variant="outlined" onClick={handlePreviewPdf} startIcon={<Visibility />}>
          Preview
        </Button>
        <Button variant="outlined" onClick={handleDownloadPdf} startIcon={<Download />}>
          Download
        </Button>
        <Button variant="outlined" onClick={handlePrintPdf} startIcon={<Print />}>
          Print
        </Button>
        <Button variant="outlined" onClick={handleSavePdf} startIcon={<Bookmark />}>
          Save
        </Button>
        <Button variant="outlined" onClick={handleSendPdf} startIcon={<Mail />}>
          Send to Mail
        </Button>
      </Box>

      {/* Render the iframe if there's a valid PDF URL */}
      {url ? (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <iframe
            title="Final Invoice"
            src={`${url}#toolbar=0`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
          />
        </Box>
      ) : (
        <Typography color="error" sx={{ mt: 2 }}>
          No PDF URL found. Please generate your invoice again.
        </Typography>
      )}
    </Box>
  );
};

export default FinalPdf;
