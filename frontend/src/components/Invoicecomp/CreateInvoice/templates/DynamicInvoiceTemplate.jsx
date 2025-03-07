// src/components/Invoicecomp/CreateInvoice/templates/DynamicInvoiceTemplate.jsx
import React, { Suspense, lazy, useMemo } from 'react';
import { Skeleton, Typography } from '@mui/material';
import InvoiceLayout from './InvoiceLayout';

const DynamicInvoiceTemplateSkeleton = () => (
  <Skeleton variant="rectangular" sx={{ minHeight: '60rem' }} />
);

const DynamicInvoiceTemplate = (props) => {
  const { details } = props;

  if (!details || !details.pdfTemplate) {
    return <Typography>No invoice template selected.</Typography>;
  }

  const templateName = `InvoiceTemplate${details.pdfTemplate}`;

  const LazyInvoice = useMemo(() =>
    lazy(() => import(`./${templateName}`).catch(() => ({ default: () => <Typography>Template not found.</Typography> }))),
    [templateName]
  );

  // Default logo if not provided (you can replace this with a dynamic logo URL from your app state)
  const defaultLogo = 'https://via.placeholder.com/140x100?text=Company+Logo'; // Replace with actual logo URL

  return (
    <InvoiceLayout data={props}>
      <Suspense fallback={<DynamicInvoiceTemplateSkeleton />}>
        <LazyInvoice {...props} logo={details.invoiceLogo || defaultLogo} />
      </Suspense>
    </InvoiceLayout>
  );
};

export default DynamicInvoiceTemplate;