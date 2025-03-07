import React from 'react';
import { Box, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useSignatureContext } from './SignatureContext';

const TypeSignature = ({ handleSaveSignature }) => {
  const { typedSignature, setTypedSignature, selectedFont, setSelectedFont } = useSignatureContext();

  const fonts = [
    { name: 'Dancing Script', value: "'Dancing Script', cursive" },
    { name: 'Great Vibes', value: "'Great Vibes', cursive" },
    { name: 'Sacramento', value: "'Sacramento', cursive" },
  ];

  return (
    <Box>
      <TextField
        label="Type your signature"
        value={typedSignature}
        onChange={(e) => setTypedSignature(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Font</InputLabel>
        <Select
          value={selectedFont.name}
          onChange={(e) => setSelectedFont(fonts.find((font) => font.name === e.target.value))}
        >
          {fonts.map((font) => (
            <MenuItem key={font.name} value={font.name} style={{ fontFamily: font.value }}>
              {font.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ fontFamily: selectedFont.value, fontSize: '2rem', mb: 2 }}>{typedSignature}</Box>
      <Button variant="contained" onClick={handleSaveSignature}>
        Save
      </Button>
    </Box>
  );
};

export default TypeSignature;