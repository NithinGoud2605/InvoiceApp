// src/components/Invoicecomp/CreateInvoice/templates/InvoiceLayout.jsx
import React from 'react';
import { Container, Box } from '@mui/material';

const InvoiceLayout = ({ data, children }) => {
  const { details } = data;
  const fontHref = details.signature?.fontFamily
    ? `https://fonts.googleapis.com/css2?family=${details.signature.fontFamily}&display=swap`
    : '';

  return (
    <>
      {fontHref && <link href={fontHref} rel="stylesheet" />}
      <Container maxWidth="md" sx={{ p: 4, backgroundColor: '#fff', borderRadius: 2, boxShadow: 3, my: 4, fontFamily: 'Roboto, sans-serif' }}>
        {children}
      </Container>
    </>
  );
};

export default InvoiceLayout;