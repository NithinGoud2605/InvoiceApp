import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, FormControlLabel, Checkbox } from '@mui/material';

export default function EditContractModal({
  open,
  contract,
  existingClients,
  onSubmit,
  onClose
}) {
  const [formData, setFormData] = React.useState({
    planName: '',
    startDate: '',
    endDate: '',
    billingCycle: '',
    autoRenew: false,
    clientId: '',
  });

  React.useEffect(() => {
    if (open && contract) {
      setFormData({
        planName: contract.planName || '',
        startDate: contract.startDate
          ? new Date(contract.startDate).toISOString().slice(0, 10)
          : '',
        endDate: contract.endDate
          ? new Date(contract.endDate).toISOString().slice(0, 10)
          : '',
        billingCycle: contract.billingCycle || '',
        autoRenew: !!contract.autoRenew,
        clientId: contract.clientId || '',
      });
    }
  }, [open, contract]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Convert start/end to actual date if needed
    const updatedData = { ...formData };
    if (formData.startDate) {
      updatedData.startDate = new Date(formData.startDate);
    }
    if (formData.endDate) {
      updatedData.endDate = new Date(formData.endDate);
    }
    onSubmit(updatedData);
  };

  if (!contract) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Contract</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Plan Name"
          value={formData.planName}
          onChange={(e) => handleChange('planName', e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={formData.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="Billing Cycle"
          value={formData.billingCycle}
          onChange={(e) => handleChange('billingCycle', e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="MONTHLY">Monthly</MenuItem>
          <MenuItem value="YEARLY">Yearly</MenuItem>
        </TextField>

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.autoRenew}
              onChange={(e) => handleChange('autoRenew', e.target.checked)}
            />
          }
          label="Auto Renew"
        />

        <TextField
          select
          label="Client"
          value={formData.clientId}
          onChange={(e) => handleChange('clientId', e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="">-- Select Client --</MenuItem>
          {existingClients.map((client) => (
            <MenuItem key={client.id} value={client.id}>
              {client.name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
