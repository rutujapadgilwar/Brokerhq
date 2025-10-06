import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Button, Stack, styled } from '@mui/material';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import WatchlistPage from './components/dashboard/WatchlistPage';
import AlertsPage from './components/dashboard/AlertsPage';
import SettingsPage from './components/dashboard/SettingsPage';
import TasksPage from './components/dashboard/TasksPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import TenantDetailsPage from './pages/TenantDetailsPage';
import BuyerDetailsPage from './pages/BuyerDetailsPage';
import MainDashboard from './components/dashboard/MainDashboard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import IndustryNewsDashboard from './pages/IndustryNewsDashboard';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e40af',
    },
    secondary: {
      main: '#3b82f6',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

const RoleButton = styled(Button)(({ theme, active }) => ({
  minWidth: '160px',
  height: '48px',
  borderRadius: '12px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  padding: '8px 24px',
  transition: 'all 0.3s ease',
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  border: active ? 'none' : `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.action.hover,
    transform: 'translateY(-2px)',
    boxShadow: active ? theme.shadows[4] : 'none',
  },
  '& .MuiButton-startIcon': {
    marginRight: '8px',
  },
}));

function App() {
  const [selectedRole, setSelectedRole] = useState('properties');
  const [filters, setFilters] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('demoLoggedIn') === 'true';
    if (loggedIn) {
      setIsLoggedIn(true);
      const onboardingDone = localStorage.getItem('demoOnboardingComplete') === 'true';
      setIsOnboardingComplete(onboardingDone);
    }
  }, []);

  const handleLoginSuccess = (isFirstLogin) => {
    setIsLoggedIn(true);
    if (isFirstLogin) {
      setIsOnboardingComplete(false);
    } else {
      setIsOnboardingComplete(true);
    }
    localStorage.setItem('demoLoggedIn', 'true');
  };

  const handleOnboardingComplete = () => {
    console.log('Onboarding completed');
    setIsOnboardingComplete(true);
    localStorage.setItem('demoOnboardingComplete', 'true');
    navigate('/dashboard');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </ThemeProvider>
    );
  }

  if (!isOnboardingComplete) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/dashboard/properties" element={<DashboardLayout />} />
        <Route path="/tenant" element={<DashboardLayout />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/property/:id" element={<PropertyDetailsPage />} />
        <Route path="/tenant/:id" element={<TenantDetailsPage />} />
        <Route path="/buyer/:id" element={<BuyerDetailsPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/industry" element={<IndustryNewsDashboard/>} />
      </Routes>
      {/* {isLoggedIn && <Chatbot />} */}
    </ThemeProvider>
  );
}

export default App;
