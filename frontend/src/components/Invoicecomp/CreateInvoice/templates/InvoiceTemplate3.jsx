import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { formatNumberWithCommas } from '../lib/helpers';
import { motion } from 'framer-motion';

const formatDate = (val) => {
  if (!val) return 'N/A';
  const d = new Date(val);
  return isNaN(d) ? 'N/A' : d.toLocaleDateString();
};

const InvoiceTemplate3 = ({
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

  const invoiceDate = formatDate(details.invoiceDate);
  const dueDate = formatDate(details.dueDate);

  return (
    <Box
      sx={{
        p: 4,
        background:
          'linear-gradient(to bottom right, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: 8,
        width: '100%',
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
      aria-label="Invoice Template 3"
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

      {/* Header + Logo */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        <img
          src={logo || '/default-logo.png'}
          alt={`${sender.name || 'Company'} Logo`}
          style={{
            maxWidth: '150px',
            position: 'absolute',
            top: -20,
            left: 20
          }}
          aria-hidden="true"
          onError={(e) => {
            e.target.src = '/default-logo.png';
          }}
        />
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'Pacifico, cursive',
            color: theme.palette.text.primary,
            textAlign: 'center',
            mb: 2
          }}
        >
          Invoice
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Pacifico, cursive',
            color: theme.palette.text.secondary,
            textAlign: 'center'
          }}
        >
          Crafting Your Vision
        </Typography>
      </Box>

      <Box
        sx={{
          mb: 4,
          p: 2,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
        aria-labelledby="bill-to-header"
      >
        <Typography
          variant="h6"
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
      </Box>

      <Box sx={{ mb: 4 }} aria-labelledby="details-header">
        <Typography
          variant="h6"
          sx={{ color: theme.palette.text.primary }}
          id="details-header"
        >
          Details:
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary }}>
          Invoice #: {details.invoiceNumber || 'N/A'}
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary }}>
          Issue Date: {invoiceDate}
        </Typography>
        <Typography sx={{ color: theme.palette.text.secondary }}>
          Due Date: {dueDate}
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }} aria-labelledby="items-header">
        <Typography
          variant="h6"
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
                  p: 2,
                  mb: 2,
                  background: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                role="row"
                aria-label={`Item ${index + 1}: ${item.name}`}
              >
                <Typography sx={{ color: theme.palette.text.primary }}>
                  {item.name}
                  {item.description && ` - ${item.description}`}
                </Typography>
                <Typography
                  sx={{
                    fontStyle: 'italic',
                    color: theme.palette.text.secondary
                  }}
                >
                  Qty: {item.quantity} x ${item.unitPrice} = $
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

      <Typography
        variant="h5"
        sx={{
          fontFamily: 'Pacifico, cursive',
          color: hasMissingData
            ? '#ff4444'
            : theme.palette.text.primary,
          textAlign: 'right',
          mb: 4
        }}
        aria-live="polite"
      >
        Total: $
        {formatNumberWithCommas(totalAmount.toFixed(2))}{' '}
        {details.currency || 'USD'}
      </Typography>

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
            style={{
              maxWidth: '200px',
              border: '1px solid #ccc',
              padding: 5
            }}
            aria-hidden="true"
          />
        </Box>
      )}

      <Box
        sx={{
          mt: 4,
          textAlign: 'center',
          color: theme.palette.text.secondary
        }}
      >
        <Typography sx={{ fontFamily: 'Pacifico, cursive' }}>
          Made with Love by {sender.name}
        </Typography>
      </Box>
    </Box>
  );
};

export default InvoiceTemplate3;
