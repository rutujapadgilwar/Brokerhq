import React, { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "none",
  "&:before": { display: "none" },
}));

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  "&.Mui-checked": {
    color: theme.palette.primary.main,
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0, 0, 0, 0.1)" },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: 2,
  },
  "& .MuiSelect-select": {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: theme.shape.borderRadius * 2,
  },
}));
const GradientButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: "white",
  textTransform: "none",
  borderRadius: theme.shape.borderRadius * 2,
}));

const FilterPanel = ({ selectedRole, onFilterChange }) => {
  const theme = useTheme();

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [tenantTypes, setTenantTypes] = useState({
    Technology: false,
    "Financial Services": false,
    "Consumer Cyclical": false,
    "Communication Services": false,
    Industrials: false,
    Healthcare: false,
    "Consumer Defensive": false,
    Energy: false,
    "Basic Materials": false,
    "Real Estate": false,
    Utilities: false,
  });

  const [leaseTerm, setLeaseTerm] = useState({
    "0-6 Months": false,
    "7-12 Months": false,
    "13-18 Months": false,
    "18+ Months": false,
  });

  const locations = [
    {
      county: "King County",
      submarkets: ["Seattle", "Bellevue", "Redmond", "Kirkland"],
    },
    {
      county: "Pierce County",
      submarkets: ["Tacoma", "Lakewood", "Puyallup"],
    },
    {
      county: "Snohomish County",
      submarkets: ["Everett", "Lynnwood", "Bothell"],
    },
  ];

  // 🔥 Call parent on every change
  const updateFilters = (nextFilters) => {
    onFilterChange({
      tenantTypes,
      leaseTerm,
      selectedLocations,
      ...nextFilters,
    });
  };

  const handleLocationChange = (event) => {
    const { value } = event.target;
    let newSelectedSet = new Set(selectedLocations);

    const selectedNow = new Set(value);

    // figure out what was added or removed
    const added = [...selectedNow].filter((item) => !newSelectedSet.has(item));
    const removed = [...newSelectedSet].filter(
      (item) => !selectedNow.has(item)
    );

    locations.forEach((countyObj) => {
      // if a county was added → add county + all submarkets
      if (added.includes(countyObj.county)) {
        newSelectedSet.add(countyObj.county);
        countyObj.submarkets.forEach((s) => newSelectedSet.add(s));
      }

      // if a county was removed → remove county + all submarkets
      if (removed.includes(countyObj.county)) {
        newSelectedSet.delete(countyObj.county);
        countyObj.submarkets.forEach((s) => newSelectedSet.delete(s));
      }

      // if a submarket was added → check if all are selected
      countyObj.submarkets.forEach((sub) => {
        if (added.includes(sub)) {
          newSelectedSet.add(sub);
          const allSelected = countyObj.submarkets.every((s) =>
            newSelectedSet.has(s)
          );
          if (allSelected) newSelectedSet.add(countyObj.county);
        }
      });

      // if a submarket was removed → deselect county
      countyObj.submarkets.forEach((sub) => {
        if (removed.includes(sub)) {
          newSelectedSet.delete(sub);
          newSelectedSet.delete(countyObj.county);
        }
      });
    });

    setSelectedLocations([...newSelectedSet]);

    // 🔔 Pass to parent (TenantDashboard)
    onFilterChange({
      tenantTypes,
      leaseTerm,
      selectedLocations: [...newSelectedSet],
    });
  };

  const handleClearAll = () => {
    const resetTenantTypes = Object.fromEntries(
      Object.keys(tenantTypes).map((k) => [k, false])
    );
    const resetLeaseTerm = Object.fromEntries(
      Object.keys(leaseTerm).map((k) => [k, false])
    );
    setTenantTypes(resetTenantTypes);
    setLeaseTerm(resetLeaseTerm);
    setSelectedLocations([]);
    onFilterChange({
      tenantTypes: resetTenantTypes,
      leaseTerm: resetLeaseTerm,
      selectedLocations: [],
    });
  };

  return (
    <Box p={2}>
      {/* Location Filter */}
      <StyledAccordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            Location
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Select Location</InputLabel>
            <Select
              multiple
              value={selectedLocations}
              onChange={handleLocationChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {locations.map((location) => [
                <MenuItem
                  key={location.county}
                  value={location.county}
                  sx={{
                    fontWeight: 600,
                    bgcolor: selectedLocations.includes(location.county)
                      ? theme.palette.primary.light
                      : "inherit",
                    "&:hover": { bgcolor: theme.palette.primary.light },
                  }}
                >
                  {" "}
                  {location.county}{" "}
                </MenuItem>,
                location.submarkets.map((submarket) => (
                  <MenuItem
                    key={submarket}
                    value={submarket}
                    sx={{
                      ml: 2,
                      bgcolor: selectedLocations.includes(submarket)
                        ? theme.palette.primary.light
                        : "inherit",
                      "&:hover": { bgcolor: theme.palette.primary.light },
                    }}
                  >
                    {" "}
                    {submarket}{" "}
                  </MenuItem>
                )),
              ])}
            </Select>
          </FormControl>
        </AccordionDetails>
      </StyledAccordion>

      {/* Tenant Type */}
      {selectedRole === "tenant" && (
        <StyledAccordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >Industry Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup>
              {Object.entries(tenantTypes).map(([type, checked]) => (
                <FormControlLabel
                  key={type}
                  control={
                    <StyledCheckbox
                      checked={checked}
                      onChange={() => {
                        const updated = { ...tenantTypes, [type]: !checked };
                        setTenantTypes(updated);
                        updateFilters({ tenantTypes: updated });
                      }}
                    />
                  }
                  label={type}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </StyledAccordion>
      )}

      {/* Lease Term */}
      <StyledAccordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >Lease Term</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {Object.entries(leaseTerm).map(([term, checked]) => (
              <FormControlLabel
                key={term}
                control={
                  <StyledCheckbox
                    checked={checked}
                    onChange={() => {
                      const updated = { ...leaseTerm, [term]: !checked };
                      setLeaseTerm(updated);
                      updateFilters({ leaseTerm: updated });
                    }}
                  />
                }
                label={term}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </StyledAccordion>

      <GradientButton fullWidth onClick={handleClearAll} sx={{ mt: 2 }}>
        Clear All Filters
      </GradientButton>
    </Box>
  );
};

export default FilterPanel;
