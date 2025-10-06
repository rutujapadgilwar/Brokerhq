import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
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
} from '@mui/material';
import {
  Star as StarBorderIcon,
  Search as SearchIcon,
  FileDownload as ExportIcon,
  Map as MapIcon,
  ViewList as ListIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { buyerData } from '../../data/mockData';
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

const BuyerDashboard = ({ viewMode, setViewMode }) => {
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleStarToggle = (id) => {
    console.log('Toggle star for buyer:', id);
  };

  const handleBuyerClick = (buyerId) => {
    navigate(`/buyer/${buyerId}`);
  };

  const getPriorityLabel = (interestScore) => {
    if (interestScore >= 75) return 'high';
    if (interestScore >= 50) return 'medium';
    return 'low';
  };

  const filteredData = buyerData.filter(buyer => {
    // Apply filters based on the FilterPanel state
    if (filters.scoreRange) {
      const [min, max] = filters.scoreRange;
      if (buyer.interestScore < min || buyer.interestScore > max) return false;
    }
    return true;
  });

  const highCount = buyerData.filter(b => b.interestScore >= 75).length;
  const mediumCount = buyerData.filter(b => b.interestScore >= 50 && b.interestScore < 75).length;
  const lowCount = buyerData.filter(b => b.interestScore < 50).length;

  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
      {/* Left Sidebar - Using FilterPanel */}
      <Box sx={{ width: 300, p: 2, flexShrink: 0 }}>
        <FilterPanel 
          selectedRole="buyer" 
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
              {filteredData.length} buyers found
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
                  bgcolor: 'warning.main',
                  '&:hover': { bgcolor: 'warning.dark' },
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
                  bgcolor: 'warning.main',
                  '&:hover': { bgcolor: 'warning.dark' },
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
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'grey.700' }}>Buyer Name</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'grey.700' }}>Investment Type</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'grey.700' }}>Target Size</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'grey.700' }}>Budget</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'grey.700' }}>Interest Score</TableCell>
                    <TableCell sx={{ bgcolor: 'grey.50', fontWeight: 600, color: 'grey.700' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((buyer) => (
                    <StyledTableRow 
                      key={buyer.id} 
                      priority={getPriorityLabel(buyer.interestScore)}
                      onClick={() => handleBuyerClick(buyer.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarToggle(buyer.id);
                          }}
                          sx={{ color: 'grey.400' }}
                        >
                          <StarBorderIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessIcon sx={{ color: 'grey.500', fontSize: '1.2rem' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {buyer.buyerName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'grey.600' }}>
                          {buyer.targetAssetTypes}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {buyer.preferredDealSize}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MoneyIcon sx={{ color: 'grey.500', fontSize: '1.2rem' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {buyer.budget || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <ScoreDisplay score={buyer.interestScore}>
                          <Typography className="score-value">
                            {buyer.interestScore || '0'}
                          </Typography>
                          <Typography className="score-label">
                            Interest Score
                          </Typography>
                        </ScoreDisplay>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.75} flexWrap="wrap">
                          {buyer.interestScore >= 75 && (
                            <ActionButton 
                              variant="urgent" 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle urgent call action
                              }}
                            >
                              Urgent Call
                            </ActionButton>
                          )}
                          {buyer.interestScore >= 50 && buyer.interestScore < 75 && (
                            <ActionButton 
                              variant="contact" 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle follow up action
                              }}
                            >
                              Follow Up
                            </ActionButton>
                          )}
                          <ActionButton 
                            variant="details" 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBuyerClick(buyer.id);
                            }}
                          >
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
                Showing {filteredData.length} of {buyerData.length} results
              </Typography>
              <Button
                variant="contained"
                sx={{ bgcolor: 'warning.main', '&:hover': { bgcolor: 'warning.dark' } }}
              >
                Load More
              </Button>
            </Paper>
          </>
        ) : (
          /* Map View */
          <Box sx={{ flex: 1, p: 1, bgcolor: 'white', width: '100%' }}>
            <MapPanel selectedRole="buyer" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BuyerDashboard; 