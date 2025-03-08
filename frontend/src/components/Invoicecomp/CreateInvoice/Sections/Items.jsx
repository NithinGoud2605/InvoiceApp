import React, { useCallback } from 'react';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import SingleItem from '../Items/SingleItem';

const Items = () => {
  const { control } = useFormContext();
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 600px)');

  // Manage the array of items
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'details.items'
  });

  const handleAddNewField = useCallback(() => {
    append({ name: '', description: '', quantity: 0, unitPrice: 0, total: 0 });
  }, [append]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {t('form.steps.lineItems.heading') || 'Items'}:
      </Typography>

      <Box sx={{ display: isMobile ? 'block' : 'flex', flexDirection: 'column', gap: 2 }}>
        {fields.map((field, index) => (
          <SingleItem
            key={field.id}
            name="details.items"
            index={index}
            fields={fields}
            field={field}
            moveFieldUp={(idx) => move(idx, idx - 1)}
            moveFieldDown={(idx) => move(idx, idx + 1)}
            removeField={remove}
          />
        ))}
      </Box>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddNewField}
        sx={{
          mt: 2,
          borderColor: '#28a745',
          color: '#28a745',
          '&:hover': {
            borderColor: '#218838',
            backgroundColor: '#e6f4ea'
          }
        }}
      >
        {t('form.steps.lineItems.addNewItem') || 'Add Item'}
      </Button>
    </Box>
  );
};

export default Items;
