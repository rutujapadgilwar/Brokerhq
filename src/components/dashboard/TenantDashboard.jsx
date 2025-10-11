import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
} from "@mui/material";
import {
  Map as MapIcon,
  ViewList as ListIcon,
  Business as BusinessIcon,
  Handshake as HandshakeIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import FilterPanel from "../filters/FilterPanel";
import MapPanel from "../map/MapPanel";
import Tooltip from "@mui/material/Tooltip";
import { useSearchParams } from "react-router-dom";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import IconButton from "@mui/material/IconButton";
import SaveForLaterButton from "../tenantDetailsPage/SaveForLaterButton";

// Styled components
// Update getRowColorBar function
function getRowColorBar(tenant) {
  const months = Number(tenant.move_probability ?? 0);
  if (months < 6) return "#FF3B30"; // Red for urgent (<6 months)
  if (months >= 6 && months < 12) return "#FF9500"; // Orange/Warm (6-12 months)
  return "#34C759"; // Green for rest (>=12 months)
}

// Update StyledTableRow to use 'rowcolor' instead of 'colorbar'
const StyledTableRow = styled(TableRow)({
  cursor: "pointer",
});

const ScoreDisplay = styled(Box)(({ theme, score }) => ({
  textAlign: "center",
  "& .score-value": {
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: "2px",
    ...(score >= 85 && { color: theme.palette.error.main }),
    ...(score >= 60 && score < 85 && { color: theme.palette.warning.main }),
    ...(score >= 10 && score < 60 && { color: theme.palette.success.main }),
    ...(score < 10 && { color: theme.palette.grey[500] }),
  },
  "& .score-label": {
    fontSize: "0.75rem",
    color: theme.palette.grey[600],
  },
}));

const TenantDashboard = ({ viewMode, setViewMode, search }) => {
  // State for fetched tenant data
  const [tenantData, setTenantData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    urgent: false,
    hot: false,
    warm: false,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [callPopup, setCallPopup] = useState({
    open: false,
    phone: "",
    company: "",
  });

  const [searchParams] = useSearchParams();
  const industryFilter = searchParams.get("industry");
  const [sortConfig, setSortConfig] = useState({
    direction: "asc",
  });
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const handleSort = (e) => {
    e.stopPropagation();
    setSortConfig((prev) => ({
      direction: prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Fetch data from backend API on mount
  useEffect(() => {
    const fetchTenantsAndLeases = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/tenants`);
        if (!res.ok) throw new Error("Failed to fetch tenants");
        const tenants = await res.json();

        const today = new Date();

        const processedTenants = await Promise.all(
          tenants.map(async (tenant) => {
            let leaseExpiration = "--";
            let monthsUntilExpiration = "--";
            const tenantId = tenant.tenant_id || tenant._id;
            if (!tenantId) {
              console.log(
                `Tenant: ${tenant.tenant_name}, Lease Expiration: ${leaseExpiration}, Months: ${monthsUntilExpiration} (No tenant_id)`
              );
              return { ...tenant, leaseExpiration, monthsUntilExpiration };
            }

            try {
              const propertyRes = await fetch(
                `${backendUrl}/property_details/${tenantId}`
              );

              if (!propertyRes.ok) throw new Error("No property data");
              const propertyData = await propertyRes.json();
              const data = propertyData.data[0];
              const allReports = data?.All_Reports || {};

              let leases = [];
              let leaseCount = 0;

              Object.values(allReports).forEach((reportArr) => {
                reportArr.forEach((report) => {
                  (report.Leases || []).forEach((lease) => {
                    if (
                      lease["Real Estate Property"] === "Yes" &&
                      lease["Lease Expiration Date"]
                    ) {
                      leaseCount += 1;

                      const rawDate = lease[
                        "clean_lease_expiration_date"
                      ]?.replace(/\u00A0/g, " ");
                      const parsedDate = new Date(rawDate);
                      if (!isNaN(parsedDate)) {
                        leases.push({ ...lease, parsedDate });
                      }
                    }
                  });
                });
              });

              // Sort and get nearest future lease
              leases.sort((a, b) => a.parsedDate - b.parsedDate);
              const nearestLease = leases.find((l) => l.parsedDate > today);

              leaseExpiration = nearestLease
                ? nearestLease.parsedDate.toLocaleDateString()
                : "--";
              monthsUntilExpiration = nearestLease
                ? Math.ceil(
                    (nearestLease.parsedDate - today) /
                      (1000 * 60 * 60 * 24 * 30)
                  )
                : "--";

              return { ...tenant, leaseExpiration, monthsUntilExpiration };
            } catch (err) {
              console.warn(
                `Tenant ${
                  tenant.ticker || tenant.tenant_id
                } property fetch error: ${err.message}`
              );

              return { ...tenant, leaseExpiration, monthsUntilExpiration };
            }
          })
        );

        setTenantData(processedTenants);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantsAndLeases();
  }, []);
  // Preselect tenant type if coming from IndustryDashboard
  useEffect(() => {
    if (industryFilter) {
      setFilters((prev) => ({
        ...prev,
        tenantTypes: { [industryFilter]: true },
      }));
    }
  }, [industryFilter]);


  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleTenantClick = (tenantId) => {
    navigate(`/tenant/${tenantId}`);
  };

  const filteredData = useMemo(() => {
    const searchLower = (search || "").toLowerCase();

    return tenantData
      .filter((tenant) => {
        // --- Search ---
        const matchesSearch =
          !searchLower ||
          tenant.tenant_name?.toLowerCase().includes(searchLower) ||
          tenant.sector?.toLowerCase().includes(searchLower) ||
          tenant.headquarter_address?.city
            ?.toLowerCase()
            .includes(searchLower) ||
          tenant.headquarter_address?.state
            ?.toLowerCase()
            .includes(searchLower);

        // --- Industry filter (from URL) ---
        const matchesIndustry =
          !industryFilter ||
          tenant.sector?.toLowerCase() === industryFilter.toLowerCase();

        // --- Tenant Type filter ---
        const activeTenantTypes = Object.entries(filters.tenantTypes || {})
          .filter(([_, checked]) => checked)
          .map(([type]) => type.toLowerCase());

        const matchesTenantType =
          activeTenantTypes.length === 0 ||
          activeTenantTypes.some((type) =>
            tenant.sector?.toLowerCase().includes(type)
          );

        // --- Lease Term filter ---
        const months = Number(tenant.monthsUntilExpiration ?? 9999);
        const leaseTerm = filters.leaseTerm || {};
        let matchesLeaseTerm = true;

        if (leaseTerm["0-6 Months"]) matchesLeaseTerm = months <= 6;
        else if (leaseTerm["7-12 Months"])
          matchesLeaseTerm = months >= 7 && months <= 12;
        else if (leaseTerm["13-18 Months"])
          matchesLeaseTerm = months >= 13 && months <= 18;
        else if (leaseTerm["18+ Months"]) matchesLeaseTerm = months > 18;

        // --- Location filter ---
        const selectedLocations = filters.selectedLocations || [];
        const tenantCity = tenant.headquarter_address?.city?.toLowerCase();
        const tenantState = tenant.headquarter_address?.state?.toLowerCase();

        const matchesLocation =
          selectedLocations.length === 0 ||
          selectedLocations.some(
            (loc) =>
              tenantCity?.includes(loc.toLowerCase()) ||
              tenantState?.includes(loc.toLowerCase())
          );

        return (
          matchesSearch &&
          matchesIndustry &&
          matchesTenantType &&
          matchesLeaseTerm &&
          matchesLocation
        );
      })
      .sort((a, b) => {
        // --- Sort by lease expiration ---
        const parseDate = (dateStr) => {
          if (!dateStr || dateStr === "--") return null;
          const [month, day, year] = dateStr
            .split("/")
            .map((num) => parseInt(num, 10));
          return new Date(year, month - 1, day);
        };

        const dateA = parseDate(a.leaseExpiration);
        const dateB = parseDate(b.leaseExpiration);

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        const comparison = dateA.getTime() - dateB.getTime();
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
  }, [tenantData, search, filters, industryFilter, sortConfig]);

  // Update the counts for urgent, hot, and warm using move_probability only
  const urgentCount = filteredData.filter(
    (t) => Number(t.monthsUntilExpiration ?? 0) < 6
  ).length;
  const hotCount = filteredData.filter((t) => {
    const prob = Number(t.monthsUntilExpiration ?? 0);
    return prob < 12 && prob > 6;
  }).length;
  const warmCount = filteredData.filter(
    (t) => Number(t.monthsUntilExpiration ?? 0) < 100
  ).length;

  const getLatestJobCount = (jobCounts) => {
    if (!Array.isArray(jobCounts) || jobCounts.length === 0) return "N/A";

    // Sort by date in descending order and get the first (most recent) count
    const latestCount = jobCounts.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0].count;

    return latestCount ?? "N/A";
  };

  // later in render

  // Add GradientButton styled component
  const GradientButton = styled(Button)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
    color: "white",
    textTransform: "none",
    fontWeight: 500,
    padding: "10px 24px",
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[2],
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
      boxShadow: theme.shadows[4],
      transform: "translateY(-1px)",
    },
  }));

  // Loading and error states
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      {/* Left Sidebar - Using FilterPanel */}
      <Box sx={{ width: 300, p: 2, flexShrink: 0 }}>
        <FilterPanel
          selectedRole="tenant"
          onFilterChange={handleFilterChange}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {/* Content Header */}
        {/* <Paper
          sx={{
            bgcolor: "white",
            p: 2.5,
            borderBottom: 1,
            borderColor: "grey.200",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        > */}
          {/* <Box sx={{ display: "flex", gap: 3.75, alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "grey.600" }}>
              {filteredData.length} tenants found
            </Typography>
            <Box sx={{ display: "flex", gap: 2.5 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{ color: "error.main", fontWeight: 700 }}
                >
                  {urgentCount}
                </Typography>
                <Typography variant="caption" sx={{ color: "grey.600" }}>
                  Urgent
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{ color: "warning.main", fontWeight: 700 }}
                >
                  {hotCount}
                </Typography>
                <Typography variant="caption" sx={{ color: "grey.600" }}>
                  Hot
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{ color: "success.main", fontWeight: 700 }}
                >
                  {warmCount}
                </Typography>
                <Typography variant="caption" sx={{ color: "grey.600" }}>
                  Warm
                </Typography>
              </Box>
            </Box>
          </Box> */}
          {/* <Stack direction="row" spacing={1.25}>
            <GradientButton
              variant={viewMode === "list" ? "contained" : "outlined"}
              startIcon={<ListIcon />}
              onClick={() => setViewMode("list")}
              sx={{
                ...(viewMode !== "list" && {
                  background: "transparent",
                  color: "success.main",
                  boxShadow: "none",
                  border: "1px solid",
                  borderColor: "success.main",
                  "&:hover": {
                    background: "rgba(76, 175, 80, 0.08)",
                  },
                }),
              }}
            >
              List View
            </GradientButton>
            <Button
              variant={viewMode === "map" ? "contained" : "outlined"}
              startIcon={<MapIcon />}
              onClick={() => setViewMode("map")}
              sx={{
                ...(viewMode === "map" && {
                  bgcolor: "success.main",
                  "&:hover": { bgcolor: "success.dark" },
                }),
              }}
            >
              Map View
            </Button>
          </Stack> */}

        {/* Content Area - Table or Map */}
        {viewMode === "list" ? (
          <>
            {/* Table */}
            <TableContainer sx={{ flex: 1, bgcolor: "white", width: "100%" }}>
              <Table stickyHeader sx={{ width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 5, p: 0, bgcolor: "grey.50" }} />
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 600,
                        color: "grey.900",
                        verticalAlign: "top",
                      }}
                    >
                      COMPANY
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 600,
                        color: "grey.900",
                        verticalAlign: "top",
                      }}
                    >
                      LOCATION
                    </TableCell>
                    {/* <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 600,
                        color: "grey.900",
                        textAlign: "center",
                        verticalAlign: "top",
                      }}
                    >
                      MOVE PROBABILITY
                    </TableCell> */}
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 600,
                        color: "grey.900",
                        textAlign: "center",
                        verticalAlign: "top",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        LEASE EXPIRATION
                        <IconButton
                          size="small"
                          onClick={handleSort}
                          sx={{ ml: 1 }}
                        >
                          {sortConfig.direction === "asc" ? (
                            <ArrowDownwardIcon fontSize="small" />
                          ) : (
                            <ArrowUpwardIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 600,
                        color: "grey.900",
                        textAlign: "center",
                        verticalAlign: "top",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 0.5,
                          verticalAlign: "top",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, fontSize: "0.85rem" }}
                        >
                          HEAD COUNT GROWTH
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "grey.500", fontSize: "0.7rem" }}
                        >
                          (6 MONTHS)
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 600,
                        color: "grey.900",
                        textAlign: "center",
                        verticalAlign: "top",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, fontSize: "0.85rem" }}
                        >
                          REVENUE GROWTH
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "grey.500", fontSize: "0.7rem" }}
                        >
                          (12 MO REVENUE)
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 600,
                        color: "grey.900",
                        textAlign: "center",
                        width: "180px",
                        verticalAlign: "top",
                      }}
                    >
                      ACTIVE JOB POSTING
                    </TableCell>
                    <TableCell
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 600,
                        color: "grey.900",
                        textAlign: "center",
                        verticalAlign: "top",
                      }}
                    >
                      ACTION
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((tenant, idx) => {
                      const rowcolor = getRowColorBar({
                        move_probability: tenant.monthsUntilExpiration,
                      });
                      // Lease expiration and months until expiration: you may need to add these fields to your data
                      const leaseExpiration = tenant.leaseExpiration || "--";
                      const monthsUntilExpiration =
                        tenant.monthsUntilExpiration ?? "--";
                      // Location formatting
                      const location = tenant.headquarter_address
                        ? `${tenant.headquarter_address.city}, ${tenant.headquarter_address.state}`
                        : "--";
                      const subLocation =
                        tenant.headquarter_address?.street || "";
                      // Revenue growth percent: fallback to 2 decimals
                      const revenueGrowthPercent =
                        tenant.revenue_growth_12mo_percent != null
                          ? `${tenant.revenue_growth_12mo_percent.toFixed(2)}%`
                          : "--";
                      // Revenue growth amount: show in $K
                      const revenueGrowthAmount =
                        tenant.revenue_growth_12mo_amount != null
                          ? `+$${(
                              tenant.revenue_growth_12mo_amount / 1000
                            ).toLocaleString()}K`
                          : "--";
                      // Headcount growth percent
                      const headcountGrowthPercent =
                        tenant.headcount_growth_percentage != null
                          ? `${tenant.headcount_growth_percentage.toFixed(2)}%`
                          : "--";
                      // Headcount growth number
                      const headcountGrowth =
                        tenant.headcount_growth != null
                          ? tenant.headcount_growth
                          : "--";
                      // // Move probability
                      // const moveProbability =
                      //   tenant.move_probability_score?.score ?? "--";

                      
                      return (
                        <StyledTableRow
                          key={tenant._id || idx}
                          onClick={() => handleTenantClick(tenant._id || idx)}
                          sx={{ cursor: "pointer" }}
                        >
                          {/* Color bar */}
                          <TableCell
                            sx={{
                              width: 12,
                              p: 0,
                              background: rowcolor,
                              border: "none",
                            }}
                          />
                          {/* Company & Industry */}
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "primary.main" }}
                            >
                              {tenant.tenant_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "grey.600" }}
                            >
                              {tenant.industry}
                            </Typography>
                          </TableCell>
                          {/* Location & Sub-location */}
                          <TableCell>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {location}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "grey.500" }}
                              >
                                {subLocation}
                              </Typography>
                            </Box>
                          </TableCell>
                          {/* Move Probability */}
                          {/* <TableCell sx={{ textAlign: "center" }}>
                            <ScoreDisplay score={moveProbability}>
                              <Typography className="score-value">
                                {moveProbability}%
                              </Typography>
                              <Typography className="score-label">
                                Move Probability
                              </Typography>
                            </ScoreDisplay>
                          </TableCell> */}
                          {/* Lease Expiration & Months Until Expiration */}
                          <TableCell sx={{ textAlign: "center" }}>
                            <Chip
                              label={leaseExpiration ?? "--"}
                              size="small"
                              // color={
                              //   Number(monthsUntilExpiration) < 6
                              //     ? "error"
                              //     : Number(monthsUntilExpiration) <= 15
                              //     ? "warning"
                              //     : "success"
                              // }
                              sx={{ fontWeight: 500 ,
                                color : "black"
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                color: "grey.600",
                                mt: 0.5,
                              }}
                            >
                              {monthsUntilExpiration !== "--"
                                ? `${monthsUntilExpiration} months`
                                : "--"}
                            </Typography>
                          </TableCell>
                          {/* Headcount Growth & % */}
                          <TableCell sx={{ textAlign: "center" }}>
                            <Tooltip
                              title={`Headcount Growth: Number of employees added in past 6 months. ${headcountGrowth}`}
                              arrow
                            >
                              <span style={{ cursor: "help" }}>
                                {headcountGrowthPercent}
                                {headcountGrowth !== "--"
                                  ? ` (${headcountGrowth})`
                                  : ""}
                              </span>
                            </Tooltip>
                          </TableCell>
                          {/* Revenue Growth & % */}
                          <TableCell sx={{ textAlign: "center" }}>
                            <Tooltip
                              title={`Revenue Growth: 12-month trailing revenue increase. ${revenueGrowthAmount}`}
                              arrow
                            >
                              <span style={{ cursor: "help" }}>
                                {revenueGrowthPercent}
                                {revenueGrowthAmount !== "--"
                                  ? ` (${revenueGrowthAmount})`
                                  : ""}
                              </span>
                            </Tooltip>
                          </TableCell>
                          {/* Job Count */}
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ color: "grey.800" }}
                              >
                                {getLatestJobCount(tenant.job_counts) ?? "N/A"}
                              </Typography>
                            </Box>
                          </TableCell>
                          {/* Actions */}
                          <SaveForLaterButton
                             userId={"brokerhq"} tenantId={tenant.tenant_id || tenant._id} 
                          
                          />
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={filteredData.length}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[10, 25, 50, 100]}
              />
            </TableContainer>

            {/** call popup card component */}
            {callPopup.open && (
              <Box
                sx={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1300,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  borderRadius: 2,
                  p: 3,
                  minWidth: 300,
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Call {callPopup.company}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Phone: <strong>{callPopup.phone}</strong>
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    setCallPopup({ open: false, phone: "", company: "" })
                  }
                  sx={{ mt: 1 }}
                  fullWidth
                >
                  Close
                </Button>
              </Box>
            )}

            {/* Footer */}
            <Paper
              sx={{
                bgcolor: "white",
                borderTop: 1,
                borderColor: "grey.200",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography variant="body2" sx={{ color: "grey.600" }}>
                Showing {filteredData.length} of {tenantData.length} results
              </Typography>
            </Paper>
          </>
        ) : (
          /* Map View */
          <Box sx={{ flex: 1, p: 1, bgcolor: "white", width: "100%" }}>
            <MapPanel selectedRole="tenant" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TenantDashboard;
