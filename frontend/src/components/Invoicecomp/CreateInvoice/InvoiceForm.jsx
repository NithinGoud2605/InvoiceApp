import React from 'react';
import { Wizard } from 'react-use-wizard';
import {
  Card,
  CardHeader,
  CardContent
} from '@mui/material';
import WizardStep from './Wizard/WizardStep';

// Section components
import BillFromSection from './Sections/BillFromSection';
import BillToSection from './Sections/BillToSection';
import InvoiceDetails from './Sections/InvoiceDetails';
import Items from './Sections/Items';
import PaymentInformation from './Sections/PaymentInformation';
import InvoiceSummary from './Sections/InvoiceSummary';
import Charges from './Sections/Charges';


const InvoiceForm = ({ onClose }) => {
  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3
      }}
    >
      <CardHeader
        title="Invoice Form"
        sx={{
          bgcolor: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0',
          '& .MuiTypography-root': {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333'
          }
        }}
      />
      <CardContent
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 3
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
        <Charges />
      </WizardStep>
      <WizardStep>
        <PaymentInformation />
      </WizardStep>
      <WizardStep>
        <InvoiceSummary onClose={onClose} />
      </WizardStep>
    </Wizard>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
