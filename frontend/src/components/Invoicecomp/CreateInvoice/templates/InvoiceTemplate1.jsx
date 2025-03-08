import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

// Helper to compute total from items + charges
const calculateTotals = (items, charges) => {
  if (!items || !charges) {
    throw new Error('Items or charges data is missing');
  }

  const itemsTotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const chargesTotal = charges.reduce((sum, charge) => {
    const amount = Number(charge.amount) || 0;
    return charge.type === 'discount' ? sum - amount : sum + amount;
  }, 0);

  return itemsTotal + chargesTotal;
};

const InvoiceTemplate1 = ({
  sender = {},
  receiver = {},
  details = {},
  logo
}) => {
  const theme = useTheme();

  // Safely compute total
  let totalAmount = 0;
  try {
    totalAmount = calculateTotals(details.items || [], details.charges || []);
  } catch (error) {
    console.error('Error calculating totals:', error.message);
  }

  const hasMissingData =
    (!details.items || details.items.length === 0) &&
    (!details.charges || details.charges.length === 0);

  // Basic framer-motion variants for item animations
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: i * 0.05 // staggered
      }
    })
  };

  return (
    <Box
      sx={{
        p: 4,
        fontFamily: 'Roboto, sans-serif',
        width: '100%',
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: 2,
        position: 'relative',
        '@media print': {
          p: 2,
          boxShadow: 'none',
          border: 'none',
          bgcolor: '#fff'
        },
        // Optional: highlight if there are no items/charges
        ...(hasMissingData && {
          border: '2px solid #ff4444',
          p: 3
        })
      }}
      role="document"
      aria-label="Invoice Template 1"
    >
      {/* Header with Logo & Sender Info */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}
        aria-labelledby="company-header"
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
        <Box sx={{ textAlign: 'right' }} id="company-header">
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
          >
            {sender.name || 'Company Name'}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            {sender.address || 'Address'}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            {`${sender.zipCode || 'ZIP'} ${sender.city || 'City'}`}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            {sender.country || 'Country'}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            {sender.email || 'email@company.com'}
          </Typography>
        </Box>
      </Box>

      {/* Receiver & Invoice Info */}
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}
        aria-labelledby="invoice-details"
      >
        {/* Receiver Info */}
        <Box>
          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.primary }}
            id="bill-to-header"
          >
            Bill To:
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            {receiver.name || 'Client Name'}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            {receiver.address || 'Address'}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            {`${receiver.zipCode || 'ZIP'} ${
              receiver.city || 'City'
            }`}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            {receiver.country || 'Country'}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            {receiver.email || 'client@example.com'}
          </Typography>
        </Box>

        {/* Invoice Details */}
        <Box sx={{ textAlign: 'right' }} id="invoice-details">
          <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
            Invoice Details:
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            Invoice #: {details.invoiceNumber || 'N/A'}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            Issue Date: {details.invoiceDate || 'N/A'}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, mt: 0.5 }}>
            Due Date: {details.dueDate || 'N/A'}
          </Typography>
        </Box>
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
              custom={index}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 1,
                  borderBottom: '1px solid #e0e0e0'
                }}
                role="row"
                aria-label={`Item ${index + 1}: ${item.name}`}
              >
                <Typography sx={{ color: theme.palette.text.primary }}>
                  {item.name} {item.description && `- ${item.description}`}
                </Typography>
                <Typography sx={{ color: theme.palette.text.primary }}>
                  {item.quantity} x ${item.unitPrice.toFixed(2)} = $
                  {(item.quantity * item.unitPrice).toFixed(2)}
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

      {/* Charges */}
      {details.charges?.length > 0 && (
        <Box sx={{ mb: 4 }} aria-labelledby="charges-header">
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.text.primary }}
            id="charges-header"
          >
            Additional Charges:
          </Typography>
          {details.charges.map((charge, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 1,
                  borderBottom: '1px solid #e0e0e0'
                }}
                role="row"
                aria-label={`Charge ${index + 1}: ${charge.description}`}
              >
                <Typography sx={{ color: theme.palette.text.primary }}>
                  {charge.description} ({charge.type})
                </Typography>
                <Typography sx={{ color: theme.palette.text.primary }}>
                  {charge.type === 'discount' ? '-' : ''}
                  ${Number(charge.amount).toFixed(2)}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      )}

      {/* Total */}
      <Typography
        variant="h6"
        sx={{
          mb: 4,
          textAlign: 'right',
          color: hasMissingData
            ? '#ff4444'
            : theme.palette.success.main
        }}
        aria-live="polite"
      >
        Total: ${totalAmount.toFixed(2)} {details.currency || 'USD'}
      </Typography>

      {/* Signature */}
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

      {/* Footer / Thanks */}
      <Box
        sx={{
          mt: 4,
          textAlign: 'center',
          color: theme.palette.text.secondary
        }}
      >
        <Typography>Thank you for your business!</Typography>
      </Box>
    </Box>
  );
};

export default InvoiceTemplate1;
