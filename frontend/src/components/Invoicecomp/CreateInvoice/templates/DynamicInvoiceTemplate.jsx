import React, { Suspense, lazy, useMemo } from 'react';
import { Skeleton, Typography } from '@mui/material';
import InvoiceLayout from './InvoiceLayout';

// Fallback skeleton while the template lazily loads
const DynamicInvoiceTemplateSkeleton = () => (
  <Skeleton variant="rectangular" sx={{ minHeight: '60rem' }} />
);

const DynamicInvoiceTemplate = (props) => {
  const { details } = props;

  // If no details or pdfTemplate specified, bail out
  if (!details || !details.pdfTemplate) {
    return <Typography>No invoice template selected.</Typography>;
  }

  // Build dynamic import name
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

  // Instead of referencing "via.placeholder.com", use a small base64 as a fallback
  const defaultLogo = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAUCAMAAAALrs4gAAAABlBMVEX///9mZ2f4F6bzAAAAy0lEQVQ4y2NgoCJ8AAAETAJkLzoBgBX1G+BQAAN1og6RR92KAJ8gf9D/2W8AXyB/0P/ZbwBfIH/Q/9lvAF8gf9D/2W8AXyB/0P/ZbwBfIH/Q/9lvAH0XlI9QDrw4zD83yiO/9r3ci99r3chDkGjvI0qhmLxA1hI8QG3kxhhwBfIH/Q/9lvAF8gf9D/2W+GRwFrg0GD/XkABx9F8DGcoDUwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wNC0yNVQxNDoyMzoyMyswMDowMAIPHWcAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDQtMjVUMTQ6MjM6MjMrMDA6MDBPuQVJAAAAAElFTkSuQmCC`;

  return (
    <InvoiceLayout data={props}>
      <Suspense fallback={<DynamicInvoiceTemplateSkeleton />}>
        <LazyInvoice
          {...props}
          // If details.invoiceLogo is missing, we use defaultLogo
          logo={details.invoiceLogo || defaultLogo}
        />
      </Suspense>
    </InvoiceLayout>
  );
};

export default DynamicInvoiceTemplate;
