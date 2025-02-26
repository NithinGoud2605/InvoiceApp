// src/components/Dashcomp/SelectContent.jsx
import React from 'react';
import { Select, MenuItem, ListSubheader } from '@mui/material';

export default function SelectContent() {
  const [value, setValue] = React.useState('sitemark-web');

  const handleChange = (e) => {
    setValue(e.target.value);
    // fetch or filter data based on new value if needed
  };

  return (
    <Select
      fullWidth
      size="small"
      value={value}
      onChange={handleChange}
    >
      <ListSubheader>Companies</ListSubheader>
      <MenuItem value="sitemark-web">TestCompany</MenuItem>
      <MenuItem value="sitemark-app">2</MenuItem>
</Select>
  );
}
