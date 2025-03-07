// src/components/Invoicecomp/CreateInvoice/Items/SingleItem.jsx
import React, { useEffect } from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormContext, useWatch } from 'react-hook-form';

const SingleItem = ({ name, index, fields, field, moveFieldUp, moveFieldDown, removeField }) => {
  const { control, setValue, register } = useFormContext();

  const itemName = useWatch({ name: `${name}[${index}].name`, control });
  const rate = useWatch({ name: `${name}[${index}].unitPrice`, control });
  const quantity = useWatch({ name: `${name}[${index}].quantity`, control });
  const total = useWatch({ name: `${name}[${index}].total`, control });
  const currency = useWatch({ name: 'details.currency', control });

  useEffect(() => {
    if (rate !== undefined && quantity !== undefined) {
      const calculatedTotal = (rate * quantity).toFixed(2);
      setValue(`${name}[${index}].total`, calculatedTotal);
    }
  }, [rate, quantity, name, index, setValue]);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  const style = { transition, transform: CSS.Transform.toString(transform) };

  return (
    <Box
      ref={setNodeRef}
      sx={{
        ...style,
        border: '1px solid #e0e0e0',
        p: 2,
        mb: 2,
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
        boxShadow: 1,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {itemName ? `#${index + 1} - ${itemName}` : `#${index + 1} - Empty name`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => moveFieldUp(index)} size="small" aria-label="Move up">
            <KeyboardArrowUpIcon />
          </IconButton>
          <IconButton onClick={() => moveFieldDown(index)} size="small" aria-label="Move down">
            <KeyboardArrowDownIcon />
          </IconButton>
          <IconButton onClick={() => removeField(index)} size="small" color="error" aria-label="Delete">
            <DeleteIcon />
          </IconButton>
          <IconButton {...attributes} {...listeners} size="small" aria-label="Drag">
            <DragIndicatorIcon />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          {...register(`${name}[${index}].name`)}
          label="Item Name"
          placeholder="Item name"
          fullWidth
          variant="outlined"
          size="small"
        />
        <TextField
          {...register(`${name}[${index}].quantity`)}
          label="Quantity"
          type="number"
          placeholder="Quantity"
          sx={{ width: 120 }}
          variant="outlined"
          size="small"
          inputProps={{ min: 0 }}
        />
        <TextField
          {...register(`${name}[${index}].unitPrice`)}
          label="Rate"
          type="number"
          placeholder="Rate"
          sx={{ width: 120 }}
          variant="outlined"
          size="small"
          inputProps={{ min: 0, step: '0.01' }}
        />
        <TextField
          label="Total"
          value={`${total || 0} ${currency || ''}`}
          InputProps={{ readOnly: true }}
          sx={{ width: 150 }}
          variant="outlined"
          size="small"
        />
      </Box>
    </Box>
  );
};

export default SingleItem;