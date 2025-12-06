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
  useEffect(() => {
    const fetchTenantDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/api/tenant_dashboard`);
        if (!res.ok) throw new Error("Failed to fetch tenant dashboard data");
        const data = await res.json();
        setTenantData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTenantDashboard();
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
          tenant.tenant_info.tenant_name?.toLowerCase().includes(searchLower) ||
          tenant.tenant_info.sector?.toLowerCase().includes(searchLower) ||
          tenant.tenant_info.headquarter_address?.city
            ?.toLowerCase()
            .includes(searchLower) ||
          tenant.tenant_info.headquarter_address?.state
            ?.toLowerCase()
            .includes(searchLower);

        // --- Industry filter (from URL) ---
        const matchesIndustry =
          !industryFilter ||
          tenant.tenant_info.sector?.toLowerCase() ===
            industryFilter.toLowerCase();

        // --- Tenant Type filter ---
        const activeTenantTypes = Object.entries(filters.tenantTypes || {})
          .filter(([_, checked]) => checked)
          .map(([type]) => type.toLowerCase());

        const matchesTenantType =
          activeTenantTypes.length === 0 ||
          activeTenantTypes.some((type) =>
            tenant.tenant_info.sector?.toLowerCase().includes(type)
          );

        // --- Lease Term filter ---
        const months = Number(tenant.months_until_expiration ?? 9999);
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
        const tenantCity =
          tenant.tenant_info.headquarter_address?.city?.toLowerCase();
        const tenantState =
          tenant.tenant_info.headquarter_address?.state?.toLowerCase();
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
        // Convert YYYY-MM-DD to Date object
        const parseDate = (dateStr) => {
          if (!dateStr) return null;
          return new Date(dateStr); // ISO format parses directly
        };

        const dateA = parseDate(a.nearest_lease_expiration);
        const dateB = parseDate(b.nearest_lease_expiration);

        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;

        const comparison = dateA.getTime() - dateB.getTime();
        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
  }, [tenantData, search, filters, industryFilter, sortConfig]);

  const getLatestJobCount = (jobCounts) => {
    if (!Array.isArray(jobCounts) || jobCounts.length === 0) return "N/A";

    // Sort by date in descending order and get the first (most recent) count
    const latestCount = jobCounts.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0].count;

    return latestCount ?? "N/A";
  };

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
                      COMPANY LOGO
                    </TableCell>
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
                        move_probability: tenant.months_until_expiration,
                      });
                      // Lease expiration and months until expiration: you may need to add these fields to your data
                      const leaseExpiration =
                        tenant.nearest_lease_expiration || "--";
                      const months_until_expiration =
                        tenant.months_until_expiration ?? "--";
                      // Location formatting
                      const location = tenant.tenant_info.headquarter_address
                        ? `${tenant.tenant_info.headquarter_address.city}, ${tenant.tenant_info.headquarter_address.state}`
                        : "--";
                      const subLocation =
                        tenant.tenant_info.headquarter_address?.street || "";
                      // Revenue growth percent: fallback to 2 decimals
                      const revenueGrowthPercent =
                        tenant.tenant_info.revenue_growth_12mo_percent != null
                          ? `${tenant.tenant_info.revenue_growth_12mo_percent.toFixed(
                              2
                            )}%`
                          : "--";
                      // Revenue growth amount: show in $K
                      const revenueGrowthAmount =
                        tenant.tenant_info.revenue_growth_12mo_amount != null
                          ? `+$${(
                              tenant.tenant_info.revenue_growth_12mo_amount /
                              1000
                            ).toLocaleString()}K`
                          : "--";
                      // Headcount growth percent
                      const headcountGrowthPercent =
                        tenant.tenant_info.headcount_growth_percentage != null
                          ? `${tenant.tenant_info.headcount_growth_percentage.toFixed(
                              2
                            )}%`
                          : "--";
                      // Headcount growth number
                      const headcountGrowth =
                        tenant.tenant_info.headcount_growth != null
                          ? tenant.tenant_info.headcount_growth
                          : "--";

                      return (
                        <StyledTableRow
                          key={tenant.tenant_info._id || idx}
                          onClick={() =>
                            handleTenantClick(tenant.tenant_info._id || idx)
                          }
                          sx={{ cursor: "pointer" }}
                        >
                          {/* Color bar */}
                          <TableCell
                            sx={{
                              width: 4,
                              p: 0,
                              background: rowcolor,
                              border: "none",
                              borderRadius: 3,
                            }}
                          />
                          {/* Company Logo*/}
                          <TableCell>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "grey.200",
                              }}
                            >
                              {tenant.tenant_info.logo_url ? (
                                <img
                                  src={tenant.tenant_info.logo_url}
                                  alt={tenant.tenant_info.tenant_name}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = "none";
                                  }}
                                />
                              ) : (
                                <Typography
                                  sx={{ fontWeight: 700, color: "grey.700" }}
                                >
                                  {tenant.tenant_info.tenant_name
                                    ?.split(" ")
                                    .map((word) => word[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>

                          {/* Company & Industry */}
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "primary.main" }}
                            >
                              {tenant.tenant_info.tenant_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "grey.600" }}
                            >
                              {tenant.tenant_info.industry}
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
                          <TableCell sx={{ textAlign: "center" }}>
                            <Chip
                              label={leaseExpiration ?? "--"}
                              size="small"
                              // color={
                              //   Number(months_until_expiration) < 6
                              //     ? "error"
                              //     : Number(months_until_expiration) <= 15
                              //     ? "warning"
                              //     : "success"
                              // }
                              sx={{ fontWeight: 500, color: "black" }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                color: "grey.600",
                                mt: 0.5,
                              }}
                            >
                              {months_until_expiration !== "--"
                                ? `${months_until_expiration} months`
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
                                {getLatestJobCount(
                                  tenant.tenant_info.job_counts
                                ) ?? "N/A"}
                              </Typography>
                            </Box>
                          </TableCell>
                          {/* Actions */}
                          <SaveForLaterButton
                            userId={"brokerhq"}
                            tenantId={
                              tenant.tenant_info.tenant_id ||
                              tenant.tenant_info._id
                            }
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
