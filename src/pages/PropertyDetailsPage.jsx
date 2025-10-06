import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Paper, Button, Chip, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { propertiesData } from '../data/mockData';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import InsightsIcon from '@mui/icons-material/Insights';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PhoneIcon from '@mui/icons-material/Phone';
import AssessmentIcon from '@mui/icons-material/Assessment';
import StarIcon from '@mui/icons-material/Star';
import DescriptionIcon from '@mui/icons-material/Description';
import Navbar from '../components/dashboard/Navbar';

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 18px 50px rgba(0,0,0,0.15)',
  },
}));

const StyledMetricPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 6px 25px rgba(0,0,0,0.08)',
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
}));

const StyledSignalBox = styled(Box)(({ theme }) => ({
  bgcolor: '#ffffff',
  borderRadius: 8,
  border: '1px solid #e0e0e0',
  p: 2,
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
}));

const ConfidenceChip = styled(Chip)(({ theme, confidence }) => ({
  backgroundColor: confidence >= 80 ? '#e8f5e9' : '#fff3e0',
  color: confidence >= 80 ? '#2e7d32' : '#ef6c00',
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  borderRadius: 6,
  padding: '0 6px',
}));

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    console.log('PropertyDetailsPage - Received ID:', id);
    console.log('PropertyDetailsPage - ID type:', typeof id);
    const foundProperty = propertiesData.find(p => p.id === parseInt(id));
    console.log('PropertyDetailsPage - Found property:', foundProperty);
    if (foundProperty) {
      setProperty(foundProperty);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!property) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Property not found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/dashboard/properties')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  // Calculate additional property metrics
  const propertyMetrics = {
    buildingSF: `${property.sf.toLocaleString()} SF`,
    occupancy: `${property.occupancy}%`,
    estValue: `$${(property.sf * 500).toLocaleString()}`, // Rough estimate
    sellProbability: `${property.sellProb}/100`,
    propertyType: "Office - High Rise",
    zoning: "C6-6 / Commercial",
    rentableSF: `${property.sf.toLocaleString()} SF`,
    parking: "0.8-1000 SF (2,100 spaces)",
    buildingClass: "Class A",
    yearBuilt: "1931 / Renovated 2019",
    landArea: "83,000 SF",
    estimatedCurrentNOI: `$${(property.sf * 25).toLocaleString()} annually`,
    noiTrend: "+12% growth",
    operatingExpenseRatio: "32% (Market: 35%)",
    currentCapRate: "8.1% (Market: 7.8%)",
    propertyTax: "$14.2M (+8% vs 2023)",
    insuranceCostEst: "$2.8M annually",
    estMarketValue: `$${(property.sf * 450).toLocaleString()} - $${(property.sf * 550).toLocaleString()}`,
    currentOccupancyLease: `${property.occupancy}% (Est.)`,
    numberOfTenants: "~45 businesses",
    walt: "4.2 years",
    avgRentVsMarket: "$82/SF (Market: $85/SF)",
    loanMaturityPressure: "$850M construction loan matures March 2025",
    financialStress: "Property tax appeal filed (2 consecutive years)",
    legalPressure: "Partnership dispute litigation ongoing",
    marketTiming: "Optimal selling window (peak market cycle)",
    portfolioPressure: "70% of assets in NYC market (concentration risk)",
    optimalContactTiming: "Tuesday-Thursday, 2-4 PM. Owner historically responds best to financial analysis-focused approaches.",
    keyValueProposition: "Bridge financing solution during lease-up + maximize asset value before loan maturity pressure intensifies.",
    conversationStarter: "I noticed the upcoming loan maturity and have helped similar owners in Midtown navigate refinancing vs. disposition decisions...",
    predictedObjections: "Likely response: 'Market timing isn't right.' Counter: 'Actually, cap rate compression suggests this is peak pricing window...'",
    cbreTeamActivity: "HIGH",
    jllOutreachDetected: "MED",
    marketingHistory: "LOW",
    competitiveAdvantage: "First to identify loan maturity pressure. Owner hasn't been actively marketed to in 6+ months.",
    warmIntroPath: "Mutual: Sarah Chen (Goldman)",
    decisionTimeline: "Historically: 45-60 days",
    communicationStyle: "Data-driven, analytical",
    preferredBrokerType: "Institutional experience",
    images: [
      '/property.jpeg',
      '/property.jpeg',
      '/property.jpeg',
    ]
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box sx={{ p: 2, bgcolor: '#f8f9fa', flex: 1, paddingTop: '80px' }}>
      {/* Top Metrics Section Combined with Address */}
      <StyledPaper sx={{ mb: 0, background: 'linear-gradient(to right, #0d47a1,rgb(133, 188, 244))', color: '#fff', p: 2, borderRadius: 0, borderLeft: '5px solid #0d47a1' }}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'white' }}>{property.address}</Typography>
            <Typography variant="subtitle1" color="inherit" sx={{ mb: 2 }}>Seattle - Class A Office Building</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricPaper sx={{ bgcolor: 'transparent' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>{propertyMetrics.buildingSF}</Typography>
                  <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>Building SF</Typography>
                </StyledMetricPaper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricPaper sx={{ bgcolor: 'transparent' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>{propertyMetrics.occupancy}</Typography>
                  <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>Occupancy</Typography>
                </StyledMetricPaper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricPaper sx={{ bgcolor: 'transparent' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>{propertyMetrics.estValue}</Typography>
                  <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>Est. Value</Typography>
                </StyledMetricPaper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricPaper sx={{ bgcolor: 'transparent' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>{propertyMetrics.sellProbability}</Typography>
                  <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>Sell Probability</Typography>
                </StyledMetricPaper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </StyledPaper>
      <br>
      </br>
      
      {/* Main Content Area */}
      <Grid container spacing={5}>
        <Grid item xs={12} md={8}> {/* Left Column for Property Details */}
          {/* Property Fundamentals Card */}
          <StyledPaper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ fontSize: '1.8rem', mr: 1, color: '#343a40' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Property Fundamentals</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="County Assessor" size="small" sx={{ bgcolor: '#e0e0e0', color: '#424242', fontWeight: 600, fontSize: '0.75rem', height: 24, borderRadius: 6, padding: '0 6px' }} />
                <ConfidenceChip label="95% Confidence" confidence={95} icon={<InfoOutlinedIcon fontSize="small" />} />
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Property Type</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.propertyType}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Building SF</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.buildingSF}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Rentable SF</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.rentableSF}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Year Built</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.yearBuilt}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Zoning</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.zoning}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Parking</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.parking}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Building Class</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.buildingClass}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Land Area</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.landArea}</Typography>
              </Grid>
            </Grid>
          </StyledPaper>

          {/* Financial Performance Card */}
          <StyledPaper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoneyIcon sx={{ fontSize: '1.8rem', mr: 1.5, color: '#4CAF50' }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Financial Performance</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="AI Estimates" size="small" sx={{ bgcolor: '#e0e0e0', color: '#424242', fontWeight: 600, fontSize: '0.75rem', height: 24, borderRadius: 6, padding: '0 6px' }} />
                <ConfidenceChip label="65% Confidence" confidence={65} icon={<InfoOutlinedIcon fontSize="small" />} />
              </Box>
            </Box>
            <Box sx={{ bgcolor: '#e8f5e9', p: 4, borderRadius: 2, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>{propertyMetrics.estimatedCurrentNOI}</Typography>
              <Button variant="text" size="small" sx={{ textTransform: 'none', fontWeight: 600 }}>AI Estimates</Button>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>NOI Trend (3yr)</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.noiTrend}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Operating Expense Ratio</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.operatingExpenseRatio}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Property Tax (2024)</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.propertyTax}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Current Cap Rate</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.currentCapRate}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Insurance Cost Est.</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.insuranceCostEst}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Est. Market Value</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.estMarketValue}</Typography>
              </Grid>
            </Grid>
          </StyledPaper>

          {/* Lease Intelligence Card */}
          <StyledPaper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ fontSize: '1.8rem', mr: 1.5, color: '#1976d2' }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Lease Intelligence</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="Business Licenses" size="small" sx={{ bgcolor: '#e0e0e0', color: '#424242', fontWeight: 600, fontSize: '0.75rem', height: 24, borderRadius: 6, padding: '0 6px' }} />
                <ConfidenceChip label="55% Confidence" confidence={55} icon={<InfoOutlinedIcon fontSize="small" />} />
              </Box>
            </Box>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Current Occupancy</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.currentOccupancyLease}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Number of Tenants</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.numberOfTenants}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>WALT (Est.)</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.walt}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>Avg Rent vs Market</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{propertyMetrics.avgRentVsMarket}</Typography>
              </Grid>
            </Grid>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 5, mb: 3 }}>Lease Expiration Timeline</Typography>
            <Box sx={{ bgcolor: '#f5f5f5', p: 4, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}><Chip label="Q1 2025" size="small" color="error" sx={{ mr: 1 }} /><Typography variant="body2" display="inline">Major tenant (180K SF) - Renewal risk</Typography></Grid>
                <Grid item xs={6}><Chip label="Q2 2025" size="small" color="warning" sx={{ mr: 1 }} /><Typography variant="body2" display="inline">3 tenants (95K SF total)</Typography></Grid>
                <Grid item xs={6}><Chip label="Q4 2025" size="small" color="primary" sx={{ mr: 1 }} /><Typography variant="body2" display="inline">2 tenants (65K SF total)</Typography></Grid>
                <Grid item xs={6}><Chip label="2026" size="small" color="info" sx={{ mr: 1 }} /><Typography variant="body2" display="inline">5 tenants (220K SF total)</Typography></Grid>
              </Grid>
            </Box>
          </StyledPaper>

          {/* Image Display Section */}
          <StyledPaper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Property Images</Typography>
            <Grid container spacing={4}>
              {propertyMetrics.images.map((image, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Box sx={{ 
                    width: '100%', 
                    height: 220, 
                    backgroundImage: `url(${image})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    borderRadius: 2,
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
                  }} />
                </Grid>
              ))}
            </Grid>
          </StyledPaper>
        </Grid>

        <Grid item xs={14} md={4}> {/* Right Column for Insights and Signals */}
          {/* Owner Stress & Urgency Signals Card */}
          <StyledPaper sx={{ p: 2.5, mb: 4, bgcolor: '#fbe9e7', borderLeft: '5px solid #d32f2f' }}>
            <Grid container sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <WarningAmberRoundedIcon sx={{ fontSize: '1.8rem', mr: 1.5, color: '#d32f2f' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Owner Stress & Urgency Signals</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1} justifyContent="flex-end">
                  <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Chip label="Public Records" size="small" sx={{ bgcolor: '#e0e0e0', color: '#424242', fontWeight: 600, fontSize: '0.75rem', height: 24, borderRadius: 6, padding: '0 6px' }} />
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ConfidenceChip label="88% Confidence" confidence={88} icon={<InfoOutlinedIcon fontSize="small" />} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, mb: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                <WhatshotIcon sx={{ fontSize: '1.2rem', mr: 1, color: '#d32f2f' }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#d32f2f' }}>Loan Maturity Pressure:</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mr: 4 }}>{propertyMetrics.loanMaturityPressure}</Typography>
            </Box>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, mb: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                <ReportProblemOutlinedIcon sx={{ fontSize: '1.2rem', mr: 1, color: '#ef6c00' }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#ef6c00' }}>Financial Stress:</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mr: 4 }}>{propertyMetrics.financialStress}</Typography>
            </Box>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, mb: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                <BalanceOutlinedIcon sx={{ fontSize: '1.2rem', mr: 1, color: '#1976d2' }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>Legal Pressure:</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mr: 4 }}>{propertyMetrics.legalPressure}</Typography>
            </Box>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, mb: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                <ShowChartIcon sx={{ fontSize: '1.2rem', mr: 1, color: '#388e3c' }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#388e3c' }}>Market Timing:</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mr: 4 }}>{propertyMetrics.marketTiming}</Typography>
            </Box>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                <WorkOutlineIcon sx={{ fontSize: '1.2rem', mr: 1, color: '#d32f2f' }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#d32f2f' }}>Portfolio Pressure:</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mr: 4 }}>{propertyMetrics.portfolioPressure}</Typography>
            </Box>
          </StyledPaper>

          {/* AI Strategic Insights Card */}
          <StyledPaper sx={{ p: 2.5, mb: 5, bgcolor: '#e3f2fd', borderLeft: '5px solid #1976d2' }}>
            <Grid container sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SmartToyOutlinedIcon sx={{ fontSize: '1.8rem', mr: 1.5, color: '#1976d2' }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#343a40' }}>AI Strategic Insights</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1} justifyContent="flex-end">
                  <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>ML Models</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ConfidenceChip label="75% Confidence" confidence={75} icon={<InfoOutlinedIcon sx={{ fontSize: '0.8rem' }} />} sx={{ fontSize: '0.6rem', height: 20, borderRadius: 6, padding: '0 4px' }} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, mb: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1976d2', mb: 1, ml:2 }}>Optimal Contact Timing</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mr: 4 }}>{propertyMetrics.optimalContactTiming}</Typography>
            </Box>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, mb: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 , ml:2}}>Key Value Proposition</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mr: 4 }}>{propertyMetrics.keyValueProposition}</Typography>
            </Box>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, mb: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1976d2', mb: 1, ml:2 }}>Conversation Starter</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mr: 4 }}>{propertyMetrics.conversationStarter}</Typography>
            </Box>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1976d2', mb: 1, ml:2 }}>Predicted Objections</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mr: 4 }}>{propertyMetrics.predictedObjections}</Typography>
            </Box>
          </StyledPaper>

          {/* Competitive Intelligence Card */}
          <StyledPaper sx={{ p: 2.5, mb: 4, bgcolor: '#fff8e1', borderLeft: '5px solid #fbc02d' }}>
            <Grid container sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <InsightsIcon sx={{ fontSize: '1.8rem', mr: 1.5, color: '#fbc02d' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Competitive Intelligence</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1} justifyContent="flex-end">
                  <Grid item xs={6}>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ConfidenceChip label="68% Confidence" confidence={68} icon={<InfoOutlinedIcon fontSize="small" />} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, mb: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#d32f2f', mb: 0, ml: 2, mr: 6 }}>CBRE Team Activity:</Typography>
                <Typography variant="body2" color="text.secondary">{propertyMetrics.cbreTeamActivity}</Typography>
              </Box>
            </Box>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, mb: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#ef6c00', mb: 0, ml: 2, mr: 3.5 }}>JLL Outreach Detected:</Typography>
                <Typography variant="body2" color="text.secondary">{propertyMetrics.jllOutreachDetected}</Typography>
              </Box>
            </Box>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, mb: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#388e3c', mb: 0, ml: 2, mr: 7.9 }}>Marketing History:</Typography>
                <Typography variant="body2" color="text.secondary">{propertyMetrics.marketingHistory}</Typography>
              </Box>
            </Box>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1976d2', mb: 0, ml: 2, mr: 3 }}>Competitive Advantage:</Typography>
                <Typography variant="body2" color="text.secondary">{propertyMetrics.competitiveAdvantage}</Typography>
              </Box>
            </Box>
          </StyledPaper>

          {/* Relationship & Approach Card */}
          <StyledPaper sx={{ p: 2.5, mb: 8, bgcolor: 'rgb(228, 250, 229)', borderLeft: '5px solid #4CAF50' }}>
            <Grid container sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <HandshakeIcon sx={{ fontSize: '1.8rem', mr: 1.5, color: '#4CAF50' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Relationship & Approach</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1} justifyContent="flex-end">
                  <Grid item xs={6}>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ConfidenceChip label="60% Confidence" confidence={60} icon={<InfoOutlinedIcon fontSize="small" />} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, mb: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#d32f2f', mb: 1, ml:2 }}>Warm Intro Path:</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mr: 4 }}>{propertyMetrics.warmIntroPath}</Typography>
            </Box>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, mb: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#ef6c00', mb: 1, ml:2 }}>Decision Timeline:</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mr: 4 }}>{propertyMetrics.decisionTimeline}</Typography>
            </Box>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, mb: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1976d2', mb: 1, ml:2 }}>Communication Style:</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mr: 4 }}>{propertyMetrics.communicationStyle}</Typography>
            </Box>
            <Box sx={{ bgcolor: '#ffffff', borderRadius: 3, p: 0.5, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#388e3c', mb: 1, ml:2 }}>Preferred Broker Type:</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mr: 4 }}>{propertyMetrics.preferredBrokerType}</Typography>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Bottom Action Buttons */}
      <Box sx={{
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'background.paper',
        p: 1,
        pt: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-around',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
        zIndex: 1000
      }}>
        <Button 
          variant="contained" 
          color="error" 
          startIcon={<WarningAmberRoundedIcon />}
          sx={{ 
            px: 2, 
            py: 0.75, 
            fontWeight: 500, 
            textTransform: 'none',
            borderRadius: 0,
            minWidth: 180
          }}
        >
          Contact Immediately
        </Button>
        <Button 
          variant="contained" 
          startIcon={<PhoneIcon />}
          sx={{ 
            px: 2, 
            py: 0.75, 
            fontWeight: 500, 
            textTransform: 'none',
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#1565c0' },
            borderRadius: 0,
            minWidth: 180
          }}
        >
          Schedule Call
        </Button>
        <Button 
          variant="contained" 
          startIcon={<AssessmentIcon />}
          sx={{ 
            px: 2, 
            py: 0.75, 
            fontWeight: 500, 
            textTransform: 'none',
            bgcolor: '#4CAF50',
            '&:hover': { bgcolor: '#45a049' },
            borderRadius: 0,
            minWidth: 180
          }}
        >
          Send Analysis
        </Button>
        <Button 
          variant="contained" 
          startIcon={<StarIcon />}
          sx={{ 
            px: 2, 
            py: 0.75, 
            fontWeight: 500, 
            textTransform: 'none',
            bgcolor: '#fbc02d',
            '&:hover': { bgcolor: '#f9a825' },
            borderRadius: 0,
            minWidth: 180
          }}
        >
          Add to Watchlist
        </Button>
        <Button 
          variant="contained" 
          startIcon={<DescriptionIcon />}
          sx={{ 
            px: 2, 
            py: 0.75, 
            fontWeight: 500, 
            textTransform: 'none',
            bgcolor: '#e0e0e0',
            color: '#333',
            '&:hover': { bgcolor: '#bdbdbd' },
            borderRadius: 0,
            minWidth: 180
          }}
        >
          Generate Report
        </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PropertyDetailsPage; 