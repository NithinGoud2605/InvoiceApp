import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';

const MissingInfoModal = ({ open, missingFields, onSubmit, onClose, existingClients = [] }) => {
  const [values, setValues] = useState({
    totalAmount: '',
    dueDate: '',
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
  });
  const [clientSelection, setClientSelection] = useState('');
  const [isNewClient, setIsNewClient] = useState(false);

  useEffect(() => {
    if (open) {
      console.log('Missing fields:', missingFields);
      setValues({
        totalAmount: '',
        dueDate: '',
        clientId: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
      });
      setClientSelection('');
      setIsNewClient(false);
    }
  }, [open, missingFields]);

  const handleChange = (field) => (e) => {
    console.log(`Changing ${field} to:`, e.target.value);
    setValues({ ...values, [field]: e.target.value });
  };

  const handleClientSelectChange = (e) => {
    const selectedValue = e.target.value;
    setClientSelection(selectedValue);
    setIsNewClient(selectedValue === 'new');
    if (selectedValue && selectedValue !== 'new') {
      const selectedClient = existingClients.find((client) => client.id === selectedValue);
      if (selectedClient) {
        setValues((prev) => ({
          ...prev,
          clientId: selectedClient.id,
          clientName: selectedClient.name,
          clientEmail: selectedClient.email || '',
          clientPhone: selectedClient.phone || '',
          clientAddress: selectedClient.address || '',
        }));
      }
    } else if (selectedValue === '' || selectedValue === 'new') {
      setValues((prev) => ({
        ...prev,
        clientId: '',
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
      }));
    }
  };

  const handleSubmit = () => {
    console.log('Form values before submission:', values);
    const data = {};

    // Handle totalAmount if missing
    if (missingFields.map(f => f.toLowerCase()).includes('totalamount')) {
      const parsedAmount = parseFloat(values.totalAmount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        alert('Please enter a valid amount.');
        return;
      }
      data.totalAmount = parsedAmount;
    }

    // Handle dueDate if missing
    if (missingFields.map(f => f.toLowerCase()).includes('duedate')) {
      if (!values.dueDate) {
        alert('Please enter a due date.');
        return;
      }
      data.dueDate = values.dueDate;
    }

    // Handle clientName if missing
    if (missingFields.map(f => f.toLowerCase()).includes('clientname')) {
      if (existingClients.length > 0) {
        if (clientSelection === 'new') {
          if (!values.clientName.trim() || !values.clientEmail.trim()) {
            alert('Please enter both the new client name and email.');
            return;
          }
          data.newClient = {
            name: values.clientName,
            email: values.clientEmail,
            phone: values.clientPhone || '',
            address: values.clientAddress || '',
          };
        } else if (clientSelection) {
          data.clientId = clientSelection;
        } else {
          alert('Please select a client or choose to create a new one.');
          return;
        }
      } else {
        if (!values.clientName.trim() || !values.clientEmail.trim()) {
          alert('Please enter both client name and email.');
          return;
        }
        data.newClient = {
          name: values.clientName,
          email: values.clientEmail,
          phone: values.clientPhone || '',
          address: values.clientAddress || '',
        };
      }
    }

    console.log('Submitting data from MissingInfoModal:', data);
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Missing Invoice Details</DialogTitle>
      <DialogContent>
        {missingFields.map((field) => {
          const lowerField = field.toLowerCase();
          if (lowerField === 'totalamount') {
            return (
              <TextField
                key={field}
                label="Amount"
                type="number"
                fullWidth
                margin="dense"
                variant="outlined"
                value={values.totalAmount}
                onChange={handleChange('totalAmount')}
                required
              />
            );
          }
          if (lowerField === 'duedate') {
            return (
              <TextField
                key={field}
                label="Due Date"
                type="date"
                fullWidth
                margin="dense"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={values.dueDate}
                onChange={handleChange('dueDate')}
                required
              />
            );
          }
          if (lowerField === 'clientname') {
            return (
              <React.Fragment key={field}>
                {existingClients.length > 0 && (
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="missing-client-label">Select Client</InputLabel>
                    <Select
                      labelId="missing-client-label"
                      value={clientSelection}
                      label="Select Client"
                      onChange={handleClientSelectChange}
                    >
                      <MenuItem value="">
                        <em>Select a client</em>
                      </MenuItem>
                      {existingClients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.name} ({client.email || 'No email'})
                        </MenuItem>
                      ))}
                      <MenuItem value="new">Create New Client</MenuItem>
                    </Select>
                  </FormControl>
                )}
                {(existingClients.length === 0 || isNewClient || !clientSelection) && (
                  <Box>
                    <TextField
                      label="Client Name"
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      value={values.clientName}
                      onChange={handleChange('clientName')}
                      required
                    />
                    <TextField
                      label="Client Email"
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      type="email"
                      value={values.clientEmail}
                      onChange={handleChange('clientEmail')}
                      required
                    />
                    <TextField
                      label="Client Phone"
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      value={values.clientPhone}
                      onChange={handleChange('clientPhone')}
                    />
                    <TextField
                      label="Client Address"
                      fullWidth
                      margin="dense"
                      variant="outlined"
                      value={values.clientAddress}
                      onChange={handleChange('clientAddress')}
                    />
                  </Box>
                )}
              </React.Fragment>
            );
          }
          const inputType = lowerField.includes('due') ? 'date' : 'text';
          return (
            <TextField
              key={field}
              label={field}
              type={inputType}
              fullWidth
              margin="dense"
              variant="outlined"
              value={values[field] || ''}
              onChange={handleChange(field)}
              InputLabelProps={inputType === 'date' ? { shrink: true } : {}}
            />
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MissingInfoModal;