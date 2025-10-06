import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Stack,
  Avatar,
  Divider,
  Grid,
  Card,
  CardContent,
  Badge,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Search as SearchIcon,
  FileDownload as ExportIcon,
  Map as MapIcon,
  ViewList as ListIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Handshake as HandshakeIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  SquareFoot as SquareFootIcon,
  Percent as PercentIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { propertiesData } from '../../data/mockData';
import FilterPanel from '../filters/FilterPanel';
import MapPanel from '../map/MapPanel';
import DashboardNavigation from '../common/DashboardNavigation';

// Styled components
const StyledTableRow = styled(TableRow)(({ theme, priority }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  ...(priority === 'high' && {
    borderLeft: `4px solid ${theme.palette.error.main}`,
    backgroundColor: theme.palette.error.light + '10',
    '&:hover': {
      backgroundColor: theme.palette.error.light + '20',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
  }),
  ...(priority === 'medium' && {
    borderLeft: `4px solid ${theme.palette.warning.main}`,
    backgroundColor: theme.palette.warning.light + '10',
    '&:hover': {
      backgroundColor: theme.palette.warning.light + '20',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
  }),
}));

const PriorityChip = styled(Chip)(({ theme, priority }) => ({
  ...(priority === 'high' && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.main,
    animation: 'pulse 2s infinite',
  }),
  ...(priority === 'medium' && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.main,
  }),
  ...(priority === 'low' && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.main,
  }),
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  minWidth: 'auto',
  padding: '6px 12px',
  fontSize: '0.8rem',
  fontWeight: 500,
  textTransform: 'none',
  ...(variant === 'urgent' && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  }),
  ...(variant === 'contact' && {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  }),
  ...(variant === 'nurture' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(variant === 'details' && {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.grey[700],
    border: `1px solid ${theme.palette.grey[300]}`,
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  }),
}));

const ScoreDisplay = styled(Box)(({ theme, score }) => ({
  textAlign: 'center',
  '& .score-value': {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '2px',
    ...(score >= 75 && { color: theme.palette.success.main }),
    ...(score >= 50 && score < 75 && { color: theme.palette.warning.main }),
    ...(score < 50 && { color: theme.palette.error.main }),
  },
  '& .score-label': {
    fontSize: '0.75rem',
    color: theme.palette.grey[600],
  },
}));

const AddressDisplay = styled(Box)(({ theme }) => ({
  lineHeight: 1.4,
  '& .address-main': {
    color: theme.palette.text.primary,
    fontWeight: 600,
    marginBottom: '2px',
  },
  '& .address-sub': {
    color: theme.palette.grey[600],
    fontSize: '0.85rem',
  },
}));

const OccupancyDisplay = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  '& .occupancy-value': {
    fontSize: '1.2rem',
    fontWeight: 700,
    marginBottom: '2px',
  },
  '& .occupancy-label': {
    fontSize: '0.75rem',
    color: theme.palette.grey[600],
  },
}));

