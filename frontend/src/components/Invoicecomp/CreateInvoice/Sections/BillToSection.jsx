import React from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';

const BillToSection = () => {
  const { control, register } = useFormContext();
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'receiver.customInputs',
  });

  const addNewCustomInput = () => {
    append({ key: '', value: '' });
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>{t("form.steps.fromAndTo.billTo")}:</Typography>
      <TextField
        {...register('receiver.name')}
        fullWidth
        label={t("form.steps.fromAndTo.name")}
        placeholder="Receiver name"
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
      />
      <TextField
        {...register('receiver.address')}
        fullWidth
        label={t("form.steps.fromAndTo.address")}
        placeholder="Receiver address"
        variant="outlined"
        size="small"
        sx={{ mb: 2 }}
      />
      <TextField
        {...register('receiver.zipCode')}
        label={t("form.steps.fromAndTo.zipCode")}
        placeholder="Zip code"
        variant="outlined"
        size="small"
        sx={{ width: '48%', mr: 2 }}
      />
      <TextField
        {...register('receiver.city')}
        label={t("form.steps.fromAndTo.city")}
        placeholder="City"
        variant="outlined"
        size="small"
        sx={{ width: '48%' }}
      />
      <TextField
        {...register('receiver.country')}
        label={t("form.steps.fromAndTo.country")}
        placeholder="Country"
        variant="outlined"
        size="small"
        sx={{ width: '48%', mt: 2 }}
      />
      <TextField
        {...register('receiver.email')}
        fullWidth
        label={t("form.steps.fromAndTo.email")}
        placeholder="Receiver email"
        variant="outlined"
        size="small"
        sx={{ mt: 2 }}
      />
      <TextField
        {...register('receiver.phone')}
        label={t("form.steps.fromAndTo.phone")}
        placeholder="Receiver phone"
        variant="outlined"
        size="small"
        sx={{ width: '48%', mt: 2 }}
      />
      {fields.map((field, index) => (
        <Box key={field.id} sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            {...register(`receiver.customInputs[${index}].key`)}
            label="Custom Key"
            variant="outlined"
            size="small"
            sx={{ width: '30%' }}
          />
          <TextField
            {...register(`receiver.customInputs[${index}].value`)}
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

export default BillToSection;