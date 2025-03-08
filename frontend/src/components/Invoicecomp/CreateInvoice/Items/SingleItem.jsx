import React, { useEffect } from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormContext, useWatch } from 'react-hook-form';

// Example utility if you want to format totals with commas.
// import { formatNumberWithCommas } from 'path/to/your/utils';

const SingleItem = React.memo(({
  name,
  index,
  // Not used in this code, but maybe needed in parent
  fields,
  field,
  moveFieldUp,
  moveFieldDown,
  removeField,
}) => {
  const { control, setValue, register } = useFormContext();

  // Option A: separate watchers (current approach)
  const itemName = useWatch({ name: `${name}[${index}].name`, control });
  const rate = useWatch({ name: `${name}[${index}].unitPrice`, control });
  const quantity = useWatch({ name: `${name}[${index}].quantity`, control });
  const total = useWatch({ name: `${name}[${index}].total`, control });
  const currency = useWatch({ name: 'details.currency', control });

  // Option B: single watch object (uncomment to try this approach)
  // const rowData = useWatch({
  //   name: `${name}[${index}]`,
  //   control,
  // });
  // const { name: itemName, quantity, unitPrice: rate, total, /* other fields */ } = rowData || {};
  // const currency = useWatch({ name: 'details.currency', control });

  // -- Calculate total on changes to quantity or rate
  useEffect(() => {
    const parsedRate = parseFloat(rate) || 0;
    const parsedQuantity = parseFloat(quantity) || 0;
    const calculatedTotal = Number(parsedRate * parsedQuantity).toFixed(2);

    setValue(`${name}[${index}].total`, calculatedTotal);
  }, [rate, quantity, name, index, setValue]);

  // -- Make the item sortable
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      // MUI’s `sx` prop can combine style objects with your custom styles:
      sx={{
        ...style,
        border: '1px solid #e0e0e0',
        p: 2,
        mb: 2,
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      {/* Title row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 1,
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>
          {itemName
            ? `#${index + 1} - ${itemName}`
            : `#${index + 1} - Empty name`}
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

      {/* Form fields row */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {/* Name Field */}
        <TextField
          {...register(`${name}[${index}].name`)}
          label="Item Name"
          placeholder="Item name"
          fullWidth
          variant="outlined"
          size="small"
        />

        {/* Quantity Field */}
        <TextField
          {...register(`${name}[${index}].quantity`)}
          label="Quantity"
          type="number"
          variant="outlined"
          size="small"
          sx={{ width: 120 }}
          inputProps={{ min: 0 }}
        />

        {/* Rate Field */}
        <TextField
          {...register(`${name}[${index}].unitPrice`)}
          label="Rate"
          type="number"
          variant="outlined"
          size="small"
          sx={{ width: 120 }}
          inputProps={{ min: 0, step: '0.01' }}
        />

        {/* Total Field (read-only) */}
        <TextField
          label="Total"
          // If you want to format the total with commas:
          // value={`${formatNumberWithCommas(total || 0)} ${currency || ''}`}
          value={`${total || 0} ${currency || ''}`}
          InputProps={{ readOnly: true }}
          variant="outlined"
          size="small"
          sx={{ width: 150 }}
        />
      </Box>
    </Box>
  );
});

export default SingleItem;
