// src/components/Invoicecomp/CreateInvoice/Signature/SignatureFontSelector.jsx
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SignatureFontSelector = ({ typedSignatureFonts, selectedFont, setSelectedFont }) => {
  return (
    <FormControl fullWidth variant="outlined" size="small">
      <InputLabel id="signature-font-label">Select Font</InputLabel>
      <Select
        labelId="signature-font-label"
        value={selectedFont?.variable || ''}
        label="Select Font"
        onChange={(e) => {
          const fontVariable = e.target.value;
          const selectedFontObject = typedSignatureFonts.find(font => font.variable === fontVariable);
          if (selectedFontObject) {
            setSelectedFont(selectedFontObject);
          }
        }}
      >
        {typedSignatureFonts.map((font) => (
          <MenuItem key={font.name} value={font.variable} style={{ fontFamily: font.variable }}>
            {font.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SignatureFontSelector;
