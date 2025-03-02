import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const MissingInfoModal = ({ open, missingFields, onSubmit, onClose }) => {
  // Create a state to hold user inputs for each missing field
  const [values, setValues] = useState({});

  // Reset form when missingFields change or modal is opened/closed
  useEffect(() => {
    if (open) {
      const initialValues = {};
      missingFields.forEach(field => {
        initialValues[field] = '';
      });
      setValues(initialValues);
    }
  }, [open, missingFields]);

  const handleChange = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Missing Invoice Details</DialogTitle>
      <DialogContent>
        {missingFields.map(field => {
          // Use a date picker if the field is "due date" (case-insensitive)
          const inputType = field.toLowerCase().includes('due') ? 'date' : 'text';
          return (
            <TextField
              key={field}
              label={field}
              type={inputType}
              value={values[field]}
              onChange={handleChange(field)}
              margin="dense"
              fullWidth
              variant="outlined"
              // For date fields, add helper text if needed
              InputLabelProps={inputType === 'date' ? { shrink: true } : {}}
            />
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MissingInfoModal;
