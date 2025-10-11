import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import DashboardNavigation from '../common/DashboardNavigation';
import ProspectingDashboard from './ProspectingDashboard';
import TenantDashboard from './TenantDashboard';
import BuyerDashboard from './BuyerDashboard';
import Navbar from './Navbar';
import { styled } from '@mui/material/styles';

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: 'white',
  textTransform: 'none',
  fontWeight: 500,
  padding: '10px 24px',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
    boxShadow: theme.shadows[4],
    transform: 'translateY(-1px)',
  },
}));

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch] = useState("");

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

  const getSearchPlaceholder = () => {
    const role = getCurrentRole();
    switch (role) {
      case 'properties':
        return 'Search properties, owners, or addresses...';
      case 'tenant':
        return 'Search tenants, companies, or industries...';
      case 'buyer':
        return 'Search buyers, companies, or investment types...';
      default:
        return 'Search...';
    }
  };

  const getExportButtonText = () => {
    const role = getCurrentRole();
    switch (role) {
      case 'properties':
        return 'Export Properties';
      case 'tenant':
        return 'Export Tenants';
      case 'buyer':
        return 'Export Buyers';
      default:
        return 'Export CSV';
    }
  };

  const renderDashboardContent = () => {
  const role = getCurrentRole();
  switch (role) {
    case 'properties':
      return <ProspectingDashboard viewMode={viewMode} setViewMode={setViewMode} search={search} />;
    case 'tenant':
      return <TenantDashboard viewMode={viewMode} setViewMode={setViewMode} search={search} />;
    case 'buyer':
      return <BuyerDashboard viewMode={viewMode} setViewMode={setViewMode} search={search} />;
    default:
      return <ProspectingDashboard viewMode={viewMode} setViewMode={setViewMode} search={search} />;
  }
};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Original Navbar */}
      <Navbar />
      
      {/* Dashboard Navigation Bar */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: 1,
          borderColor: 'grey.200',
          display: 'flex',
          alignItems: 'center',
          px: 2.5,
          py: 1,
          boxShadow: 1,
          marginTop: '64px',
          borderRadius: '5px'
        }}
      >
        
        {/* <DashboardNavigation /> */}

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder={getSearchPlaceholder()}
            size="small"
            sx={{ width: 600 }}
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'grey.500' }} />,
            }}
          />
          {/* <GradientButton
            startIcon={<ExportIcon />}
            sx={{ minWidth: 150 }}
          >
            {getExportButtonText()}
          </GradientButton> */}
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', bgcolor: 'grey.50' }}>
        {renderDashboardContent()}
      </Box>
    </Box>
  );
};

export default DashboardLayout; 