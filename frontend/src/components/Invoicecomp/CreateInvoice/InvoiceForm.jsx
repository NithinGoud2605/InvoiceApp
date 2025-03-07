// src/components/Invoicecomp/CreateInvoice/InvoiceForm.jsx
import React from 'react';
import { Wizard } from 'react-use-wizard';
import WizardStep from './Wizard/WizardStep';
import BillFromSection from './Sections/BillFromSection';
import BillToSection from './Sections/BillToSection';
import InvoiceDetails from './Sections/InvoiceDetails';
import Items from './Sections/Items';
import PaymentInformation from './Sections/PaymentInformation';
import InvoiceSummary from './Sections/InvoiceSummary';
import { Card, CardHeader, CardContent } from '@mui/material';

const InvoiceForm = () => {
  return (
    <Card
      sx={{
        width: '100%',
        height: '100%', // Fill parent container
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
      }}
    >
      <CardHeader
        title="Invoice Form"
        sx={{ bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}
      />
      <CardContent
        sx={{
          flex: 1,
          overflow: 'auto', // Scroll if content overflows
          p: 3,
        }}
      >
        <Wizard>
          <WizardStep>
            <BillFromSection />
            <BillToSection />
          </WizardStep>
          <WizardStep>
            <InvoiceDetails />
          </WizardStep>
          <WizardStep>
            <Items />
          </WizardStep>
          <WizardStep>
            <PaymentInformation />
          </WizardStep>
          <WizardStep>
            <InvoiceSummary />
          </WizardStep>
        </Wizard>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;