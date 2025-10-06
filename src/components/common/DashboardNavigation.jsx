import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentRole = () => {
    if (location.pathname.includes('/dashboard/properties') || location.pathname === '/dashboard') {
      return 'properties';
    } else if (location.pathname.includes('/tenant')) {
      return 'tenant';
    } else if (location.pathname.includes('/buyer')) {
      return 'buyer';
    }
    return 'properties';
  };

  const currentRole = getCurrentRole();

  const handleNavigation = (role) => {
    switch (role) {
      case 'properties':
        navigate('/dashboard/properties');
        break;
      case 'tenant':
        navigate('/tenant');
        break;
      case 'buyer':
        navigate('/buyer');
        break;
      default:
        navigate('/dashboard/properties');
    }
  };

  return (
    <Stack direction="row" spacing={0}>
      <Button
        variant={currentRole === 'properties' ? 'contained' : 'text'}
        onClick={() => handleNavigation('properties')}
        startIcon={<BusinessIcon />}
        sx={{
          bgcolor: currentRole === 'properties' ? 'primary.main' : 'grey.100',
          color: currentRole === 'properties' ? 'white' : 'grey.600',
          borderRadius: '8px 8px 0 0',
          mr: 0.25,
          '&:hover': {
            bgcolor: currentRole === 'properties' ? 'primary.dark' : 'grey.200',
          },
          textTransform: 'none',
          fontWeight: 600,
          px: 2,
        }}
      >
        PROPERTIES
      </Button>
      <Button
        variant={currentRole === 'tenant' ? 'contained' : 'text'}
        onClick={() => handleNavigation('tenant')}
        startIcon={<PeopleIcon />}
        sx={{
          bgcolor: currentRole === 'tenant' ? 'success.main' : 'grey.100',
          color: currentRole === 'tenant' ? 'white' : 'grey.600',
          borderRadius: '8px 8px 0 0',
          mr: 0.25,
          '&:hover': {
            bgcolor: currentRole === 'tenant' ? 'success.dark' : 'grey.200',
          },
          textTransform: 'none',
          fontWeight: 600,
          px: 2,
        }}
      >
        TENANT
      </Button>
      <Button
        variant={currentRole === 'buyer' ? 'contained' : 'text'}
        onClick={() => handleNavigation('buyer')}
        startIcon={<AccountBalanceIcon />}
        sx={{
          bgcolor: currentRole === 'buyer' ? 'warning.main' : 'grey.100',
          color: currentRole === 'buyer' ? 'white' : 'grey.600',
          borderRadius: '8px 8px 0 0',
          '&:hover': {
            bgcolor: currentRole === 'buyer' ? 'warning.dark' : 'grey.200',
          },
          textTransform: 'none',
          fontWeight: 600,
          px: 2,
        }}
      >
        BUYER
      </Button>
    </Stack>
  );
};

export default DashboardNavigation; 