const ProspectingDashboard = ({ viewMode, setViewMode }) => {
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleStarToggle = (id) => {
    console.log('Toggle star for property:', id);
  };

  const handlePropertyClick = (propertyId) => {
    console.log('Property clicked:', propertyId);
    console.log('Navigating to:', `/property/${propertyId}`);
    navigate(`/property/${propertyId}`);
  };

  const getPriorityLabel = (sellProb) => {
    if (sellProb >= 75) return 'high';
    if (sellProb >= 50) return 'medium';
    return 'low';
  };

  const filteredData = propertiesData.filter(property => {
    // Apply filters based on the FilterPanel state
    if (filters.scoreRange) {
      const [min, max] = filters.scoreRange;
      if (property.sellProb < min || property.sellProb > max) return false;
    }
    return true;
  });

  const highCount = propertiesData.filter(p => p.sellProb >= 75).length;
  const mediumCount = propertiesData.filter(p => p.sellProb >= 50 && p.sellProb < 75).length;
  const lowCount = propertiesData.filter(p => p.sellProb < 50).length;

  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
      {/* Left Sidebar - Using FilterPanel */}
      <Box sx={{ width: 300, p: 2, flexShrink: 0 }}>
        <FilterPanel 
          selectedRole="properties" 
          onFilterChange={handleFilterChange}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Content Header */}
        <Paper
          sx={{
            bgcolor: 'white',
            p: 2.5,
            borderBottom: 1,
            borderColor: 'grey.200',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', gap: 3.75, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'grey.600' }}>
              {filteredData.length} properties found
            </Typography>
            <Box sx={{ display: 'flex', gap: 2.5 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 700 }}>
                  {highCount}
                </Typography>
                <Typography variant="caption" sx={{ color: 'grey.600' }}>
                  High
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: 'warning.main', fontWeight: 700 }}>
                  {mediumCount}
                </Typography>
                <Typography variant="caption" sx={{ color: 'grey.600' }}>
                  Medium
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 700 }}>
                  {lowCount}
                </Typography>
                <Typography variant="caption" sx={{ color: 'grey.600' }}>
                  Low
                </Typography>
              </Box>
            </Box>
          </Box>
          <Stack direction="row" spacing={1.25}>
            <Button
              variant={viewMode === 'list' ? 'contained' : 'outlined'}
              startIcon={<ListIcon />}
              onClick={() => setViewMode('list')}
              sx={{
                ...(viewMode === 'list' && {
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                }),
              }}
            >
              List View
            </Button>
            <Button
              variant={viewMode === 'map' ? 'contained' : 'outlined'}
              startIcon={<MapIcon />}
              onClick={() => setViewMode('map')}
              sx={{
                ...(viewMode === 'map' && {
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                }),
              }}
            >
              Map View
            </Button>
          </Stack>
        </Paper>

        {/* Content Area - Table or Map */}
        {viewMode === 'list' ? (
          <>
            {/* Table */}
            <TableContainer sx={{ flex: 1, bgcolor: 'white', width: '100%' }}>
              <Table stickyHeader sx={{ width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'grey.700' }}>★</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'grey.700' }}>Property</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'grey.700' }}>Owner</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'grey.700' }}>Size</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'grey.700' }}>Occupancy</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'grey.700' }}>Sell Probability</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'grey.700' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((property) => (
                    <StyledTableRow 
                      key={property.id} 
                      priority={getPriorityLabel(property.sellProb)}
                      onClick={() => handlePropertyClick(property.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation();
                            handleStarToggle(property.id);
                          }}
                          sx={{ color: 'grey.400' }}
                        >
                          <StarBorderIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HomeIcon sx={{ color: 'grey.500', fontSize: '1.2rem' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', cursor: 'pointer' }} onClick={(event) => {
                            event.stopPropagation();
                            handlePropertyClick(property.id);
                          }}>
                            {property.address}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ color: 'grey.500', fontSize: '1.2rem' }} />
                          <Typography variant="body2" sx={{ color: 'grey.600' }}>
                            {property.owner}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SquareFootIcon sx={{ color: 'grey.500', fontSize: '1.2rem' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {property.sf.toLocaleString()} SF
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {property.occupancy}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <ScoreDisplay score={property.sellProb}>
                          <Typography className="score-value">
                            {property.sellProb}%
                          </Typography>
                          <Typography className="score-label">
                            Sell Probability
                          </Typography>
                        </ScoreDisplay>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.75} flexWrap="wrap">
                          {property.sellProb >= 75 && (
                            <ActionButton variant="urgent" size="small">
                              Urgent Call
                            </ActionButton>
                          )}
                          {property.sellProb >= 50 && property.sellProb < 75 && (
                            <ActionButton variant="contact" size="small">
                              Follow Up
                            </ActionButton>
                          )}
                          <ActionButton variant="details" size="small" onClick={(event) => {
                            event.stopPropagation();
                            handlePropertyClick(property.id);
                          }}>
                            Details
                          </ActionButton>
                        </Stack>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Footer */}
            <Paper
              sx={{
                bgcolor: 'white',
                borderTop: 1,
                borderColor: 'grey.200',
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Typography variant="body2" sx={{ color: 'grey.600' }}>
                Showing {filteredData.length} of {propertiesData.length} results
      </Typography>
              <Button
                variant="contained"
                sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
              >
                Load More
              </Button>
            </Paper>
          </>
        ) : (
          /* Map View */
          <Box sx={{ flex: 1, p: 1, bgcolor: 'white', width: '100%' }}>
            <MapPanel selectedRole="properties" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProspectingDashboard; 