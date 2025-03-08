import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, Button, Container, Drawer, IconButton } from '@mui/material';
import InvoiceForm from './InvoiceForm';
import PdfViewer from './PdfViewer/PdfViewer';
import { useGeneratePdf } from './useGeneratePdf';
import { FORM_FILL_VALUES } from './lib/variables';
import MenuIcon from '@mui/icons-material/Menu';

const CreateInvoiceForm = () => {
  const generatePdf = useGeneratePdf();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const defaultValues = {
    ...FORM_FILL_VALUES,
    details: {
      ...FORM_FILL_VALUES.details,
      pdfTemplate: 1
    }
  };

  const methods = useForm({ defaultValues });

  const handleSubmit = (data) => {
    console.log("Form data:", data);
    generatePdf(data);
  };

  return (
    <FormProvider {...methods}>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <form onSubmit={methods.handleSubmit(handleSubmit)} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              overflow: 'hidden'
            }}
          >
            <IconButton
              sx={{ display: { md: 'none' }, mb: 2 }}
              onClick={() => setIsSidebarOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="left"
              open={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              sx={{ display: { md: 'none' } }}
            >
              <Box sx={{ width: 250, p: 2 }}>
                <InvoiceForm onClose={() => setIsSidebarOpen(false)} />
              </Box>
            </Drawer>

            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                display: { xs: 'none', md: 'block' }
              }}
            >
              <InvoiceForm />
            </Box>

            <Box
              sx={{
                flex: 1,
                overflow: 'auto'
              }}
            >
              <PdfViewer />
            </Box>
          </Box>

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                bgcolor: '#28a745',
                '&:hover': { bgcolor: '#218c3b' }
              }}
            >
              Generate PDF
            </Button>
          </Box>
        </form>
      </Container>
    </FormProvider>
  );
};

export default CreateInvoiceForm;
