import React, { Suspense, lazy, useMemo } from 'react';
import { Skeleton, Typography } from '@mui/material';
import InvoiceLayout from './InvoiceLayout';

// Fallback skeleton while the template loads
const DynamicInvoiceTemplateSkeleton = () => (
  <Skeleton variant="rectangular" sx={{ minHeight: '60rem' }} />
);

const DynamicInvoiceTemplate = (props) => {
  const { details } = props;

  // If no details or template is specified, bail out
  if (!details || !details.pdfTemplate) {
    return <Typography>No invoice template selected.</Typography>;
  }

  // Build dynamic component name
  const templateName = `InvoiceTemplate${details.pdfTemplate}`;

  // Use a memoized lazy import for the selected template
  const LazyInvoice = useMemo(
    () =>
      lazy(() =>
        import(`./${templateName}`).catch(() => ({
          default: () => (
            <Typography color="error">
              Template not found.
            </Typography>
          )
        }))
      ),
    [templateName]
  );

  // Use a default logo if none provided
  const defaultLogo =
    'https://via.placeholder.com/140x100?text=Company+Logo';

  return (
    <InvoiceLayout data={props}>
      <Suspense fallback={<DynamicInvoiceTemplateSkeleton />}>
        <LazyInvoice
          {...props}
          logo={details.invoiceLogo || defaultLogo}
        />
      </Suspense>
    </InvoiceLayout>
  );
};

export default DynamicInvoiceTemplate;
