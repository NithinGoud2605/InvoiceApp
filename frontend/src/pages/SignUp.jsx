import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Checkbox, CssBaseline, Divider, FormControl, FormControlLabel,
  FormLabel, Link, Stack, TextField, Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModelconDropdown';
import { register, confirmAccount } from '../services/api';

const Card = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: { width: '450px' },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: { padding: theme.spacing(4) },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props) {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const navigate = useNavigate();

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const name = document.getElementById('name');
    let isValid = true;
    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
    return isValid;
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;
    try {
      const data = new FormData(event.currentTarget);
      const userData = {
        name: data.get('name'),
        email: data.get('email'),
        password: data.get('password'),
      };
      await register(userData);
      setRegisteredEmail(userData.email);
      setIsVerificationStep(true);
    } catch (err) {
      console.error('Registration error:', err.response ? err.response.data : err.message);
      setEmailError(true);
      setEmailErrorMessage('Registration failed, please try again or use a different email.');
    }
  };

  const handleConfirmSubmit = async (event) => {
    event.preventDefault();
    try {
      await confirmAccount({ email: registeredEmail, code: verificationCode });
      navigate('/sign-in');
    } catch (err) {
      console.error('Confirmation error:', err.response ? err.response.data : err.message);
      setConfirmError('Confirmation failed, please check your code and try again.');
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            {isVerificationStep ? 'Confirm Registration' : 'Sign up'}
          </Typography>
          {isVerificationStep ? (
            <Box component="form" onSubmit={handleConfirmSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body1">
                A verification code has been sent to {registeredEmail}. Please enter it below.
              </Typography>
              <FormControl>
                <FormLabel htmlFor="verificationCode">Verification Code</FormLabel>
                <TextField
                  id="verificationCode"
                  name="verificationCode"
                  required
                  fullWidth
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </FormControl>
              {confirmError && <Typography color="error">{confirmError}</Typography>}
              <Button type="submit" fullWidth variant="contained">
                Confirm Registration
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleRegisterSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl>
                <FormLabel htmlFor="name">Full name</FormLabel>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  placeholder="Jon Snow"
                  error={nameError}
                  helperText={nameErrorMessage}
                  color={nameError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  required
                  fullWidth
                  id="email"
                  placeholder="your@email.com"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  error={emailError}
                  helperText={emailErrorMessage}
                  color={emailError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="outlined"
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  color={passwordError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive updates via email."
              />
              <Button type="submit" fullWidth variant="contained">
                Sign up
              </Button>
            </Box>
          )}
          {!isVerificationStep && (
            <>
              <Divider>
                <Typography sx={{ color: 'text.secondary' }}>or</Typography>
              </Divider>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography sx={{ textAlign: 'center' }}>
                  Already have an account?{' '}
                  <Link href="/sign-in" variant="body2" sx={{ alignSelf: 'center' }}>
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </>
          )}
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
