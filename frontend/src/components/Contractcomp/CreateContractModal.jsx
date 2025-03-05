import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import Swal from 'sweetalert2';
import { createContract, getAllClients, createClient } from '../../services/api';

export default function CreateContractModal({ open, onClose, onCreated }) {
  const [formData, setFormData] = React.useState({
    planName: '',
    startDate: '',
    endDate: '',
    billingCycle: '',
    autoRenew: false,
    clientId: '',
    newClientName: '',
  });

  const [clients, setClients] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      setFormData({
        planName: '',
        startDate: '',
        endDate: '',
        billingCycle: '',
        autoRenew: false,
        clientId: '',
        newClientName: '',
      });
      fetchClients();
    }
  }, [open]);

  const fetchClients = async () => {
    try {
      const data = await getAllClients();
      setClients(data.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    try {
      let actualClientId = formData.clientId;
      // If user typed a new client name
      if (!actualClientId && formData.newClientName) {
        const newClient = await createClient({ name: formData.newClientName });
        actualClientId = newClient.id;
      }

      await createContract({
        clientId: actualClientId || null,
        planName: formData.planName,
        startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        billingCycle: formData.billingCycle || null,
        autoRenew: formData.autoRenew,
      });

      Swal.fire({
        title: 'Success',
        text: 'Contract created successfully!',
        icon: 'success',
      });
      onCreated(); // triggers refetch in the parent
    } catch (error) {
      console.error('Error creating contract:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to create contract. Please try again.',
        icon: 'error',
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Contract</DialogTitle>
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
          label="Existing Client"
          value={formData.clientId}
          onChange={(e) => handleChange('clientId', e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="">-- Select Client --</MenuItem>
          {clients.map((client) => (
            <MenuItem key={client.id} value={client.id}>
              {client.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Or Create New Client"
          value={formData.newClientName}
          onChange={(e) => handleChange('newClientName', e.target.value)}
          fullWidth
          margin="normal"
          placeholder="Type new client name if needed"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
