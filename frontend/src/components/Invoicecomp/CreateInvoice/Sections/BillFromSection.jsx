import React from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';

const BillFromSection = () => {
  const { control, register } = useFormContext();
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'sender.customInputs',
  });

  const addNewCustomInput = () => {
    append({ key: '', value: '' });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>{t("form.steps.fromAndTo.billFrom")}:</Typography>
      <TextField
        {...register('sender.name')}
        fullWidth
        label={t("form.steps.fromAndTo.name")}
        placeholder="Your name"
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
      />
      <TextField
        {...register('sender.address')}
        fullWidth
        label={t("form.steps.fromAndTo.address")}
        placeholder="Your address"
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
      />
      <TextField
        {...register('sender.zipCode')}
        label={t("form.steps.fromAndTo.zipCode")}
        placeholder="Zip code"
        variant="outlined"
        size="small"
        sx={{ width: '48%', mr: 2 }}
      />
      <TextField
        {...register('sender.city')}
        label={t("form.steps.fromAndTo.city")}
        placeholder="City"
        variant="outlined"
        size="small"
        sx={{ width: '48%' }}
      />
      <TextField
        {...register('sender.country')}
        label={t("form.steps.fromAndTo.country")}
        placeholder="Country"
        variant="outlined"
        size="small"
        sx={{ width: '48%', mt: 2 }}
      />
      <TextField
        {...register('sender.email')}
        fullWidth
        label={t("form.steps.fromAndTo.email")}
        placeholder="Email"
        variant="outlined"
        size="small"
        sx={{ mt: 2 }}
      />
      <TextField
        {...register('sender.phone')}
        label={t("form.steps.fromAndTo.phone")}
        placeholder="Phone"
        variant="outlined"
        size="small"
        sx={{ width: '48%', mt: 2 }}
      />
      {fields.map((field, index) => (
        <Box key={field.id} sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            {...register(`sender.customInputs[${index}].key`)}
            label="Custom Key"
            variant="outlined"
            size="small"
            sx={{ width: '30%' }}
          />
          <TextField
            {...register(`sender.customInputs[${index}].value`)}
            label="Custom Value"
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <Button variant="text" color="error" onClick={() => remove(index)}>
            Remove
          </Button>
        </Box>
      ))}
      <Button startIcon={<AddIcon />} variant="text" onClick={addNewCustomInput} sx={{ mt: 2 }}>
        {t("form.steps.fromAndTo.addCustomInput")}
      </Button>
    </Box>
  );
};

export default BillFromSection;