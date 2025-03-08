import React, { Suspense, lazy } from 'react';
import { useFormContext } from 'react-hook-form';
import { useInvoiceContext } from '../contexts/InvoiceContext';
import { Box, CircularProgress } from '@mui/material';
import LivePreview from './LivePreview';

const FinalPdf = lazy(() => import('./FinalPdf'));

const PdfViewer = () => {
  const { watch } = useFormContext();
  const { invoicePdf } = useInvoiceContext();

  // React Hook Form data
  const formValues = watch();

  // Determine if there's a generated PDF
  const hasGeneratedPdf = invoicePdf?.size > 0;

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
        p: 2
      }}
    >
      <Box
        sx={{
          width: '595px', // A4 width in px
          height: '842px', // A4 height in px
          bgcolor: '#fff',
          boxShadow: 3,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Suspense
          fallback={
            <CircularProgress
              sx={{ position: 'absolute', top: '50%', left: '50%', zIndex: 10 }}
            />
          }
        >
          {hasGeneratedPdf ? (
            <FinalPdf />
          ) : (
            <LivePreview data={formValues} />
          )}
        </Suspense>
      </Box>
    </Box>
  );
};

export default PdfViewer;
