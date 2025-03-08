import React, { Suspense, lazy } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useInvoiceContext } from '../contexts/InvoiceContext';
import LivePreview from './LivePreview';

// Lazy load final PDF for performance
const FinalPdf = lazy(() => import('./FinalPdf'));

const PdfViewer = () => {
  const { watch } = useFormContext();
  const { invoicePdf } = useInvoiceContext();

  // React Hook Form data
  const formValues = watch();

  // Check if there's a generated PDF
  const hasGeneratedPdf = invoicePdf?.size > 0;

  return (
    <Box
      sx={{
        // Center the page
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        bgcolor: '#f5f5f5',
        p: 2,
        width: '100%',
        height: '100%',
        overflow: 'auto', // Let the outer container scroll if needed
      }}
    >
      {/* Outer box with A4 aspect ratio */}
      <Box
        sx={{
          // Use standard A4 ratio: 595×842
          // aspectRatio requires MUI v5.6+ or modern CSS
          // If your environment doesn’t support it, see the “Fallback” note below
          aspectRatio: '595 / 842',
          width: '100%',      // Let it shrink or grow to fill available space
          maxWidth: 595,      // Don’t exceed actual A4 width in px
          position: 'relative',
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: '#fff',
          overflow: 'hidden',  // Hide any overflow beyond the aspect ratio
        }}
      >
        {/* 
          Inner box absolutely fills the outer box and scrolls if the invoice is taller than 842px worth of content 
        */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'auto',
          }}
        >
          <Suspense
            fallback={
              <CircularProgress
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  zIndex: 10,
                }}
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
    </Box>
  );
};

export default PdfViewer;
