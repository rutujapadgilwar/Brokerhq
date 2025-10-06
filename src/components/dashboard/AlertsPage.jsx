import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  IconButton,
  Tooltip,
  styled,
  Divider,
  Badge,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Notifications as NotificationsIcon,
  TrendingDown as TrendingDownIcon,
  Work as WorkIcon,
  Handshake as HandshakeIcon,
  Construction as ConstructionIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import Navbar from './Navbar';

const StyledCard = styled(Card)(({ theme, severity }) => ({
  marginBottom: theme.spacing(2),
  borderLeft: `4px solid ${
    severity === 'critical' ? '#dc2626' :
    severity === 'urgent' ? '#d97706' :
    severity === 'important' ? '#3b82f6' :
    '#10b981'
  }`,
  background: severity === 'critical' ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.08), rgba(239, 68, 68, 0.04))' :
              severity === 'urgent' ? 'linear-gradient(135deg, rgba(217, 119, 6, 0.08), rgba(245, 158, 11, 0.04))' :
              severity === 'important' ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(99, 102, 241, 0.04))' :
              'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(34, 197, 94, 0.04))',
  backdropFilter: 'blur(20px)',
  borderRadius: 16,
  boxShadow: severity === 'critical' ? '0 8px 32px rgba(220, 38, 38, 0.15)' :
              severity === 'urgent' ? '0 8px 32px rgba(217, 119, 6, 0.15)' :
              severity === 'important' ? '0 8px 32px rgba(59, 130, 246, 0.15)' :
              '0 8px 32px rgba(16, 185, 129, 0.15)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  '&:hover': {
    transform: 'translateX(8px) translateY(-2px)',
    boxShadow: severity === 'critical' ? '0 16px 48px rgba(220, 38, 38, 0.25)' :
                severity === 'urgent' ? '0 16px 48px rgba(217, 119, 6, 0.25)' :
                severity === 'important' ? '0 16px 48px rgba(59, 130, 246, 0.25)' :
                '0 16px 48px rgba(16, 185, 129, 0.25)',
  },
}));

const AlertIcon = styled(Avatar)(({ theme, severity }) => ({
  width: 48,
  height: 48,
  background: severity === 'critical' ? 'linear-gradient(135deg, #fee2e2, #fecaca)' :
              severity === 'urgent' ? 'linear-gradient(135deg, #fef3c7, #fed7aa)' :
              severity === 'important' ? 'linear-gradient(135deg, #dbeafe, #bfdbfe)' :
              'linear-gradient(135deg, #dcfce7, #bbf7d0)',
  color: severity === 'critical' ? '#dc2626' :
         severity === 'urgent' ? '#d97706' :
         severity === 'important' ? '#3b82f6' :
         '#16a34a',
  boxShadow: severity === 'critical' ? '0 4px 16px rgba(220, 38, 38, 0.3)' :
              severity === 'urgent' ? '0 4px 16px rgba(217, 119, 6, 0.3)' :
              severity === 'important' ? '0 4px 16px rgba(59, 130, 246, 0.3)' :
              '0 4px 16px rgba(16, 185, 129, 0.3)',
  fontSize: '1.2rem',
  fontWeight: 600,
}));

const SummaryCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(254, 226, 226, 0.9), rgba(254, 202, 202, 0.9))',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(248, 113, 113, 0.3)',
  borderRadius: 20,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: '0 12px 40px rgba(220, 38, 38, 0.15)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
    animation: 'shimmer 3s infinite',
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(20px)',
  borderRadius: 16,
  padding: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  '& .MuiFormControlLabel-root': {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(0.5),
    borderRadius: 8,
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(59, 130, 246, 0.05)',
    },
  },
}));

const ModernButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: 12,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.75rem',
  padding: '6px 12px',
  boxShadow: variant === 'contained' ? '0 4px 16px rgba(0, 0, 0, 0.15)' : 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: variant === 'contained' ? '0 8px 24px rgba(0, 0, 0, 0.2)' : '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 320,
  padding: theme.spacing(3),
  borderRight: '1px solid rgba(255, 255, 255, 0.2)',
  overflowY: 'auto',
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.8))',
  backdropFilter: 'blur(20px)',
  boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(255, 255, 255, 0.8))',
  backdropFilter: 'blur(20px)',
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const AlertsFeedContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(3),
  background: 'transparent',
}));

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({
    critical: true,
    urgent: true,
    important: true,
    info: false,
    watchlist: true,
    market: true,
    opportunities: false,
    competitive: false,
    aiMonitoring: true,
    publicRecords: false,
    marketData: false,
  });
  const [timeFilter, setTimeFilter] = useState('24h');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAlerts([
        {
          id: '1',
          severity: 'critical',
          title: 'LOAN MATURITY CRISIS - Immediate Action Required',
          description: '555 California Street - $450M construction loan matures in 60 days. Partnership litigation escalating. Prime opportunity for emergency bridge financing solution.',
          time: '8 minutes ago',
          source: 'AI Monitoring',
          sourceType: 'Deed of Trust Analysis',
          watchlist: true,
          new: true,
          icon: '🚨',
        },
        {
          id: '2',
          severity: 'urgent',
          title: 'FUNDING EVENT - TechFlow Dynamics Series B',
          description: 'TechFlow Dynamics announced $35M Series B funding. 67 new job postings this week. Lease expires Q2 2025. Perfect storm for immediate expansion.',
          time: '23 minutes ago',
          source: 'Press Release',
          sourceType: 'Job Board Analysis',
          watchlist: true,
          new: true,
          icon: '🔥',
        },
        {
          id: '3',
          severity: 'critical',
          title: '1031 EXCHANGE DEADLINE - 90 Days Remaining',
          description: 'Meridian Capital Partners sold Portland asset for $45M. 1031 deadline February 15, 2025. Seeking $25-75M replacement properties urgently.',
          time: '1 hour ago',
          source: 'Public Records',
          sourceType: 'Transaction Database',
          watchlist: true,
          new: false,
          icon: '⏰',
        },
        {
          id: '4',
          severity: 'important',
          title: 'OCCUPANCY DROP - Metropolitan Park',
          description: 'Metropolitan Park occupancy fell from 89% to 76% after Amazon departure. 430K SF now available. Leasing pressure increasing.',
          time: '2 hours ago',
          source: 'AI Monitoring',
          sourceType: 'Business License Analysis',
          watchlist: true,
          new: false,
          icon: '📉',
        },
        {
          id: '5',
          severity: 'important',
          title: 'CAP RATE COMPRESSION - Seattle Office Market',
          description: 'Seattle office cap rates compressed 25 basis points this quarter. Prime selling window for Class A assets. 3 of your watchlist properties affected.',
          time: '3 hours ago',
          source: 'Market Data',
          sourceType: 'CoStar Analysis',
          watchlist: false,
          new: false,
          icon: '📊',
        },
        {
          id: '6',
          severity: 'urgent',
          title: 'EXECUTIVE CHANGE - HealthTech Solutions',
          description: 'HealthTech Solutions hired new COO from Amazon. Expansion plans likely accelerating. Month-to-month lease creates urgency.',
          time: '4 hours ago',
          source: 'LinkedIn',
          sourceType: 'Press Announcements',
          watchlist: true,
          new: false,
          icon: '👥',
        },
        {
          id: '7',
          severity: 'info',
          title: 'NEW WARM INTRODUCTION AVAILABLE',
          description: 'Pacific Northwest REIT - Your contact Sarah Kim now connected to their Managing Partner David Chang. Introduction opportunity available.',
          time: '5 hours ago',
          source: 'Network Analysis',
          sourceType: 'LinkedIn Intelligence',
          watchlist: false,
          new: false,
          icon: '🤝',
        },
        {
          id: '8',
          severity: 'important',
          title: 'MAJOR DEVELOPMENT ANNOUNCED - Bellevue',
          description: '2M SF mixed-use project announced for downtown Bellevue. Impact on 4 watchlist properties. Market dynamics shifting for area assets.',
          time: '6 hours ago',
          source: 'Building Permits',
          sourceType: 'City Planning Records',
          watchlist: false,
          new: false,
          icon: '🏗️',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (filterName) => (event) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: event.target.checked,
    }));
  };

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, new: false })));
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleAlertAction = (alertId, action) => {
    console.log(`Action ${action} for alert ${alertId}`);
    // Handle different actions (call, view, etc.)
  };

  const filteredAlerts = alerts.filter(alert => {
    if (!filters[alert.severity]) return false;
    if (alert.watchlist && !filters.watchlist) return false;
    // Add more filter logic as needed
    return true;
  });

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <ErrorIcon />;
      case 'urgent':
        return <WarningIcon />;
      case 'important':
        return <InfoIcon />;
      case 'info':
        return <CheckCircleIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#dc2626';
      case 'urgent':
        return '#d97706';
      case 'important':
        return '#3b82f6';
      case 'info':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const newAlertsCount = alerts.filter(alert => alert.new).length;

  // Summary statistics matching the HTML template
  const summaryStats = {
    critical: 4,
    urgent: 8,
    important: 15,
    total: 23,
    watchlist: 18,
    market: 9,
    opportunities: 6,
    competitive: 4,
    aiMonitoring: 22,
    publicRecords: 8,
    marketData: 7,
    info: 12,
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(255, 255, 255, 0.8))', minHeight: '100vh' }}>
        <LinearProgress sx={{ borderRadius: 2, height: 6 }} />
        <Typography sx={{ mt: 2, textAlign: 'center', fontWeight: 500 }}>Loading alerts...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
    <Box sx={{ 
      display: 'flex', 
        flex: 1,
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      position: 'relative',
        paddingTop: '64px',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }
    }}>
      {/* Left Sidebar */}
      <SidebarContainer>
        {/* Alert Summary */}
        <SummaryCard>
          <Typography variant="h6" sx={{ 
            color: '#dc2626', 
            fontWeight: 700, 
            mb: 2, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontSize: '1.1rem',
            textShadow: '0 2px 4px rgba(220, 38, 38, 0.2)'
          }}>
            🚨 Alert Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ 
                  color: '#dc2626', 
                  fontWeight: 800,
                  textShadow: '0 4px 8px rgba(220, 38, 38, 0.3)',
                  mb: 0.5
                }}>
                  {summaryStats.critical}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}>
                  Critical
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ 
                  color: '#d97706', 
                  fontWeight: 800,
                  textShadow: '0 4px 8px rgba(217, 119, 6, 0.3)',
                  mb: 0.5
                }}>
                  {summaryStats.urgent}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}>
                  Urgent
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ 
                  color: '#3b82f6', 
                  fontWeight: 800,
                  textShadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
                  mb: 0.5
                }}>
                  {summaryStats.important}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}>
                  Important
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 800,
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  mb: 0.5
                }}>
                  {summaryStats.total}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5
                }}>
                  Total Today
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </SummaryCard>

        {/* Filters */}
        <FilterSection>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 700, 
            mb: 2,
            color: '#374151',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: 0.5
          }}>
            Alert Priority
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.critical}
                onChange={handleFilterChange('critical')}
                sx={{ 
                  '&.Mui-checked': { color: '#dc2626' },
                  '& .MuiSvgIcon-root': { fontSize: 20 }
                }}
              />
            }
            label={`🔴 Critical (${summaryStats.critical})`}
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontWeight: 600,
                fontSize: '0.85rem'
              }
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.urgent}
                onChange={handleFilterChange('urgent')}
                sx={{ 
                  '&.Mui-checked': { color: '#d97706' },
                  '& .MuiSvgIcon-root': { fontSize: 20 }
                }}
              />
            }
            label={`🟡 Urgent (${summaryStats.urgent})`}
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontWeight: 600,
                fontSize: '0.85rem'
              }
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.important}
                onChange={handleFilterChange('important')}
                sx={{ 
                  '&.Mui-checked': { color: '#3b82f6' },
                  '& .MuiSvgIcon-root': { fontSize: 20 }
                }}
              />
            }
            label={`🔵 Important (${summaryStats.important})`}
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontWeight: 600,
                fontSize: '0.85rem'
              }
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.info}
                onChange={handleFilterChange('info')}
                sx={{ 
                  '&.Mui-checked': { color: '#10b981' },
                  '& .MuiSvgIcon-root': { fontSize: 20 }
                }}
              />
            }
            label={`🟢 Info (${summaryStats.info})`}
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontWeight: 600,
                fontSize: '0.85rem'
              }
            }}
          />
        </FilterSection>

        <FilterSection>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 700, 
            mb: 2,
            color: '#374151',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: 0.5
          }}>
            Alert Type
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.watchlist}
                onChange={handleFilterChange('watchlist')}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
              />
            }
            label={`⭐ Watchlist Items (${summaryStats.watchlist})`}
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontWeight: 600,
                fontSize: '0.85rem'
              }
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.market}
                onChange={handleFilterChange('market')}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
              />
            }
            label={`📊 Market Changes (${summaryStats.market})`}
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontWeight: 600,
                fontSize: '0.85rem'
              }
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.opportunities}
                onChange={handleFilterChange('opportunities')}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
              />
            }
            label={`🎯 New Opportunities (${summaryStats.opportunities})`}
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontWeight: 600,
                fontSize: '0.85rem'
              }
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.competitive}
                onChange={handleFilterChange('competitive')}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
              />
            }
            label={`🏆 Competitive Intel (${summaryStats.competitive})`}
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontWeight: 600,
                fontSize: '0.85rem'
              }
            }}
          />
        </FilterSection>

        <FilterSection>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 700, 
            mb: 2,
            color: '#374151',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: 0.5
          }}>
            Source
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.aiMonitoring}
                onChange={handleFilterChange('aiMonitoring')}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
              />
            }
            label={`🤖 AI Monitoring (${summaryStats.aiMonitoring})`}
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontWeight: 600,
                fontSize: '0.85rem'
              }
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.publicRecords}
                onChange={handleFilterChange('publicRecords')}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
              />
            }
            label={`📋 Public Records (${summaryStats.publicRecords})`}
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontWeight: 600,
                fontSize: '0.85rem'
              }
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.marketData}
                onChange={handleFilterChange('marketData')}
                sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
              />
            }
            label={`📈 Market Data (${summaryStats.marketData})`}
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontWeight: 600,
                fontSize: '0.85rem'
              }
            }}
          />
        </FilterSection>
      </SidebarContainer>

      {/* Main Content */}
      <ContentContainer>
        {/* Header */}
        <HeaderContainer>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            background: 'linear-gradient(135deg, #1f2937, #374151)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            🚨 Live Alerts Feed
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Time Filter</InputLabel>
              <Select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                label="Time Filter"
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                <MenuItem value="24h">Last 24 Hours</MenuItem>
                <MenuItem value="3d">Last 3 Days</MenuItem>
                <MenuItem value="1w">Last Week</MenuItem>
                <MenuItem value="1m">Last Month</MenuItem>
              </Select>
            </FormControl>
            <ModernButton
              variant="contained"
              color="success"
              onClick={handleMarkAllRead}
              startIcon={<CheckCircleIcon />}
              sx={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
              }}
            >
              Mark All Read
            </ModernButton>
          </Box>
        </HeaderContainer>

        {/* Alerts Feed */}
        <AlertsFeedContainer>
          {filteredAlerts.map((alert) => (
            <StyledCard key={alert.id} severity={alert.severity}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <AlertIcon severity={alert.severity}>
                    {alert.icon}
                  </AlertIcon>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: 'text.primary',
                        fontSize: '1rem',
                        lineHeight: 1.4
                      }}>
                        {alert.title}
                        {alert.new && (
                          <Box
                            component="span"
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                              display: 'inline-block',
                              ml: 1.5,
                              animation: 'pulse 2s infinite',
                              boxShadow: '0 0 10px rgba(220, 38, 38, 0.5)',
                              '@keyframes pulse': {
                                '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                                '50%': { opacity: 0.7, transform: 'scale(1.1)' },
                              },
                            }}
                          />
                        )}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: 'text.secondary', 
                        whiteSpace: 'nowrap',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}>
                        {alert.time}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ 
                      color: 'text.secondary', 
                      mb: 2.5, 
                      lineHeight: 1.6,
                      fontSize: '0.9rem'
                    }}>
                      {alert.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {alert.watchlist && (
                          <Chip
                            icon={<StarIcon />}
                            label="WATCHLIST"
                            size="small"
                            sx={{ 
                              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                              color: '#92400e',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)',
                            }}
                          />
                        )}
                        <Typography variant="caption" sx={{ 
                          color: 'text.secondary',
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}>
                          {alert.source} • {alert.sourceType}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {alert.severity === 'critical' && (
                          <Tooltip title="Call Now">
                            <ModernButton
                              size="small"
                              variant="contained"
                              onClick={() => handleAlertAction(alert.id, 'call')}
                              sx={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                              }}
                            >
                              Call Now
                            </ModernButton>
                          </Tooltip>
                        )}
                        {alert.severity === 'urgent' && alert.title.includes('FUNDING EVENT') && (
                          <Tooltip title="Contact CEO">
                            <ModernButton
                              size="small"
                              variant="contained"
                              onClick={() => handleAlertAction(alert.id, 'contact')}
                              sx={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                              }}
                            >
                              Contact CEO
                            </ModernButton>
                          </Tooltip>
                        )}
                        {alert.severity === 'critical' && alert.title.includes('1031 EXCHANGE') && (
                          <Tooltip title="Send Listings">
                            <ModernButton
                              size="small"
                              variant="contained"
                              onClick={() => handleAlertAction(alert.id, 'send')}
                              sx={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                              }}
                            >
                              Send Listings
                            </ModernButton>
                          </Tooltip>
                        )}
                        {alert.severity === 'important' && alert.title.includes('OCCUPANCY DROP') && (
                          <Tooltip title="Call Leasing">
                            <ModernButton
                              size="small"
                              variant="contained"
                              onClick={() => handleAlertAction(alert.id, 'call')}
                              sx={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                              }}
                            >
                              Call Leasing
                            </ModernButton>
                          </Tooltip>
                        )}
                        {alert.severity === 'important' && alert.title.includes('CAP RATE') && (
                          <Tooltip title="View Report">
                            <ModernButton
                              size="small"
                              variant="contained"
                              onClick={() => handleAlertAction(alert.id, 'view')}
                              sx={{
                                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                              }}
                            >
                              View Report
                            </ModernButton>
                          </Tooltip>
                        )}
                        {alert.severity === 'urgent' && alert.title.includes('EXECUTIVE CHANGE') && (
                          <Tooltip title="Reach Out">
                            <ModernButton
                              size="small"
                              variant="contained"
                              onClick={() => handleAlertAction(alert.id, 'reach')}
                              sx={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                              }}
                            >
                              Reach Out
                            </ModernButton>
                          </Tooltip>
                        )}
                        {alert.severity === 'info' && (
                          <Tooltip title="Request Intro">
                            <ModernButton
                              size="small"
                              variant="contained"
                              onClick={() => handleAlertAction(alert.id, 'intro')}
                              sx={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                              }}
                            >
                              Request Intro
                            </ModernButton>
                          </Tooltip>
                        )}
                        {alert.severity === 'important' && alert.title.includes('MAJOR DEVELOPMENT') && (
                          <Tooltip title="View Impact">
                            <ModernButton
                              size="small"
                              variant="contained"
                              onClick={() => handleAlertAction(alert.id, 'view')}
                              sx={{
                                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                              }}
                            >
                              View Impact
                            </ModernButton>
                          </Tooltip>
                        )}
                        
                        {/* View Property/Company/Connection Button */}
                        <Tooltip title="View Details">
                          <ModernButton
                            size="small"
                            variant="contained"
                            onClick={() => handleAlertAction(alert.id, 'view')}
                            sx={{
                              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                            }}
                          >
                            {alert.title.includes('Property') ? 'View Property' :
                             alert.title.includes('Company') ? 'View Company' :
                             alert.title.includes('Connection') ? 'View Connection' :
                             alert.title.includes('Buyer') ? 'View Buyer' :
                             alert.title.includes('Affected') ? 'Call Affected' :
                             'View Details'}
                          </ModernButton>
                        </Tooltip>
                        
                        <Tooltip title="Dismiss">
                          <ModernButton
                            size="small"
                            variant="outlined"
                            onClick={() => handleDismissAlert(alert.id)}
                            sx={{
                              borderColor: 'rgba(209, 213, 219, 0.5)',
                              color: '#6b7280',
                              '&:hover': {
                                borderColor: '#9ca3af',
                                background: 'rgba(243, 244, 246, 0.5)',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                              }
                            }}
                          >
                            Dismiss
                          </ModernButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          ))}

          {filteredAlerts.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.2), rgba(107, 114, 128, 0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}>
                <NotificationsIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
              </Box>
              <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 600, mb: 1 }}>
                No alerts found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ opacity: 0.8 }}>
                Try adjusting your filters to see more alerts.
              </Typography>
            </Box>
          )}

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <ModernButton
              variant="outlined"
              startIcon={<RefreshIcon />}
              sx={{
                borderColor: 'rgba(59, 130, 246, 0.3)',
                color: '#3b82f6',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: '#3b82f6',
                  background: 'rgba(59, 130, 246, 0.05)',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)',
                }
              }}
            >
              Load More Alerts
            </ModernButton>
            <Typography variant="caption" sx={{ 
              display: 'block', 
              mt: 2, 
              color: 'text.secondary',
              fontWeight: 500,
              opacity: 0.8
            }}>
              Showing {filteredAlerts.length} of 39 alerts from last 24 hours
            </Typography>
          </Box>
        </AlertsFeedContainer>
      </ContentContainer>
      </Box>
    </Box>
  );
};

export default AlertsPage; 