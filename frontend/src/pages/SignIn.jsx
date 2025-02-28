import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModelconDropdown';
import ForgotPasswordDialog from '../components/ForgotPasswordDialog';
import { login } from '../services/api';
import { UserContext } from '../contexts/UserContext';

const Card = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '450px' },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
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

export default function SignIn(props) {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);

  const navigate = useNavigate();
  const { refreshUser } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    let valid = true;
    if (!emailInput.value || !/\S+@\S+\.\S+/.test(emailInput.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      valid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
    if (!passwordInput.value || passwordInput.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      valid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
    if (!valid) return;
    try {
      const formData = new FormData(event.currentTarget);
      const userEmail = formData.get('email');
      const userPass = formData.get('password');
      const response = await login({ email: userEmail, password: userPass });
      localStorage.setItem('token', response.idToken);
      // Immediately refresh the user context after setting the token
      refreshUser();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setPasswordError(true);
      setPasswordErrorMessage('Invalid credentials or server error.');
    }
  };

  const handleForgotOpen = () => setForgotOpen(true);
  const handleForgotClose = () => setForgotOpen(false);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <Card>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                id="password"
                type="password"
                name="password"
                placeholder="••••••"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <ForgotPasswordDialog open={forgotOpen} handleClose={handleForgotClose} />
            <Button type="submit" fullWidth variant="contained">
              Sign in
            </Button>
          </Box>
          <Divider>or</Divider>
          <Stack spacing={2}>
            <Typography sx={{ textAlign: 'center' }}>
              Don't have an account?{' '}
              <Link href="/sign-up" variant="body2">
                Sign up
              </Link>
            </Typography>
          </Stack>
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
