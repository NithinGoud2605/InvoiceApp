import React, { useCallback } from 'react';
import { Box, TextField, Typography, Button, IconButton } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

const Charges = () => {
  const {
    control,
    register,
    formState: { errors }
  } = useFormContext();
  const { t } = useTranslation();

  // Manage dynamic array for charges
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details.charges'
  });

  const handleAddNewCharge = useCallback(() => {
    append({
      description: '',
      amount: 0,
      type: 'charge'
    });
  }, [append]);

  const handleRemoveCharge = useCallback(
    (index) => {
      remove(index);
    },
    [remove]
  );

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t('form.steps.charges.heading', 'Additional Charges')}
      </Typography>

      {fields.map((field, index) => {
        const descriptionError =
          errors.details?.charges?.[index]?.description?.message;
        const amountError = errors.details?.charges?.[index]?.amount?.message;

        return (
          <Box
            key={field.id}
            sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
              alignItems: 'center'
            }}
          >
            <TextField
              {...register(`details.charges[${index}].description`, {
                required: t('form.steps.charges.descriptionRequired', 'Description is required')
              })}
              label={t('form.steps.charges.description', 'Description')}
              variant="outlined"
              size="small"
              sx={{ flex: 2 }}
              error={Boolean(descriptionError)}
              helperText={descriptionError}
            />

            <TextField
              {...register(`details.charges[${index}].amount`, {
                required: t('form.steps.charges.amountRequired', 'Amount is required'),
                min: {
                  value: 0,
                  message: t('form.steps.charges.amountPositive', 'Amount must be positive')
                }
              })}
              label={t('form.steps.charges.amount', 'Amount')}
              type="number"
              variant="outlined"
              size="small"
              sx={{ flex: 1 }}
              error={Boolean(amountError)}
              helperText={amountError}
            />

            <TextField
              select
              {...register(`details.charges[${index}].type`)}
              label={t('form.steps.charges.type', 'Type')}
              variant="outlined"
              size="small"
              sx={{ flex: 1 }}
              SelectProps={{ native: true }}
            >
              <option value="charge">
                {t('form.steps.charges.charge', 'Charge')}
              </option>
              <option value="discount">
                {t('form.steps.charges.discount', 'Discount')}
              </option>
              <option value="tax">
                {t('form.steps.charges.tax', 'Tax')}
              </option>
            </TextField>

            <IconButton
              color="error"
              onClick={() => handleRemoveCharge(index)}
              aria-label="Remove charge"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })}

      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        onClick={handleAddNewCharge}
        sx={{ mt: 2 }}
      >
        {t('form.steps.charges.addCharge', 'Add Charge')}
      </Button>
    </Box>
  );
};

export default Charges;
