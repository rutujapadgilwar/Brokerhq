import React from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Avatar,
  Link as MuiLink,
  Card,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Public as PublicIcon,
  Phone as PhoneIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Work as WorkIcon,
} from "@mui/icons-material";

export default function HeaderSection({ tenant, eightkData }) {
  if (!tenant) return null;

  // Safely flatten all 8-K updates, ignoring empty or malformed entries
  const updates = (Array.isArray(eightkData) ? eightkData : [eightkData])
    .flatMap((item) => (Array.isArray(item?.filings) ? item.filings : []))
    .flatMap((filing) =>
      Array.isArray(filing?.extraction)
        ? filing.extraction.map((update) => ({
            Name:
              update?.Name ||
              update?.name ||
              update?.officer ||
              update?.person ||
              "N/A",
            Role_Affected:
              update?.Role_Affected ||
              update?.role ||
              update?.position ||
              "N/A",
            Type_of_Change:
              update?.Type_of_Change ||
              update?.change ||
              update?.action ||
              "N/A",
            Effective_Date:
              update?.Effective_Date ||
              update?.date ||
              update?.effectiveDate ||
              "N/A",
            One_Line_Update:
              update?.["One-Line_Update"] || // dash fix
              update?.One_Line_Update ||
              update?.summary ||
              update?.update ||
              "",
            Notes:
              update?.["Reason/Notes"] || update?.notes || update?.reason || "",
            URL: update?.URL || update?.url || filing?.url || "#",
          }))
        : []
    );
  // Safe fallback for first filing URL
  const firstFilingUrl = Array.isArray(eightkData)
    ? eightkData
        .flatMap((item) => (Array.isArray(item?.filings) ? item.filings : []))
        .find((f) => Array.isArray(f?.extraction) && f.extraction.length)
        ?.url || "#"
    : "#";
  
  const getLatestJobCount = (jobCounts) => {
    if (!Array.isArray(jobCounts) || jobCounts.length === 0) return "N/A";
    
    // Sort by date in descending order and get the first (most recent) count
    const latestCount = jobCounts
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
      .count;
      
    return latestCount ?? "N/A";
  };
  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: 3, py: 6 }}>
      {/* Company Top Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 72,
              height: 72,
              fontSize: 28,
              fontWeight: 700,
              boxShadow: 3,
            }}
          >
            {tenant.tenant_name?.charAt(0) || "?"}
          </Avatar>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              {tenant.tenant_name || "N/A"}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {tenant.sector || "N/A"} •{" "}
              {tenant.employees_headcount?.toLocaleString() || "N/A"} Employees
              • {tenant.industry || "N/A"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Info Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard
            icon={<LocationIcon color="primary" />}
            label="HQ"
            value={`${tenant.headquarter_address?.city || "N/A"}, ${
              tenant.headquarter_address?.state || "N/A"
            }`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard
            icon={<PublicIcon color="primary" />}
            label="Website"
            value={
              tenant.website ? (
                <MuiLink
                  href={tenant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {tenant.website}
                </MuiLink>
              ) : (
                "N/A"
              )
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard
            icon={<PhoneIcon color="primary" />}
            label="Phone"
            value={tenant.phone || "N/A"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard
            icon={
              tenant.revenue_growth_12mo_percent > 0 ? (
                <TrendingUpIcon sx={{ color: "success.main" }} />
              ) : tenant.revenue_growth_12mo_percent < 0 ? (
                <TrendingDownIcon sx={{ color: "error.main" }} />
              ) : (
                <TrendingFlatIcon sx={{ color: "warning.main" }} />
              )
            }
            label="Revenue Growth (12mo)"
            value={
              tenant.revenue_growth_12mo_percent != null
                ? `${tenant.revenue_growth_12mo_percent}%`
                : "N/A"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard
            icon={
              tenant.headcount_growth_percentage > 0 ? (
                <TrendingUpIcon sx={{ color: "success.main" }} />
              ) : tenant.headcount_growth_percentage < 0 ? (
                <TrendingDownIcon sx={{ color: "error.main" }} />
              ) : (
                <TrendingFlatIcon sx={{ color: "warning.main" }} />
              )
            }
            label="Headcount Growth (6mo)"
            value={
              tenant.headcount_growth_percentage != null
                ? `${tenant.headcount_growth_percentage}%`
                : "N/A"
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <InfoCard
            icon={<WorkIcon color="primary" />}
            label="Active Jobs"
            value={getLatestJobCount(tenant.job_counts) ?? "N/A"}
          />
        </Grid>
      </Grid>

    
    </Box>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: "16px",
        bgcolor: "white",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 2,
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        },
      }}
    >
      {icon}
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          {label}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
