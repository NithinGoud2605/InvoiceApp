// src/components/Invoicecomp/CreateInvoice/Signature/SignatureColorSelector.jsx
import React from 'react';
import { IconButton, Box } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const SignatureColorSelector = ({ colors, selectedColor, handleColorButtonClick }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {colors.map((colorObj) => (
        <IconButton
          key={colorObj.color}
          onClick={() => handleColorButtonClick(colorObj.color)}
          sx={{
            backgroundColor: colorObj.color,
            border: selectedColor === colorObj.color ? '2px solid blue' : 'none',
            '&:hover': { backgroundColor: colorObj.color },
            width: 32,
            height: 32,
          }}
        >
          {selectedColor === colorObj.color && <CheckIcon sx={{ color: 'white', fontSize: 16 }} />}
        </IconButton>
      ))}
    </Box>
  );
};

export default SignatureColorSelector;
