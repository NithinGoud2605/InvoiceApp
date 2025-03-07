// src/components/Invoicecomp/CreateInvoice/CreateInvoiceForm.jsx
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, Container } from '@mui/material';
import InvoiceForm from './InvoiceForm';
import PdfViewer from './PdfViewer/PdfViewer';
import { useInvoiceContext } from './contexts/InvoiceContext';
import { FORM_FILL_VALUES } from './lib/variables';

const CreateInvoiceForm = () => {
  const { onFormSubmit } = useInvoiceContext();

  // Set default values with pdfTemplate: 1 for Template 1
  const defaultValues = {
    ...FORM_FILL_VALUES,
    details: {
      ...FORM_FILL_VALUES.details,
      pdfTemplate: 1, // Default to Template 1
    },
  };

  const methods = useForm({ defaultValues });

  const handleSubmit = (data) => {
    onFormSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <Container sx={{ mt: 4, pb: 4 }}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Box
            sx={{
              display: 'flex',
              gap: 4,
              flexDirection: { xs: 'column', md: 'row' },
              height: 'calc(100vh - 120px)', // Fixed height relative to viewport
              overflow: 'hidden', // Prevent layout shift
            }}
          >
            <Box
              sx={{
                flex: 1,
                height: '100%',
                overflow: 'auto', // Scroll if content overflows
                border: '1px solid #e0e0e0',
                borderRadius: 2,
              }}
            >
              <InvoiceForm />
            </Box>
            <Box
              sx={{
                flex: 1,
                height: '100%',
                overflow: 'auto', // Scroll if content overflows
                border: '1px solid #e0e0e0',
                borderRadius: 2,
              }}
            >
              <PdfViewer />
            </Box>
          </Box>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary">
              Generate PDF
            </Button>
          </Box>
        </form>
      </Container>
    </FormProvider>
  );
};

export default CreateInvoiceForm;