import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { formatNumberWithCommas } from '../lib/helpers';
import { DATE_OPTIONS } from '../lib/variables';
import { motion } from 'framer-motion';

// Safely convert to date string
const formatDate = (val) => {
  if (!val) return 'N/A';
  const d = new Date(val);
  return isNaN(d) ? 'N/A' : d.toLocaleDateString('en-US', DATE_OPTIONS);
};

const InvoiceTemplate2 = ({
  sender = {},
  receiver = {},
  details = {},
  logo
}) => {
  const theme = useTheme();

  // Compute total from items
  const totalAmount =
    details.items?.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    ) || 0;

  const hasMissingData = !details.items?.length;

  // Basic framer-motion variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // Format invoice & due dates safely
  const invoiceDate = formatDate(details.invoiceDate);
  const dueDate = formatDate(details.dueDate);

  return (
    <Box
      sx={{
        p: 4,
        fontFamily: 'Montserrat, sans-serif',
        width: '100%',
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: 2,
        '@media print': {
          p: 2,
          boxShadow: 'none',
          border: 'none',
          bgcolor: '#fff'
        },
        // Optional highlight if no items
        ...(hasMissingData && {
          border: '2px solid #ff4444',
          p: 3
        })
      }}
      role="document"
      aria-label="Invoice Template 2"
    >
      {/* Warning if no items */}
      {hasMissingData && (
        <Typography
          variant="body2"
          sx={{ color: '#ff4444', textAlign: 'center', mb: 2 }}
          aria-live="assertive"
        >
          Warning: No items added. Total may be inaccurate.
        </Typography>
      )}

      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <img
            src={logo || '/default-logo.png'}
            alt={`${sender.name || 'Company'} Logo`}
            style={{ maxWidth: '140px', maxHeight: '100px' }}
            aria-hidden="true"
            onError={(e) => {
              e.target.src = '/default-logo.png';
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              mt: 2
            }}
          >
            Invoice #{details.invoiceNumber || 'N/A'}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="h5"
            sx={{ color: theme.palette.text.primary }}
          >
            Invoice
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            Issued: {invoiceDate}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            Due: {dueDate}
          </Typography>
          <Box
            component="address"
            sx={{ mt: 1, color: theme.palette.text.secondary }}
          >
            {sender.address}
            <br />
            {sender.zipCode}, {sender.city}
            <br />
            {sender.country}
          </Box>
        </Box>
      </Box>

      {/* Bill To */}
      <Box sx={{ mb: 4 }} aria-labelledby="bill-to-header">
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: theme.palette.text.primary }}
          id="bill-to-header"
        >
          Bill To:
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary }}>
          {receiver.name}
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary }}>
          {receiver.address}
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary }}>
          {receiver.zipCode} {receiver.city}
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary }}>
          {receiver.country}
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary }}>
          {receiver.email}
        </Typography>
      </Box>

      {/* Items */}
      <Box sx={{ mb: 4 }} aria-labelledby="items-header">
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: theme.palette.text.primary }}
          id="items-header"
        >
          Items:
        </Typography>
        {details.items?.length ? (
          details.items.map((item, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 1,
                  borderBottom: '1px dashed #ccc'
                }}
                role="row"
                aria-label={`Item ${index + 1}: ${item.name}`}
              >
                <Typography sx={{ color: theme.palette.text.primary }}>
                  {item.name}
                </Typography>
                <Typography sx={{ color: theme.palette.text.primary }}>
                  {item.quantity} x ${item.unitPrice} = $
                  {formatNumberWithCommas(
                    (item.quantity * item.unitPrice).toFixed(2)
                  )}
                </Typography>
              </Box>
            </motion.div>
          ))
        ) : (
          <Typography sx={{ color: theme.palette.text.secondary }}>
            No items added yet.
          </Typography>
        )}
      </Box>

      {/* Total */}
      <Box
        sx={{
          mb: 4,
          bgcolor: '#e3f2fd',
          p: 2,
          borderRadius: 2
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: '#1976d2' }}
          aria-live="polite"
        >
          Total: $
          {formatNumberWithCommas(totalAmount.toFixed(2))}{' '}
          {details.currency || 'USD'}
        </Typography>
      </Box>

      {/* Signature (if any) */}
      {details.signature?.data && (
        <Box sx={{ mt: 4 }} aria-labelledby="signature-header">
          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.primary }}
            id="signature-header"
          >
            Signature:
          </Typography>
          <img
            src={details.signature.data}
            alt="Signature"
            style={{ maxWidth: '200px' }}
            aria-hidden="true"
          />
        </Box>
      )}

      {/* Optional brand mark or additional branding */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <img
          src={logo || '/default-logo.png'}
          alt={`${sender.name || 'Company'} Brand Mark`}
          style={{ maxWidth: '50px', opacity: 0.5 }}
          aria-hidden="true"
          onError={(e) => {
            e.target.src = '/default-logo.png';
          }}
        />
      </Box>
    </Box>
  );
};

export default InvoiceTemplate2;
