import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Button,
  styled,
  Chip,
  Stack,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays } from 'date-fns';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    background: 'linear-gradient(45deg, #45a049 30%, #4CAF50 90%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
}));

const FilterPanel = ({ selectedRole, onFilterChange }) => {
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    dateRange: [null, null],
    priceRange: [0, 100000000],
    scoreRange: [0, 100],
    status: '',
  });

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      type: '',
      location: '',
      dateRange: [null, null],
      priceRange: [0, 100000000],
      scoreRange: [0, 100],
      status: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const getTypeOptions = () => {
    switch (selectedRole) {
      case 'properties':
        return ['Office', 'Retail', 'Industrial', 'Multi-Family', 'Land'];
      case 'tenants':
        return ['Technology', 'Healthcare', 'Retail', 'Financial', 'Manufacturing'];
      case 'buyers':
        return ['Institutional', 'Private Equity', 'REIT', 'Developer', 'Individual'];
      default:
        return [];
    }
  };

  const getLocationOptions = () => {
    return ['Seattle', 'Bellevue', 'Redmond', 'Kirkland', 'Tacoma'];
  };

  const formatPrice = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  return (
    <StyledPaper>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {Object.entries(filters).map(([key, value]) => {
            if (value && value !== '' && !Array.isArray(value)) {
              return (
                <Chip
                  key={key}
                  label={`${key}: ${value}`}
                  onDelete={() => handleFilterChange(key, '')}
                />
              );
            }
            return null;
          })}
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.type}
            label="Type"
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {getTypeOptions().map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Location</InputLabel>
          <Select
            value={filters.location}
            label="Location"
            onChange={(e) => handleFilterChange('location', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {getLocationOptions().map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedRole === 'properties' && (
          <>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={filters.priceRange}
              onChange={(_, value) => handleFilterChange('priceRange', value)}
              valueLabelDisplay="auto"
              valueLabelFormat={formatPrice}
              min={0}
              max={100000000}
              step={1000000}
            />
          </>
        )}

        <Typography gutterBottom>Score Range</Typography>
        <Slider
          value={filters.scoreRange}
          onChange={(_, value) => handleFilterChange('scoreRange', value)}
          valueLabelDisplay="auto"
          min={0}
          max={100}
        />

        <FormControl fullWidth size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={filters.dateRange[0]}
            onChange={(date) =>
              handleFilterChange('dateRange', [date, filters.dateRange[1]])
            }
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
          <DatePicker
            label="End Date"
            value={filters.dateRange[1]}
            onChange={(date) =>
              handleFilterChange('dateRange', [filters.dateRange[0], date])
            }
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
        </LocalizationProvider>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <GradientButton
            fullWidth
            variant="contained"
            onClick={() => onFilterChange(filters)}
          >
            Apply Filters
          </GradientButton>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleReset}
            sx={{ borderRadius: '8px' }}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default FilterPanel; 