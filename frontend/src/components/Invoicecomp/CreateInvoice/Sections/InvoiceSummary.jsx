import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import SignatureModal from '../Signature/SignatureModal';

const InvoiceSummary = () => {
  const { register } = useFormContext();
  const { t } = useTranslation();
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>{t("form.steps.summary.heading")}:</Typography>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <SignatureModal />
        <TextField
          {...register('details.additionalNotes')}
          label={t("form.steps.summary.additionalNotes")}
          placeholder="Your additional notes"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          size="small"
        />
        <TextField
          {...register('details.paymentTerms')}
          label={t("form.steps.summary.paymentTerms")}
          placeholder="Ex: Net 30"
          fullWidth
          multiline
          rows={2}
          variant="outlined"
          size="small"
        />
      </Box>
    </Box>
  );
};

export default InvoiceSummary;