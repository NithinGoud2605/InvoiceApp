import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  Button, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, TextField 
} from '@mui/material';
import { forgotPassword, confirmForgotPassword } from '../services/api';

function ForgotPasswordDialog({ open, handleClose }) {
  const [step, setStep] = useState(1); // 1: Request code, 2: Confirm reset
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Forgot password failed');
    }
  };

  const handleConfirmSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const data = await confirmForgotPassword(email, code, newPassword);
      setMessage(data.message);
      // Optionally, close the dialog after a successful reset
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset confirmation failed');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {step === 1 ? (
        <form onSubmit={handleRequestSubmit}>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter your email address to receive a password reset code.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <DialogContentText color="error">{error}</DialogContentText>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Send Code</Button>
          </DialogActions>
        </form>
      ) : (
        <form onSubmit={handleConfirmSubmit}>
          <DialogTitle>Confirm Password Reset</DialogTitle>
          <DialogContent>
            <DialogContentText>
              A reset code has been sent to {email}. Please enter the code along with your new password.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Reset Code"
              type="text"
              fullWidth
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <TextField
              margin="dense"
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {error && <DialogContentText color="error">{error}</DialogContentText>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Reset Password</Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}

ForgotPasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ForgotPasswordDialog;
