import React, { useCallback } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TemplateSelector from '../TemplateSelector';

const InvoiceDetails = () => {
  const { control, register, setValue, watch } = useFormContext();
  const { t } = useTranslation();

  // We watch the "details.invoiceLogo" field so we can show a preview
  const uploadedLogo = watch('details.invoiceLogo');

  // Upload user-selected logo as a base64-encoded string
  const handleLogoUpload = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('details.invoiceLogo', reader.result, {
          shouldDirty: true
        });
      };
      reader.readAsDataURL(file);
    },
    [setValue]
  );

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t('form.steps.invoiceDetails.heading') || 'Invoice Details'}:
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {/* Invoice Number */}
        <TextField
          {...register('details.invoiceNumber')}
          label={t('form.steps.invoiceDetails.invoiceNumber')}
          placeholder="Invoice number"
          fullWidth
          variant="outlined"
          size="small"
        />

        {/* Invoice Date */}
        <Controller
          name="details.invoiceDate"
          control={control}
          render={({ field }) => (
            <ReactDatePicker
              selected={field.value ? new Date(field.value) : null}
              onChange={field.onChange}
              placeholderText={t('form.steps.invoiceDetails.issuedDate')}
              dateFormat="MM/dd/yyyy"
              customInput={
                <TextField
                  fullWidth
                  label={t('form.steps.invoiceDetails.issuedDate')}
                  variant="outlined"
                  size="small"
                />
              }
            />
          )}
        />

        {/* Due Date */}
        <Controller
          name="details.dueDate"
          control={control}
          render={({ field }) => (
            <ReactDatePicker
              selected={field.value ? new Date(field.value) : null}
              onChange={field.onChange}
              placeholderText={t('form.steps.invoiceDetails.dueDate')}
              dateFormat="MM/dd/yyyy"
              customInput={
                <TextField
                  fullWidth
                  label={t('form.steps.invoiceDetails.dueDate')}
                  variant="outlined"
                  size="small"
                />
              }
            />
          )}
        />

        {/* Currency */}
        <TextField
          {...register('details.currency')}
          label={t('form.steps.invoiceDetails.currency')}
          placeholder="Select Currency"
          fullWidth
          variant="outlined"
          size="small"
        />

        {/* Invoice Logo Upload */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {t('form.steps.invoiceDetails.companyLogo') || 'Company Logo:'}
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
          />

          {/* Preview the uploaded logo if we have it */}
          {uploadedLogo && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Logo Preview:</Typography>
              <img
                src={uploadedLogo}
                alt="Company Logo Preview"
                style={{
                  maxWidth: '150px',
                  maxHeight: '100px',
                  border: '1px solid #e0e0e0'
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Template Selector */}
      <Box sx={{ mt: 3 }}>
        <TemplateSelector />
      </Box>
    </Box>
  );
};

export default InvoiceDetails;
