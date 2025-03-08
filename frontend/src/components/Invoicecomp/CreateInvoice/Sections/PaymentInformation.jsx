import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const PaymentInformation = () => {
  const { register } = useFormContext();
  const { t } = useTranslation();
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>{t("form.steps.paymentInfo.heading")}:</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          {...register('details.paymentInformation.bankName')}
          label={t("form.steps.paymentInfo.bankName")}
          placeholder={t("form.steps.paymentInfo.bankName")}
          fullWidth
          variant="outlined"
          size="small"
        />
        <TextField
          {...register('details.paymentInformation.accountName')}
          label={t("form.steps.paymentInfo.accountName")}
          placeholder={t("form.steps.paymentInfo.accountName")}
          fullWidth
          variant="outlined"
          size="small"
        />
        <TextField
          {...register('details.paymentInformation.accountNumber')}
          label={t("form.steps.paymentInfo.accountNumber")}
          placeholder={t("form.steps.paymentInfo.accountNumber")}
          fullWidth
          variant="outlined"
          size="small"
        />
      </Box>
    </Box>
  );
};

export default PaymentInformation;