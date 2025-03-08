import React, { useContext } from 'react';
import AppTheme from '../../../shared-theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import { InvoiceProvider } from './contexts/InvoiceContext';
import { SignatureProvider } from './contexts/SignatureContext';
import { TranslationProvider } from './contexts/TranslationContext';
import { ThemeContext } from '../../../shared-theme/ThemeContext';
import CreateInvoiceForm from './CreateInvoiceForm';

const CreateInvoicePage = () => {
  // If needed, we can read color mode or additional theme data from ThemeContext
  const { mode } = useContext(ThemeContext);

  // The AppTheme component presumably styles your entire app based on "mode"
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <TranslationProvider>
        <InvoiceProvider>
          <SignatureProvider>
            <CreateInvoiceForm />
          </SignatureProvider>
        </InvoiceProvider>
      </TranslationProvider>
    </AppTheme>
  );
};

export default CreateInvoicePage;
