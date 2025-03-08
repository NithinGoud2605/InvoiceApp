import React, { useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import TextFieldWrapper from './TextFieldWrapper';

const BillFromSection = () => {
  const { control, setValue } = useFormContext();
  const { t } = useTranslation();

  // Manage dynamic array fields for custom inputs
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'sender.customInputs'
  });

  const handleAddNewCustomInput = useCallback(() => {
    append({ key: '', value: '' });
  }, [append]);

  const handleRemoveCustomInput = useCallback(
    (index) => {
      remove(index);
    },
    [remove]
  );

  // Handle uploading a company logo for the "sender"
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setValue('sender.logo', ev.target.result, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t('form.steps.fromAndTo.billFrom') || 'Bill From'}:
      </Typography>

      <TextFieldWrapper
        name="sender.name"
        label={t('form.steps.fromAndTo.name')}
        placeholder="Your name"
        fullWidth
        sx={{ mb: 2 }}
        validation={{ required: 'Name is required' }}
      />

      <TextFieldWrapper
        name="sender.address"
        label={t('form.steps.fromAndTo.address')}
        placeholder="Your address"
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextFieldWrapper
        name="sender.zipCode"
        label={t('form.steps.fromAndTo.zipCode')}
        placeholder="Zip code"
        sx={{ width: '48%', mr: 2 }}
      />

      <TextFieldWrapper
        name="sender.city"
        label={t('form.steps.fromAndTo.city')}
        placeholder="City"
        sx={{ width: '48%' }}
      />

      <TextFieldWrapper
        name="sender.country"
        label={t('form.steps.fromAndTo.country')}
        placeholder="Country"
        sx={{ width: '48%', mt: 2 }}
      />

      <TextFieldWrapper
        name="sender.email"
        label={t('form.steps.fromAndTo.email')}
        placeholder="Email"
        fullWidth
        sx={{ mt: 2 }}
        validation={{
          required: 'Email is required',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Invalid email'
          }
        }}
      />

      <TextFieldWrapper
        name="sender.phone"
        label={t('form.steps.fromAndTo.phone')}
        placeholder="Phone"
        sx={{ width: '48%', mt: 2 }}
      />

      {/* Company Logo Upload Field */}
      <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1">Company Logo</Typography>
      <input type="file" accept="image/*" onChange={handleLogoUpload} />
    </Box>

      {/* Dynamic Custom Inputs */}
      {fields.map((field, index) => (
        <Box key={field.id} sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextFieldWrapper
            name={`sender.customInputs[${index}].key`}
            label="Custom Key"
            sx={{ width: '30%' }}
          />
          <TextFieldWrapper
            name={`sender.customInputs[${index}].value`}
            label="Custom Value"
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="text"
            color="error"
            onClick={() => handleRemoveCustomInput(index)}
          >
            Remove
          </Button>
        </Box>
      ))}

      <Button
        startIcon={<AddIcon />}
        variant="text"
        onClick={handleAddNewCustomInput}
        sx={{ mt: 2 }}
      >
        {t('form.steps.fromAndTo.addCustomInput') || 'Add Custom Input'}
      </Button>
    </Box>
  );
};

export default BillFromSection;
