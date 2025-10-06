import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Container,
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  Group as GroupIcon,
  MonetizationOn as MonetizationIcon,
  Assignment as AssignmentIcon,
  Home as HomeIcon,
  SquareFoot as SquareFootIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Navbar from '../components/dashboard/Navbar';

// Styled components
const HeaderContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  marginTop: '64px', // Add margin for fixed navbar
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 100 100\\"><defs><pattern id=\\"grid\\" width=\\"10\\" height=\\"10\\" patternUnits=\\"userSpaceOnUse\\"><path d=\\"M 10 0 L 0 0 0 10\\" fill=\\"none\\" stroke=\\"rgba(255,255,255,0.1)\\" stroke-width=\\"1\\"/></pattern></defs><rect width=\\"100\\" height=\\"100\\" fill=\\"url(%23grid)\\"/></svg>")',
    opacity: 0.3,
  },
}));

const HeaderContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  maxWidth: 1200,
  margin: '0 auto',
}));

const ScoreCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  padding: theme.spacing(3),
  textAlign: 'center',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'white',
  minWidth: 140,
}));

const ScoreBadge = styled(Chip)(({ theme, variant }) => ({
  background: variant === 'critical' ? 'linear-gradient(45deg, #ff6b6b, #ee5a52)' : 'linear-gradient(45deg, #f59e0b, #d97706)',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: 1,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e2e8f0',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  },
}));

const CardIcon = styled(Box)(({ theme, variant }) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  color: 'white',
  background: variant === 'fire' ? 'linear-gradient(45deg, #ff6b6b, #ee5a52)' :
              variant === 'target' ? 'linear-gradient(45deg, #4facfe, #00f2fe)' :
              variant === 'contacts' ? 'linear-gradient(45deg, #4ecdc4, #44a08d)' :
              variant === 'strategy' ? 'linear-gradient(45deg, #a8e6cf, #3d8b85)' :
              variant === 'portfolio' ? 'linear-gradient(45deg, #667eea, #764ba2)' :
              'linear-gradient(45deg, #4ecdc4, #44a08d)',
}));

const PropertyMatch = styled(Box)(({ theme, matchLevel }) => ({
  background: 'white',
  border: '2px solid #e2e8f0',
  borderRadius: 12,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s',
  '&:hover': {
    borderColor: '#667eea',
    transform: 'translateY(-2px)',
  },
  ...(matchLevel === 'high' && {
    borderColor: '#38a169',
    background: 'linear-gradient(135deg, #f0fff4, #e6fffa)',
  }),
  ...(matchLevel === 'medium' && {
    borderColor: '#f59e0b',
    background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
  }),
}));

const MatchScore = styled(Chip)(({ theme, matchLevel }) => ({
  background: matchLevel === 'high' ? '#38a169' : '#f59e0b',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.9rem',
}));

const MatchReasons = styled(Box)(({ theme, matchLevel }) => ({
  background: 'rgba(255, 255, 255, 0.7)',
  padding: theme.spacing(2),
  borderRadius: 8,
  borderLeft: `4px solid ${matchLevel === 'high' ? '#38a169' : '#f59e0b'}`,
}));

const TriggerItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 12,
  background: '#f0fff4',
  borderLeft: '4px solid #38a169',
  marginBottom: theme.spacing(2),
}));

const ContactPerson = styled(Box)(({ theme }) => ({
  background: '#f8fafc',
  padding: theme.spacing(3),
  borderRadius: 12,
  marginBottom: theme.spacing(2),
  position: 'relative',
}));

const MutualConnection = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  background: 'linear-gradient(45deg, #38a169, #2f855a)',
  color: 'white',
  fontSize: '0.8rem',
  fontWeight: 600,
}));

const AcquisitionCriteria = styled(Box)(({ theme }) => ({
  background: '#f8fafc',
  padding: theme.spacing(3),
  borderRadius: 12,
  marginBottom: theme.spacing(2),
}));

const CriteriaItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 0),
  borderBottom: '1px solid #e2e8f0',
}));

const ActivityItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  background: '#f8fafc',
  borderRadius: 8,
  marginBottom: theme.spacing(1.5),
  borderLeft: '3px solid #38a169',
}));

const CTAButton = styled(Button)(({ theme, variant }) => ({
  width: '100%',
  background: variant === 'contact' ? 'linear-gradient(135deg, #38a169, #2f855a)' : 'linear-gradient(135deg, #667eea, #764ba2)',
  color: 'white',
  padding: theme.spacing(2, 4),
  borderRadius: 12,
  fontWeight: 600,
  fontSize: '1.1rem',
  textTransform: 'none',
  marginTop: theme.spacing(2),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: variant === 'contact' ? '0 8px 25px rgba(56, 161, 105, 0.4)' : '0 8px 25px rgba(102, 126, 234, 0.4)',
  },
}));

// Mock data for buyer details
const mockBuyerData = {
  id: 1,
  company: 'Meridian Capital Partners',
  type: 'Core+ Office & Mixed Use Investment Fund',
  focus: 'Pacific Northwest Focus',
  fundSize: '$850M',
  fundCloses: 'Q2 2025',
  deployed: '$430M',
  remaining: '51%',
  targetDeals: '$25M-$75M',
  markets: 'Seattle, Portland, Vancouver',
  capitalUrgency: 94,
  portfolioMatch: 87,
  contacts: [
    {
      name: 'James Wilson',
      role: 'Managing Partner & Chief Investment Officer',
      phone: '(206) 555-0147',
      email: 'jwilson@meridiancp.com',
      authority: 'Final decision on all acquisitions',
      style: 'Data-driven, prefers detailed financial analysis',
      bestContact: 'Tuesday-Thursday, 9-11 AM',
      linkedin: 'Active, responds to connection requests',
      avatar: 'JW',
      mutualConnection: 'Sarah Chen',
    },
    {
      name: 'Maria Santos',
      role: 'Senior Vice President, Acquisitions',
      phone: '(206) 555-0148',
      email: 'msantos@meridiancp.com',
      authority: 'Initial screening and due diligence',
      style: 'Relationship-focused, responds to referrals',
      bestContact: 'Monday-Wednesday, 2-4 PM',
      linkedin: 'Connected to 45 mutual contacts',
      avatar: 'MS',
    },
    {
      name: 'David Kim',
      role: 'Director of Asset Management',
      phone: '(206) 555-0149',
      email: 'dkim@meridiancp.com',
      authority: 'Operational due diligence and analysis',
      style: 'Detail-oriented, prefers property visits',
      bestContact: 'Wednesday-Friday, 10 AM-12 PM',
      emailResponse: 'Responds within 4-6 hours typically',
      avatar: 'DK',
    },
  ],
  urgencyTriggers: [
    {
      icon: '💰',
      title: 'Fund III closes Q2 2025 - $420M still to deploy',
      detail: 'Massive capital pressure with only 6 months left',
    },
    {
      icon: '📈',
      title: '8 acquisitions in 2024 - on aggressive buying spree',
      detail: '$285M deployed in 12 months, accelerating pace',
    },
    {
      icon: '🎯',
      title: '1031 exchange deadline March 2025',
      detail: 'Must identify replacement property by January 15',
    },
    {
      icon: '⏰',
      title: 'Q4 historically their busiest acquisition period',
      detail: '67% of historical deals closed in Q4',
    },
  ],
  propertyMatches: [
    {
      id: 1,
      name: '555 California Street',
      address: 'San Francisco, CA • Class A Office',
      matchScore: 94,
      matchLevel: 'high',
      price: '$47.5M',
      capRate: '6.8%',
      size: '1.78M SF',
      occupied: '68%',
      reasons: [
        'Price: $47.5M fits their $25M-$75M sweet spot',
        'Cap Rate: 6.8% matches their core+ strategy',
        'Value-Add: 32% vacancy = lease-up opportunity',
        'Geography: West Coast focus aligns',
        'Timing: Solves their 1031 exchange deadline',
      ],
    },
    {
      id: 2,
      name: 'Pacific Business Center',
      address: 'Seattle, WA • Industrial Complex',
      matchScore: 76,
      matchLevel: 'medium',
      price: '$32M',
      capRate: '7.2%',
      size: '420K SF',
      occupied: '95%',
      reasons: [
        'Price: $32M fits budget range',
        'Market: Seattle is their primary focus',
        'Property Type: Industrial (not their main focus)',
        'Value-Add: Limited upside at 95% occupancy',
      ],
    },
  ],
  acquisitionCriteria: {
    propertyTypes: 'Office (60%), Mixed-Use (25%), Retail (15%)',
    dealSize: '$25M - $75M',
    capRates: '6.0% - 7.5%',
    markets: 'Seattle, Portland, Vancouver',
    buildingClass: 'A & B+ preferred',
    occupancy: '65%+ (value-add opportunities)',
    holdPeriod: '5-7 years typical',
    irrTarget: '15-20% unlevered',
  },
  recentActivity: [
    {
      date: 'Dec 8',
      title: 'Acquired Industrial Complex',
      detail: '$52M • 345K SF • Tacoma, WA',
    },
    {
      date: 'Nov 15',
      title: 'Sold Retail Portfolio',
      detail: '$95M • 3 properties • 1031 exchange',
    },
    {
      date: 'Oct 22',
      title: 'Office Acquisition',
      detail: '$38M • 285K SF • Portland, OR',
    },
  ],
};

const BuyerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // In a real app, you would fetch buyer data based on the ID
    // For now, we'll use mock data
    setBuyer(mockBuyerData);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading buyer details...</Typography>
      </Box>
    );
  }

  if (!buyer) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Buyer not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Navbar />
      
      {/* Header */}
      <HeaderContainer>
        <HeaderContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {buyer.company}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                {buyer.type} • {buyer.focus}
              </Typography>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon />
                    <Typography><strong>Fund III:</strong> {buyer.fundSize} (closes {buyer.fundCloses})</Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon />
                    <Typography><strong>Deployed:</strong> {buyer.deployed} ({buyer.remaining} remaining)</Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrophyIcon />
                    <Typography><strong>Target:</strong> {buyer.targetDeals} deals</Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon />
                    <Typography><strong>Markets:</strong> {buyer.markets}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ScoreCard>
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, color: '#ffd700' }}>
                  {buyer.capitalUrgency}
                </Typography>
                <Typography variant="body2" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                  Capital Urgency
                </Typography>
                <ScoreBadge label="CRITICAL" variant="critical" />
              </ScoreCard>
              <ScoreCard>
                <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, color: '#ffd700' }}>
                  {buyer.portfolioMatch}
                </Typography>
                <Typography variant="body2" sx={{ textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                  Portfolio Match
                </Typography>
                <ScoreBadge label="HIGH MATCH" />
              </ScoreCard>
            </Box>
          </Box>
        </HeaderContent>
      </HeaderContainer>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: 'grid', gap: 4 }}>
              
              {/* Your Properties That Match */}
              <StyledCard>
                <CardHeader
                  avatar={
                    <CardIcon variant="target">
                      🎯
                    </CardIcon>
                  }
                  title="Your Properties That Match Their Criteria"
                  titleTypographyProps={{ variant: 'h5', fontWeight: 700 }}
                />
                <CardContent>
                  {buyer.propertyMatches.map((property) => (
                    <PropertyMatch key={property.id} matchLevel={property.matchLevel}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                            {property.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            {property.address}
                          </Typography>
                        </Box>
                        <MatchScore 
                          label={`${property.matchScore}% Match`} 
                          matchLevel={property.matchLevel}
                        />
                      </Box>
                      
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontWeight: 700, color: '#2d3748' }}>
                              {property.price}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                              Price
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontWeight: 700, color: '#2d3748' }}>
                              {property.capRate}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                              Cap Rate
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontWeight: 700, color: '#2d3748' }}>
                              {property.size}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                              Size
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontWeight: 700, color: '#2d3748' }}>
                              {property.occupied}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                              Occupied
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <MatchReasons matchLevel={property.matchLevel}>
                        <Typography sx={{ fontWeight: 600, mb: 1 }}>
                          {property.matchLevel === 'high' ? 'Why It\'s a Perfect Match:' : 'Moderate Match Factors:'}
                        </Typography>
                        <List dense>
                          {property.reasons.map((reason, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 24 }}>
                                <CheckCircleIcon 
                                  sx={{ 
                                    color: reason.includes('⚠') ? '#f59e0b' : '#38a169',
                                    fontSize: '1rem'
                                  }} 
                                />
                              </ListItemIcon>
                              <ListItemText 
                                primary={reason.replace('✓', '').replace('⚠', '')}
                                primaryTypographyProps={{ fontSize: '0.9rem' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </MatchReasons>

                      <CTAButton variant="contained" sx={{ mt: 2 }}>
                        {property.matchLevel === 'high' ? '📧 Pitch This Property' : '📋 Consider for Package'}
                      </CTAButton>
                    </PropertyMatch>
                  ))}

                  <Box sx={{ background: '#f0fff4', p: 3, borderRadius: 2, borderLeft: '4px solid #38a169', mt: 2 }}>
                    <Typography variant="h6" sx={{ color: '#38a169', mb: 1 }}>
                      🎯 RECOMMENDATION
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      Lead with 555 California Street - it's a slam dunk for their criteria
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                      Consider packaging both properties as a portfolio play for $79.5M total
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>

              {/* Capital Deployment Urgency */}
              <StyledCard>
                <CardHeader
                  avatar={
                    <CardIcon variant="fire">
                      🔥
                    </CardIcon>
                  }
                  title="Why They're Buying NOW"
                  titleTypographyProps={{ variant: 'h5', fontWeight: 700 }}
                />
                <CardContent>
                  {buyer.urgencyTriggers.map((trigger, index) => (
                    <TriggerItem key={index}>
                      <Typography variant="h6" sx={{ color: '#38a169' }}>
                        {trigger.icon}
                      </Typography>
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>
                          {trigger.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {trigger.detail}
                        </Typography>
                      </Box>
                    </TriggerItem>
                  ))}

                  <Box sx={{ background: 'linear-gradient(135deg, #a8e6cf, #3d8b85)', color: 'white', p: 3, borderRadius: 2, my: 3, fontStyle: 'italic' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      💬 WINNING PITCH FOR 555 CALIFORNIA
                    </Typography>
                    <Typography>
                      "Jim, I have a $47.5M San Francisco office building that solves your 1031 timeline problem. 32% vacancy means 15-20% IRR potential just like your Portland success. We can close by March 10. Should I send the package?"
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: 'grid', gap: 3, height: 'fit-content', position: 'sticky', top: 32 }}>
              
              {/* Decision Makers & Contacts */}
              <StyledCard>
                <CardHeader
                  avatar={
                    <CardIcon variant="contacts">
                      👥
                    </CardIcon>
                  }
                  title="Key Decision Makers"
                  titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                />
                <CardContent>
                  {buyer.contacts.map((contact, index) => (
                    <ContactPerson key={index}>
                      {contact.mutualConnection && (
                        <MutualConnection label={`🤝 Mutual: ${contact.mutualConnection}`} />
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ width: 60, height: 60, bgcolor: '#667eea', fontWeight: 600, fontSize: '1.2rem' }}>
                          {contact.avatar}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>
                            {contact.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                            {contact.role}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                        📞 {contact.phone} • ✉️ {contact.email}<br />
                        🎯 <strong>Authority:</strong> {contact.authority}<br />
                        💡 <strong>Style:</strong> {contact.style}<br />
                        ⏰ <strong>Best Contact:</strong> {contact.bestContact}<br />
                        {contact.linkedin ? `🔗 <strong>LinkedIn:</strong> ${contact.linkedin}` : `📧 <strong>Email:</strong> ${contact.emailResponse}`}
                      </Typography>
                    </ContactPerson>
                  ))}
                  <CTAButton variant="contact">
                    📞 Contact James Wilson
                  </CTAButton>
                </CardContent>
              </StyledCard>

              {/* Acquisition Criteria */}
              <StyledCard>
                <CardHeader
                  avatar={
                    <CardIcon variant="portfolio">
                      📋
                    </CardIcon>
                  }
                  title="Acquisition Criteria"
                  titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                />
                <CardContent>
                  <AcquisitionCriteria>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <CriteriaItem>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Property Types:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748' }}>
                            {buyer.acquisitionCriteria.propertyTypes}
                          </Typography>
                        </CriteriaItem>
                      </Grid>
                      <Grid item xs={12}>
                        <CriteriaItem>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Deal Size:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748' }}>
                            {buyer.acquisitionCriteria.dealSize}
                          </Typography>
                        </CriteriaItem>
                      </Grid>
                      <Grid item xs={12}>
                        <CriteriaItem>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Cap Rates:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748' }}>
                            {buyer.acquisitionCriteria.capRates}
                          </Typography>
                        </CriteriaItem>
                      </Grid>
                      <Grid item xs={12}>
                        <CriteriaItem>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Markets:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748' }}>
                            {buyer.acquisitionCriteria.markets}
                          </Typography>
                        </CriteriaItem>
                      </Grid>
                      <Grid item xs={12}>
                        <CriteriaItem>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Building Class:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748' }}>
                            {buyer.acquisitionCriteria.buildingClass}
                          </Typography>
                        </CriteriaItem>
                      </Grid>
                      <Grid item xs={12}>
                        <CriteriaItem>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Occupancy:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748' }}>
                            {buyer.acquisitionCriteria.occupancy}
                          </Typography>
                        </CriteriaItem>
                      </Grid>
                      <Grid item xs={12}>
                        <CriteriaItem>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            Hold Period:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748' }}>
                            {buyer.acquisitionCriteria.holdPeriod}
                          </Typography>
                        </CriteriaItem>
                      </Grid>
                      <Grid item xs={12}>
                        <CriteriaItem>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            IRR Target:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2d3748' }}>
                            {buyer.acquisitionCriteria.irrTarget}
                          </Typography>
                        </CriteriaItem>
                      </Grid>
                    </Grid>
                  </AcquisitionCriteria>

                  <Box sx={{ background: '#fffbeb', p: 2, borderRadius: 1, borderLeft: '4px solid #f59e0b' }}>
                    <Typography sx={{ fontWeight: 600, color: '#92400e', mb: 0.5 }}>
                      🎯 SWEET SPOT
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#451a03' }}>
                      $45M-$55M office buildings with 20-40% vacancy in Seattle metro
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>

              {/* Recent Activity */}
              <StyledCard>
                <CardHeader
                  avatar={
                    <CardIcon variant="strategy">
                      📈
                    </CardIcon>
                  }
                  title="Recent Activity"
                  titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                />
                <CardContent>
                  {buyer.recentActivity.map((activity, index) => (
                    <ActivityItem key={index}>
                      <Typography sx={{ minWidth: 80, fontWeight: 600, color: '#2d3748' }}>
                        {activity.date}
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                          {activity.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {activity.detail}
                        </Typography>
                      </Box>
                    </ActivityItem>
                  ))}
                </CardContent>
              </StyledCard>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BuyerDetailsPage; 