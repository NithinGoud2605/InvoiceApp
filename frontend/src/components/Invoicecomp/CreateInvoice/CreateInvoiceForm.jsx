import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Box,
  Button,
  Container,
  Drawer,
  IconButton
} from '@mui/material';
import InvoiceForm from './InvoiceForm';
import PdfViewer from './PdfViewer/PdfViewer';
import { useInvoiceContext } from './contexts/InvoiceContext';
import { FORM_FILL_VALUES } from './lib/variables';
import MenuIcon from '@mui/icons-material/Menu';

const drawerSx = {
  display: { md: 'none' }
};

const formContainerSx = {
  mt: 4,
  pb: 4
};

const layoutBoxSx = {
  display: 'flex',
  gap: 4,
  flexDirection: { xs: 'column', md: 'row' },
  height: 'calc(100vh - 120px)',
  overflow: 'hidden'
};

const sidebarBoxSx = {
  flex: 1,
  height: '100%',
  overflow: 'auto',
  border: '1px solid #e0e0e0',
  borderRadius: 2,
  display: { xs: 'none', md: 'block' }
};

const viewerBoxSx = {
  flex: 1,
  height: '100%',
  overflow: 'auto',
  border: '1px solid #e0e0e0',
  borderRadius: 2
};

const CreateInvoiceForm = () => {
  const { onFormSubmit } = useInvoiceContext();
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
    onFormSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <Container sx={formContainerSx}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Box sx={layoutBoxSx}>
            {/* Sidebar Toggle for Mobile */}
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
              sx={drawerSx}
            >
              <Box sx={{ width: 250, p: 2 }}>
                <InvoiceForm onClose={() => setIsSidebarOpen(false)} />
              </Box>
            </Drawer>

            {/* Main Form (for desktop) */}
            <Box sx={sidebarBoxSx}>
              <InvoiceForm />
            </Box>

            {/* PDF Preview */}
            <Box sx={viewerBoxSx}>
              <PdfViewer />
            </Box>
          </Box>

          {/* Submit Button */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
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
