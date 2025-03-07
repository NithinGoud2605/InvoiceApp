// src/components/Invoicecomp/CreateInvoice/Sections/Charges.jsx
import React from 'react';
import { Box, TextField, Typography, Button, IconButton } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

const Charges = () => {
  const { control, register } = useFormContext();
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details.charges',
  });

  const addNewCharge = () => {
    append({ description: '', amount: 0, type: 'charge' }); // Default type as 'charge'
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t("form.steps.charges.heading") || "Additional Charges"}
      </Typography>
      {fields.map((field, index) => (
        <Box key={field.id} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <TextField
            {...register(`details.charges[${index}].description`)}
            label={t("form.steps.charges.description") || "Description"}
            variant="outlined"
            size="small"
            sx={{ flex: 2 }}
          />
          <TextField
            {...register(`details.charges[${index}].amount`)}
            label={t("form.steps.charges.amount") || "Amount"}
            type="number"
            variant="outlined"
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            select
            {...register(`details.charges[${index}].type`)}
            label={t("form.steps.charges.type") || "Type"}
            variant="outlined"
            size="small"
            sx={{ flex: 1 }}
            SelectProps={{ native: true }}
          >
            <option value="charge">{t("form.steps.charges.charge") || "Charge"}</option>
            <option value="discount">{t("form.steps.charges.discount") || "Discount"}</option>
            <option value="tax">{t("form.steps.charges.tax") || "Tax"}</option>
          </TextField>
          <IconButton color="error" onClick={() => remove(index)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        startIcon={<AddIcon />}
        variant="outlined"
        onClick={addNewCharge}
        sx={{ mt: 2 }}
      >
        {t("form.steps.charges.addCharge") || "Add Charge"}
      </Button>
    </Box>
  );
};

export default Charges;