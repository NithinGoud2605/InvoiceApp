// src/components/Invoicecomp/CreateInvoice/index.jsx
import React from 'react';
import { InvoiceProvider } from './contexts/InvoiceContext';
import { SignatureProvider } from './contexts/SignatureContext';
import { TranslationProvider } from './contexts/TranslationContext';
import CreateInvoiceForm from './CreateInvoiceForm';

const CreateInvoicePage = () => {
  return (
    <TranslationProvider>
      <InvoiceProvider>
        <SignatureProvider>
          <CreateInvoiceForm />
        </SignatureProvider>
      </InvoiceProvider>
    </TranslationProvider>
  );
};

export default CreateInvoicePage;