import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';
// Removed specific icon imports as they will be replaced with image tags
// import GoogleIcon from '@mui/icons-material/Google';
// import MicrosoftIcon from '@mui/icons-material/Microsoft';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Custom styles for social login buttons
const SocialButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: '12px',
  marginBottom: '10px',
  textTransform: 'none',
  fontWeight: 500,
  justifyContent: 'flex-start',
  borderColor: theme.palette.grey[300],
  color: theme.palette.text.primary,
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(2),
  },
}));

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError(''); // Clear any previous errors

    // Demo login logic
    if (email === 'BrokerHQ' && password === 'BrokerHQ') {
      const isFirstLogin = !localStorage.getItem('demoOnboardingComplete');
      
      if (onLoginSuccess) {
        onLoginSuccess(isFirstLogin);
      }
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          textAlign: 'center',
          width: '100%',
          maxWidth: 400,
        }}
      >
        {/* Logo and BrokerHQ title */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <Box
            component="img"
            src="/brokerhq_icon.png"
            alt="BrokerHQ"
            sx={{
              width: 40,
              height: 40,
              mr: 1,
            }}
          />
          <Typography variant="h5" component="h1" fontWeight="bold">
            BrokerHQ
          </Typography>
        </Box>

        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          Log in
        </Typography>

        {/* Social Login Buttons */}
        <SocialButton variant="outlined" startIcon={<img src="/google.png" alt="Google Logo" style={{ height: 20, width: 'auto' }} />}>
          Continue with Google
        </SocialButton>
        <SocialButton variant="outlined" startIcon={<img src="/microsoft.png" alt="Microsoft Logo" style={{ height: 20, width: 'auto' }} />}>
          Continue with Microsoft
        </SocialButton>
        <SocialButton variant="outlined" startIcon={<img src="/linkedin.png" alt="LinkedIn Logo" style={{ height: 20, width: 'auto' }} />}>
          Continue with LinkedIn
        </SocialButton>

        {/* Error message */}
        {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}

        {/* Email and Password Fields */}
        <Box sx={{ mt: 3, mb: 2, textAlign: 'left' }}>
          <Typography variant="body2" fontWeight="medium" mb={0.5}>Email</Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            size="small"
            margin="dense"
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" fontWeight="medium">Password</Typography>
            <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </Box>
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            size="small"
            margin="dense"
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>

        {/* Log In Button */}
        <Button variant="contained" fullWidth size="large" onClick={handleLogin} sx={{ py: 1.5, fontWeight: 600 }}>
          Log in
        </Button>

        {/* Terms of Service */} 
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          By logging in, you agree to our{' '}
          <Link href="#" sx={{ textDecoration: 'none' }}>
            Terms of Service
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage; 