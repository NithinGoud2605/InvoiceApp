import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { formatNumberWithCommas } from '../lib/helpers';
import { motion } from 'framer-motion';

const formatDate = (val) => {
  if (!val) return 'N/A';
  const d = new Date(val);
  return isNaN(d) ? 'N/A' : d.toLocaleDateString();
};

const InvoiceTemplate4 = ({
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

  // Format invoice & due dates
  const invoiceDate = formatDate(details.invoiceDate);
  const dueDate = formatDate(details.dueDate);

  return (
    <Box
      sx={{
        p: 4,
        fontFamily: 'Times New Roman, serif',
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
        ...(hasMissingData && {
          border: '2px solid #ff4444',
          p: 3
        })
      }}
      role="document"
      aria-label="Invoice Template 4"
    >
      {hasMissingData && (
        <Typography
          variant="body2"
          sx={{ color: '#ff4444', textAlign: 'center', mb: 2 }}
          aria-live="assertive"
        >
          Warning: No items added. Total may be inaccurate.
        </Typography>
      )}

      {/* Header with Logo and Company Info */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          borderBottom: '2px solid #000'
        }}
      >
        <img
          src={logo || '/default-logo.png'}
          alt={`${sender.name || 'Company'} Logo`}
          style={{ maxWidth: '140px', maxHeight: '100px' }}
          aria-hidden="true"
          onError={(e) => {
            e.target.src = '/default-logo.png';
          }}
        />
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
          >
            {sender.name || 'Company Name'}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            Excellence in Service
          </Typography>
        </Box>
      </Box>

      {/* Bill To & Invoice Details */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 4
        }}
      >
        {/* Bill To */}
        <Box aria-labelledby="bill-to-header">
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.text.primary
            }}
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
            {`${receiver.zipCode || ''} ${receiver.city || ''}`}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            {receiver.country}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            {receiver.email}
          </Typography>
        </Box>

        {/* Invoice Details */}
        <Box
          sx={{ textAlign: 'right' }}
          aria-labelledby="invoice-details-header"
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.text.primary
            }}
            id="invoice-details-header"
          >
            Invoice Details:
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            Invoice #: {details.invoiceNumber}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            Issue Date: {invoiceDate}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            Due Date: {dueDate}
          </Typography>
        </Box>
      </Box>

      {/* Items Section */}
      <Box sx={{ mb: 4 }} aria-labelledby="items-header">
        <Box sx={{ bgcolor: '#f5f5f5', p: 2, mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
            id="items-header"
          >
            Items:
          </Typography>
        </Box>

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
                  borderBottom: '1px solid #ddd'
                }}
                role="row"
                aria-label={`Item ${index + 1}: ${item.name}`}
              >
                <Typography sx={{ color: theme.palette.text.primary }}>
                  {item.name}
                </Typography>
                <Typography sx={{ color: theme.palette.text.primary }}>
                  {item.quantity}
                </Typography>
                <Typography sx={{ color: theme.palette.text.primary }}>
                  ${formatNumberWithCommas(item.unitPrice.toFixed(2))}
                </Typography>
                <Typography sx={{ color: theme.palette.text.primary }}>
                  $
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

        <Box
          sx={{
            mt: 2,
            textAlign: 'right',
            bgcolor: '#f5f5f5',
            p: 2
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: hasMissingData
                ? '#ff4444'
                : theme.palette.text.primary
            }}
            aria-live="polite"
          >
            Total: $
            {formatNumberWithCommas(totalAmount.toFixed(2))}{' '}
            {details.currency || 'USD'}
          </Typography>
        </Box>
      </Box>

      {/* Signature (if any) */}
      {details.signature?.data && (
        <Box sx={{ mt: 4 }} aria-labelledby="signature-header">
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
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

      {/* Footer or Additional Info */}
      <Box
        sx={{
          mt: 4,
          textAlign: 'center',
          color: theme.palette.text.secondary,
          fontSize: '12px'
        }}
      >
        <Typography>
          {sender.address || 'No address'} | Phone:{' '}
          {sender.phone || 'N/A'} | Email: {sender.email || 'N/A'} | Tax
          ID: 12345
        </Typography>
      </Box>
    </Box>
  );
};

export default InvoiceTemplate4;
