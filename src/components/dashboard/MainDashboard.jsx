import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  LinearProgress,
  styled,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Home as HomeIcon,
  Flag as FlagIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon,
  Satellite as SatelliteIcon,
  Handshake as HandshakeIcon,
  AutoAwesome as AutoAwesomeIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import './MainDashboard.css';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  },
}));

const ProspectCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  borderLeft: '4px solid #10b981',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateX(4px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  },
}));

const MarketAlert = styled(Box)(({ theme, variant = 'default' }) => ({
  borderRadius: 10,
  padding: 12,
  marginBottom: 10,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  border: '1px solid',
  ...(variant === 'opportunity' && {
    background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    borderColor: '#10b981',
  }),
  ...(variant === 'urgent' && {
    background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)',
    borderColor: '#ef4444',
  }),
  ...(variant === 'default' && {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    borderColor: '#f59e0b',
  }),
  '&:hover': {
    transform: 'translateX(2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
}));

const PredictionCard = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
  border: '1px solid #d8b4fe',
  borderRadius: 12,
  padding: 14,
  marginBottom: 10,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
  },
}));

const RelationshipMap = styled(Box)(({ theme }) => ({
  background: '#f8fafc',
  borderRadius: 10,
  padding: 12,
  marginBottom: 10,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  border: '1px solid #e2e8f0',
  '&:hover': {
    background: '#f1f5f9',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
}));

const MetricCard = styled(Box)(({ theme }) => ({
  background: '#f8fafc',
  borderRadius: 8,
  padding: 12,
  textAlign: 'center',
  border: '1px solid #e2e8f0',
}));

const MainDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedPanels, setExpandedPanels] = useState({});

  const togglePanel = (panelId) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panelId]: !prev[panelId]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const prospects = [
    {
      id: 1,
      name: '🔥 DataFlow Technologies',
      tag: 'AI Growth Pattern Detected',
      score: 94,
      insights: [
        { icon: '📊', text: 'Transaction history shows 3x growth pattern' },
        { icon: '🎯', text: 'AI predicts space expansion need within 90 days' },
        { icon: '📈', text: 'Similar companies expanded 6 months post-funding' },
        { icon: '🧠', text: 'Decision pattern: prefers downtown locations' },
      ],
      prediction: 'Cross-referenced with 200+ similar company patterns. 94% probability of 75K-120K SF need.',
      dataSource: 'Analysis from: Prospect DB + Ownership Intelligence + Transaction History'
    },
    {
      id: 2,
      name: '🎯 MedTech Solutions',
      tag: 'Behavioral Pattern Match',
      score: 87,
      insights: [
        { icon: '📊', text: 'Property search behavior indicates urgency' },
        { icon: '🎯', text: 'AI model: 87% probability of Q2 move' },
        { icon: '📈', text: 'Budget range fits 15 available properties' },
        { icon: '🧠', text: 'Engagement pattern shows decision readiness' },
      ],
      prediction: 'Digital footprint analysis suggests active search phase. Optimal outreach window: next 15 days.',
      dataSource: 'Analysis from: Prospect DB + Property Search Data + Engagement Tracking'
    },
    {
      id: 3,
      name: '💡 FinTech Innovations',
      tag: 'Expansion Trigger Detected',
      score: 76,
      insights: [
        { icon: '📊', text: 'Regulatory approval pending affects space needs' },
        { icon: '🎯', text: 'AI predicts 200% growth if approved' },
        { icon: '📈', text: 'Compliance requirements drive facility changes' },
        { icon: '🧠', text: 'Decision timing: 30-day window post-approval' },
      ],
      prediction: 'Cross-referenced regulatory changes with historical expansion patterns. High probability trigger event.',
      dataSource: 'Analysis from: Prospect DB + Regulatory Tracking + Growth Models'
    }
  ];

  const marketAlerts = [
    {
      id: 1,
      variant: 'urgent',
      icon: '🤖',
      title: 'AI Market Anomaly Detected',
      confidence: 'High Confidence',
      content: '445 Oak Street: AI analysis shows 23% below comparable properties. Ownership change pattern suggests motivated seller.'
    },
    {
      id: 2,
      variant: 'opportunity',
      icon: '📊',
      title: 'Ownership Pattern Intelligence',
      confidence: '78% Probability',
      content: 'Metro Office Complex: AI detects ownership stress signals from payment patterns.'
    },
    {
      id: 3,
      variant: 'opportunity',
      icon: '💡',
      title: 'Cross-Database Opportunity',
      confidence: '94% Match',
      content: 'Manufacturing Plus: AI matched space requirements with 789 Industrial Blvd.'
    }
  ];

  const relationships = [
    {
      id: 1,
      company: 'DataFlow Technologies',
      path: ['You', 'Sarah Chen', 'Decision Maker'],
      analysis: 'Sarah worked with their CRO at previous company. Relationship strength: 8.7/10'
    },
    {
      id: 2,
      company: 'MedTech Solutions',
      path: ['You', 'Mark Johnson', 'CFO Mike Rodriguez'],
      analysis: 'Mark referred 3 successful deals. Introduction success rate: 94%'
    }
  ];

  const predictions = [
    {
      id: 1,
      title: '🎯 Expansion Imminent',
      confidence: 94,
      details: 'DataFlow Technologies: AI analysis predicts expansion need of 75K-120K SF within 90 days.'
    },
    {
      id: 2,
      title: '⏰ Lease Vulnerability',
      confidence: 87,
      details: 'Retail Giants Corp: AI analysis shows 87% probability of non-renewal.'
    }
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      background: 'white',
      position: 'relative'
    }}>
      {/* Sidebar */}
      <Box sx={{ 
        width: 240, 
        background: 'linear-gradient(180deg, rgba(30, 64, 175, 0.95) 0%, rgba(59, 130, 246, 0.9) 50%, rgba(37, 99, 235, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '4px 0 32px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        zIndex: 10,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          pointerEvents: 'none',
        }
      }}>
        <Box sx={{ 
          p: 2.5, 
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          position: 'relative',
          zIndex: 1
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              mb: 1, 
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onClick={() => handleNavigation('/dashboard')}
          >
            🏢 BrokerHQ
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '12px' }}>
            <Box sx={{ 
              width: 8, 
              height: 8, 
              background: 'linear-gradient(135deg, #10b981, #34d399)',
              borderRadius: '50%', 
              animation: 'pulse 2s infinite',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)'
            }} />
            <span style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' }}>AI Engine Active</span>
          </Box>
        </Box>
        
        <Box sx={{ flex: 1, py: 2.5, position: 'relative', zIndex: 1 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              p: 1.5, 
              background: isActiveRoute('/dashboard') ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)' : 'transparent',
              backdropFilter: isActiveRoute('/dashboard') ? 'blur(10px)' : 'none',
              color: 'white', 
              fontSize: '14px', 
              fontWeight: 500, 
              borderRight: isActiveRoute('/dashboard') ? '3px solid #fbbf24' : 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '0 12px 12px 0',
              marginRight: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                transform: 'translateX(4px)',
              }
            }}
            onClick={() => handleNavigation('/dashboard')}
          >
            <HomeIcon sx={{ fontSize: 16 }} />
            <span>Dashboard</span>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              p: 1.5, 
              background: isActiveRoute('/dashboard/properties') ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)' : 'transparent',
              backdropFilter: isActiveRoute('/dashboard/properties') ? 'blur(10px)' : 'none',
              color: isActiveRoute('/dashboard/properties') ? 'white' : 'rgba(255,255,255,0.8)', 
              fontSize: '14px', 
              fontWeight: 500, 
              borderRight: isActiveRoute('/dashboard/properties') ? '3px solid #fbbf24' : 'none',
              cursor: 'pointer', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '0 12px 12px 0',
              marginRight: 2,
              '&:hover': { 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                transform: 'translateX(4px)',
              } 
            }}
            onClick={() => handleNavigation('/tenant')}
          >
            <FlagIcon sx={{ fontSize: 16 }} />
            <span>Prospecting</span>
            <Chip 
              label="12" 
              size="small" 
              sx={{ 
                background: 'linear-gradient(135deg, #ef4444, #f87171)',
                color: 'white', 
                fontSize: '10px', 
                height: 20, 
                ml: 'auto',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                fontWeight: 600
              }} 
            />
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              p: 1.5, 
              background: isActiveRoute('/alerts') ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)' : 'transparent',
              backdropFilter: isActiveRoute('/alerts') ? 'blur(10px)' : 'none',
              color: isActiveRoute('/alerts') ? 'white' : 'rgba(255,255,255,0.8)', 
              fontSize: '14px', 
              fontWeight: 500, 
              borderRight: isActiveRoute('/alerts') ? '3px solid #fbbf24' : 'none',
              cursor: 'pointer', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '0 12px 12px 0',
              marginRight: 2,
              '&:hover': { 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                transform: 'translateX(4px)',
              } 
            }}
            onClick={() => handleNavigation('/alerts')}
          >
            <WarningIcon sx={{ fontSize: 16 }} />
            <span>Alerts</span>
            <Chip 
              label="7" 
              size="small" 
              sx={{ 
                background: 'linear-gradient(135deg, #ef4444, #f87171)',
                color: 'white', 
                fontSize: '10px', 
                height: 20, 
                ml: 'auto',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                fontWeight: 600
              }} 
            />
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              p: 1.5, 
              background: isActiveRoute('/tasks') ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)' : 'transparent',
              backdropFilter: isActiveRoute('/tasks') ? 'blur(10px)' : 'none',
              color: isActiveRoute('/tasks') ? 'white' : 'rgba(255,255,255,0.8)', 
              fontSize: '14px', 
              fontWeight: 500, 
              borderRight: isActiveRoute('/tasks') ? '3px solid #fbbf24' : 'none',
              cursor: 'pointer', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '0 12px 12px 0',
              marginRight: 2,
              '&:hover': { 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                transform: 'translateX(4px)',
              } 
            }}
            onClick={() => handleNavigation('/tasks')}
          >
            <CheckCircleIcon sx={{ fontSize: 16 }} />
            <span>Tasks</span>
            <Chip 
              label="5" 
              size="small" 
              sx={{ 
                background: 'linear-gradient(135deg, #ef4444, #f87171)',
                color: 'white', 
                fontSize: '10px', 
                height: 20, 
                ml: 'auto',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                fontWeight: 600
              }} 
            />
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              p: 1.5, 
              background: isActiveRoute('/watchlist') ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)' : 'transparent',
              backdropFilter: isActiveRoute('/watchlist') ? 'blur(10px)' : 'none',
              color: isActiveRoute('/watchlist') ? 'white' : 'rgba(255,255,255,0.8)', 
              fontSize: '14px', 
              fontWeight: 500, 
              borderRight: isActiveRoute('/watchlist') ? '3px solid #fbbf24' : 'none',
              cursor: 'pointer', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '0 12px 12px 0',
              marginRight: 2,
              '&:hover': { 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                transform: 'translateX(4px)',
              } 
            }}
            onClick={() => handleNavigation('/watchlist')}
          >
            <StarIcon sx={{ fontSize: 16 }} />
            <span>Watchlist</span>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              p: 1.5, 
              background: isActiveRoute('/settings') ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)' : 'transparent',
              backdropFilter: isActiveRoute('/settings') ? 'blur(10px)' : 'none',
              color: isActiveRoute('/settings') ? 'white' : 'rgba(255,255,255,0.8)', 
              fontSize: '14px', 
              fontWeight: 500, 
              borderRight: isActiveRoute('/settings') ? '3px solid #fbbf24' : 'none',
              cursor: 'pointer', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '0 12px 12px 0',
              marginRight: 2,
              '&:hover': { 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                transform: 'translateX(4px)',
              } 
            }}
            onClick={() => handleNavigation('/industry')}
          >
            <PersonIcon sx={{ fontSize: 16 }} />
            <span>Industry Trend Dashboard</span>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              p: 1.5, 
              background: isActiveRoute('/settings') ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)' : 'transparent',
              backdropFilter: isActiveRoute('/settings') ? 'blur(10px)' : 'none',
              color: isActiveRoute('/settings') ? 'white' : 'rgba(255,255,255,0.8)', 
              fontSize: '14px', 
              fontWeight: 500, 
              borderRight: isActiveRoute('/settings') ? '3px solid #fbbf24' : 'none',
              cursor: 'pointer', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '0 12px 12px 0',
              marginRight: 2,
              '&:hover': { 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                transform: 'translateX(4px)',
              } 
            }}
            onClick={() => handleNavigation('/settings')}
          >
            <PersonIcon sx={{ fontSize: 16 }} />
            <span>Profile</span>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        {/* Top Bar */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            AI Intelligence Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                847
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>Intelligence Score</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                12
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>Hot Prospects</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                $2.4M
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>Pipeline Value</Typography>
            </Box>
            <Chip 
              label="23 New AI Insights" 
              sx={{ 
                background: 'linear-gradient(135deg, #ef4444, #f87171)',
                color: 'white', 
                fontSize: '11px', 
                fontWeight: 600,
                animation: 'glow 2s infinite alternate',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
                backdropFilter: 'blur(10px)'
              }} 
            />
          </Box>
        </Box>

        {/* Dashboard Grid */}
        <Box sx={{ flex: 1, p: 2.5, overflow: 'auto' }}>
          <Grid container spacing={3} sx={{ height: 'calc(100vh - 140px)' }}>
            {/* Panel 1: AI-Enhanced Prospect Intelligence */}
            <Grid item xs={12} lg={7}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2, 
                    pb: 1.5, 
                    borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                    position: 'relative'
                  }}>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <PsychologyIcon sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }} />
                        AI Prospect Intelligence Engine
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>Cross-Database Pattern Analysis</Typography>
                    </Box>
                    <Chip 
                      label="AI POWERED" 
                      sx={{ 
                        background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                        color: 'white', 
                        fontSize: '10px', 
                        fontWeight: 600, 
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                        backdropFilter: 'blur(10px)'
                      }} 
                    />
                  </Box>
                  
                  <Box sx={{ maxHeight: 'calc(100vh - 280px)', overflow: 'auto' }}>
                    {prospects.map((prospect) => (
                      <ProspectCard key={prospect.id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 700, 
                                mb: 0.5,
                                background: 'linear-gradient(135deg, #374151 0%, #6b7280 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                              }}
                            >
                              {prospect.name}
                            </Typography>
                            <Chip 
                              label={prospect.tag} 
                              size="small" 
                              sx={{ 
                                background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                                color: '#1d4ed8', 
                                fontSize: '9px', 
                                fontWeight: 600, 
                                textTransform: 'uppercase',
                                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
                              }} 
                            />
                          </Box>
                          <Avatar sx={{ 
                            width: 40, 
                            height: 40, 
                            background: 'linear-gradient(135deg, #10b981, #34d399)', 
                            fontWeight: 700, 
                            fontSize: '12px',
                            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4), 0 2px 8px rgba(16, 185, 129, 0.2)',
                            backdropFilter: 'blur(10px)'
                          }}>
                            {prospect.score}%
                          </Avatar>
                        </Box>
                        
                        <Box sx={{ my: 1.5 }}>
                          {prospect.insights.map((insight, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Box sx={{ 
                                width: 16, 
                                height: 16, 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '8px', 
                                fontWeight: 700, 
                                background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                                color: '#16a34a',
                                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.2)'
                              }}>
                                {insight.icon}
                              </Box>
                              <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500 }}>{insight.text}</Typography>
                            </Box>
                          ))}
                        </Box>
                        
                        <Box sx={{ 
                          background: 'linear-gradient(135deg, rgba(243, 232, 255, 0.9) 0%, rgba(233, 213, 255, 0.8) 100%)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(216, 180, 254, 0.4)', 
                          borderRadius: 1, 
                          p: 1, 
                          mt: 1,
                          boxShadow: '0 2px 12px rgba(139, 92, 246, 0.1)'
                        }}>
                          <Typography variant="caption" sx={{ color: '#7c3aed', fontWeight: 600, mb: 0.5 }}>AI Behavioral Prediction</Typography>
                          <Typography variant="caption" sx={{ color: '#64748b', fontSize: '9px', lineHeight: 1.3 }}>{prospect.prediction}</Typography>
                        </Box>
                        
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '8px', fontStyle: 'italic', mt: 1, display: 'block' }}>
                          {prospect.dataSource}
                        </Typography>
                      </ProspectCard>
                    ))}
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>

            {/* Panel 2: Market Intelligence Scanner */}
            <Grid item xs={12} lg={5}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2, 
                    pb: 1.5, 
                    borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                    position: 'relative'
                  }}>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <SatelliteIcon sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }} />
                        Market Intelligence Scanner
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>AI Anomaly Detection</Typography>
                    </Box>
                    <Chip 
                      label="5 Alerts" 
                      sx={{ 
                        background: 'linear-gradient(135deg, #fecaca, #fca5a5)',
                        color: '#dc2626', 
                        fontSize: '11px', 
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
                      }} 
                    />
                  </Box>
                  
                  <Box sx={{ maxHeight: 'calc(100vh - 280px)', overflow: 'auto' }}>
                    {marketAlerts.map((alert) => (
                      <MarketAlert key={alert.id} variant={alert.variant}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Box sx={{ 
                            width: 16, 
                            height: 16, 
                            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: 'white', 
                            fontSize: '8px', 
                            fontWeight: 700,
                            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                          }}>
                            {alert.icon}
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#92400e', fontSize: '12px' }}>{alert.title}</Typography>
                          <Chip 
                            label={alert.confidence} 
                            size="small" 
                            sx={{ 
                              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(167, 139, 250, 0.2))',
                              color: '#7c3aed', 
                              fontSize: '8px', 
                              fontWeight: 600, 
                              ml: 'auto',
                              backdropFilter: 'blur(10px)'
                            }} 
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#374151', fontSize: '10px', lineHeight: 1.4 }}>{alert.content}</Typography>
                      </MarketAlert>
                    ))}
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>

            {/* Panel 3: Relationship Intelligence */}
            <Grid item xs={12} lg={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2, 
                    pb: 1.5, 
                    borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                    position: 'relative'
                  }}>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <HandshakeIcon sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }} />
                        Relationship Intelligence
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>AI Network Mapping</Typography>
                    </Box>
                    <Chip 
                      label="34 Connections" 
                      sx={{ 
                        background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                        color: '#16a34a', 
                        fontSize: '11px', 
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(22, 163, 74, 0.2)'
                      }} 
                    />
                  </Box>
                  
                  <Box sx={{ maxHeight: 'calc(100vh - 280px)', overflow: 'auto' }}>
                    {relationships.map((relationship) => (
                      <RelationshipMap key={relationship.id}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 700, 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5, 
                            fontSize: '13px' 
                          }}
                        >
                          {relationship.company}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5, flexWrap: 'wrap' }}>
                          {relationship.path.map((node, index) => (
                            <React.Fragment key={index}>
                              <Chip 
                                label={node} 
                                size="small" 
                                sx={{ 
                                  background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                                  border: '1px solid #3b82f6', 
                                  borderRadius: 0.5, 
                                  fontSize: '9px', 
                                  color: '#1d4ed8', 
                                  fontWeight: 600,
                                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
                                }} 
                              />
                              {index < relationship.path.length - 1 && (
                                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '10px' }}>→</Typography>
                              )}
                            </React.Fragment>
                          ))}
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '9px' }}>
                          <strong>AI Analysis:</strong> {relationship.analysis}
                        </Typography>
                      </RelationshipMap>
                    ))}
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>

            {/* Panel 4: Predictive Deal Intelligence */}
            <Grid item xs={12} lg={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2, 
                    pb: 1.5, 
                    borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                    position: 'relative'
                  }}>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <AutoAwesomeIcon sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }} />
                        Predictive Deal Intelligence
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>AI-Powered Timing Intelligence</Typography>
                    </Box>
                    <Chip 
                      label="PREDICT" 
                      sx={{ 
                        background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                        color: 'white', 
                        fontSize: '10px', 
                        fontWeight: 600, 
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                        backdropFilter: 'blur(10px)'
                      }} 
                    />
                  </Box>
                  
                  <Box sx={{ maxHeight: 'calc(100vh - 280px)', overflow: 'auto' }}>
                    {predictions.map((prediction) => (
                      <PredictionCard key={prediction.id}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontWeight: 700, 
                              background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              fontSize: '12px' 
                            }}
                          >
                            {prediction.title}
                          </Typography>
                          <Chip 
                            label={`${prediction.confidence}% Confidence`} 
                            size="small" 
                            sx={{ 
                              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(167, 139, 250, 0.2))',
                              color: '#7c3aed', 
                              fontSize: '9px', 
                              fontWeight: 700,
                              backdropFilter: 'blur(10px)'
                            }} 
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#374151', fontSize: '10px', lineHeight: 1.4 }}>{prediction.details}</Typography>
                      </PredictionCard>
                    ))}
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>

            {/* Panel 5: AI Research Summary */}
            <Grid item xs={12} lg={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2, 
                    pb: 1.5, 
                    borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                    position: 'relative'
                  }}>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <TrendingUpIcon sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }} />
                        AI Research Summary
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>Today's Intelligence Digest</Typography>
                    </Box>
                    <Chip 
                      label="SUMMARY" 
                      sx={{ 
                        background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                        color: 'white', 
                        fontSize: '10px', 
                        fontWeight: 600, 
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                        backdropFilter: 'blur(10px)'
                      }} 
                    />
                  </Box>
                  
                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <MetricCard>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700, 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5 
                          }}
                        >
                          847
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Records Analyzed</Typography>
                      </MetricCard>
                    </Grid>
                    <Grid item xs={6}>
                      <MetricCard>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700, 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5 
                          }}
                        >
                          23
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>AI Opportunities Found</Typography>
                      </MetricCard>
                    </Grid>
                    <Grid item xs={6}>
                      <MetricCard>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700, 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5 
                          }}
                        >
                          156
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Connections Mapped</Typography>
                      </MetricCard>
                    </Grid>
                    <Grid item xs={6}>
                      <MetricCard>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700, 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 0.5 
                          }}
                        >
                          34
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Pattern Matches</Typography>
                      </MetricCard>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 700, 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1.5, 
                        fontSize: '14px' 
                      }}
                    >
                      Today's AI Insights
                    </Typography>
                    
                    <Box sx={{ 
                      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.8) 100%)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: 1, 
                      p: 1.25, 
                      mb: 1, 
                      border: '1px solid rgba(226, 232, 240, 0.4)',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
                    }}>
                      <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 600, mb: 0.5, textTransform: 'uppercase', fontSize: '10px' }}>Cross-Database Pattern</Typography>
                      <Typography variant="caption" sx={{ color: '#475569', fontSize: '9px', lineHeight: 1.4 }}>AI found 12 prospects whose space requirements match your available properties - 67% higher match rate than manual analysis.</Typography>
                    </Box>

                    <Box sx={{ 
                      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.8) 100%)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: 1, 
                      p: 1.25, 
                      mb: 1, 
                      border: '1px solid rgba(226, 232, 240, 0.4)',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
                    }}>
                      <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 600, mb: 0.5, textTransform: 'uppercase', fontSize: '10px' }}>Behavioral Intelligence</Typography>
                      <Typography variant="caption" sx={{ color: '#475569', fontSize: '9px', lineHeight: 1.4 }}>Companies in your database that expanded Q1 show 78% likelihood to need additional space Q4. 8 prospects fit this pattern.</Typography>
                    </Box>

                    <Box sx={{ 
                      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.8) 100%)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: 1, 
                      p: 1.25, 
                      border: '1px solid rgba(226, 232, 240, 0.4)',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
                    }}>
                      <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 600, mb: 0.5, textTransform: 'uppercase', fontSize: '10px' }}>Network Optimization</Typography>
                      <Typography variant="caption" sx={{ color: '#475569', fontSize: '9px', lineHeight: 1.4 }}>Your warm introduction success rate is 67% higher than cold outreach. AI identified 15 new warm paths in your network.</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>

            {/* Panel 6: Performance Analytics */}
            <Grid item xs={12} lg={4}>
              <StyledCard>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2, 
                    pb: 1.5, 
                    borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                    position: 'relative'
                  }}>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <AssessmentIcon sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }} />
                        Performance Analytics
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>Your Intelligence-Driven Results</Typography>
                    </Box>
                    <Chip 
                      label="89% Efficiency" 
                      sx={{ 
                        background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                        color: '#16a34a', 
                        fontSize: '11px', 
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(22, 163, 74, 0.2)'
                      }} 
                    />
                  </Box>
                  
                  <Box sx={{ maxHeight: 'calc(100vh - 280px)', overflow: 'auto' }}>
                    <Box sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', fontSize: '11px' }}>AI Opportunity Accuracy</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981', fontSize: '11px' }}>87%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={87} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 1.5, 
                          bgcolor: 'rgba(226, 232, 240, 0.5)',
                          backdropFilter: 'blur(10px)',
                          '& .MuiLinearProgress-bar': { 
                            background: 'linear-gradient(90deg, #10b981, #34d399)',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                          } 
                        }} 
                      />
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '8px', mt: 0.5, display: 'block' }}>AI-scored prospects convert 23% more than manual selection</Typography>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', fontSize: '11px' }}>Research Efficiency Gain</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#3b82f6', fontSize: '11px' }}>340%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={95} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 1.5, 
                          bgcolor: 'rgba(226, 232, 240, 0.5)',
                          backdropFilter: 'blur(10px)',
                          '& .MuiLinearProgress-bar': { 
                            background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                          } 
                        }} 
                      />
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '8px', mt: 0.5, display: 'block' }}>AI analysis: 8 min vs manual research: 32 min per prospect</Typography>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', fontSize: '11px' }}>Intelligence-to-Action Speed</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#8b5cf6', fontSize: '11px' }}>12 min</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={78} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 1.5, 
                          bgcolor: 'rgba(226, 232, 240, 0.5)',
                          backdropFilter: 'blur(10px)',
                          '& .MuiLinearProgress-bar': { 
                            background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
                            boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                          } 
                        }} 
                      />
                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '8px', mt: 0.5, display: 'block' }}>Average time from AI alert to your outreach (top 20% performance)</Typography>
                    </Box>

                    <Box sx={{ 
                      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.8) 100%)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: 1, 
                      p: 1.5, 
                      mt: 1.5, 
                      border: '1px solid rgba(226, 232, 240, 0.4)',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
                    }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 700, 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 1, 
                          fontSize: '12px' 
                        }}
                      >
                        This Week's Platform Usage
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#475569', fontSize: '10px', lineHeight: 1.5 }}>
                        <strong>AI Analyses Reviewed:</strong> 47<br />
                        <strong>AI Recommendations Acted On:</strong> 34<br />
                        <strong>AI Follow-Through Rate:</strong> 89%<br />
                        <strong>AI-Mapped Connections Used:</strong> 12
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.8) 100%)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: 1, 
                      p: 1.5, 
                      mt: 1, 
                      border: '1px solid rgba(226, 232, 240, 0.4)',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
                    }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 700, 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          mb: 1, 
                          fontSize: '12px' 
                        }}
                      >
                        AI-Enhanced Pipeline Quality
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#475569', fontSize: '10px', lineHeight: 1.5 }}>
                        <strong>High-Scoring AI Prospects:</strong> 23 active<br />
                        <strong>Average AI Opportunity Score:</strong> 78%<br />
                        <strong>AI Prospects Converting:</strong> 67%<br />
                        <strong>Avg Time to First Meeting:</strong> 8.4 days
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default MainDashboard; 