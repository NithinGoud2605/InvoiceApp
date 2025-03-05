import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Checkbox, MenuItem } from '@mui/material';

export default function MissingInfoModal({
  open,
  missingFields,
  onSubmit,
  onClose,
  existingClients
}) {
  // Example local state
  const [formData, setFormData] = React.useState({
    planName: '',
    startDate: '',
    endDate: '',
    billingCycle: '',
    autoRenew: false,
    clientId: '',
  });

  React.useEffect(() => {
    // Reset form on open
    if (open) {
      setFormData({
        planName: '',
        startDate: '',
        endDate: '',
        billingCycle: '',
        autoRenew: false,
        clientId: '',
      });
    }
  }, [open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Missing Contract Details</DialogTitle>
      <DialogContent dividers>
        {missingFields.includes('planName') && (
          <TextField
            label="Plan Name"
            value={formData.planName}
            onChange={(e) => handleChange('planName', e.target.value)}
            fullWidth
            margin="normal"
          />
        )}

        {missingFields.includes('startDate') && (
          <TextField
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        )}

        {missingFields.includes('endDate') && (
          <TextField
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        )}

        {missingFields.includes('billingCycle') && (
          <TextField
            select
            label="Billing Cycle"
            value={formData.billingCycle}
            onChange={(e) => handleChange('billingCycle', e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="MONTHLY">Monthly</MenuItem>
            <MenuItem value="YEARLY">Yearly</MenuItem>
          </TextField>
        )}

        {missingFields.includes('autoRenew') && (
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.autoRenew}
                onChange={(e) => handleChange('autoRenew', e.target.checked)}
              />
            }
            label="Auto Renew"
          />
        )}

        {missingFields.includes('clientName') && existingClients.length > 0 && (
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
        )}

        {/* If the user must be able to create a new client from this modal, you can add more fields */}
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
