import React, { useMemo, memo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActionArea,
  Typography,
  Grid,
  Avatar,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  CircularProgress,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/* --- Individual Card (memoized to prevent rerenders) --- */
const LeaseCard = memo(({ lease, color, labelPrefix }) => (
  <Card
    sx={{
      cursor: "pointer",
      borderRadius: 3,
      boxShadow: 4,
      border: `2px solid ${color}`,
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: 8,
      },
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <CardActionArea
      component="a"
      href={lease.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ flexGrow: 1 }}
    >
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: color }}><BusinessIcon /></Avatar>}
        title={
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
            {lease["Lease Property Address"]}
          </Typography>
        }
        subheader={
          <Chip
            label={`${labelPrefix}: ${
              lease["clean_lease_expiration_date"] ||
              lease["Lease Expiration Date"]
            }`}
            color="primary"
            size="small"
            sx={{ mt: 1 }}
          />
        }
      />
      <CardContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Property Type:</strong> {lease["Property Type"]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Square Footage:</strong>{" "}
          {lease["Square Foot Area"] || "N/A"}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
));

/* --- Section Component --- */
const NonUsLeasesSection = ({ nonUsLeases, isLoading }) => {
  const { upcoming = [], expired = [] } = nonUsLeases || {};

  const upcomingCards = useMemo(
    () =>
      upcoming.map((lease, i) => (
        <Grid item xs={12} md={6} lg={4} key={`nonus-up-${i}`}>
          <LeaseCard lease={lease} color="#2563eb" labelPrefix="Expires" />
        </Grid>
      )),
    [upcoming]
  );

  const expiredCards = useMemo(
    () =>
      expired.map((lease, i) => (
        <Grid item xs={12} md={6} lg={4} key={`nonus-exp-${i}`}>
          <LeaseCard lease={lease} color="#dc2626" labelPrefix="Expired" />
        </Grid>
      )),
    [expired]
  );

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading international lease data...
        </Typography>
      </Box>
    );
  }

  if (upcoming.length === 0 && expired.length === 0) return null;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
      <CardHeader
        title={`International Lease Properties (${upcoming.length + expired.length})`}
        titleTypographyProps={{
          variant: "h5",
          fontWeight: 700,
          sx: { color: "#1e293b" },
        }}
        subheader={
          <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
            <Chip
              label={`${upcoming.length} Upcoming`}
              color="success"
              size="small"
              variant="outlined"
            />
            <Chip
              label={`${expired.length} Expired`}
              color="error"
              size="small"
              variant="outlined"
            />
          </Box>
        }
      />

      <CardContent>
        {/* Upcoming leases */}
        {upcoming.length > 0 && (
          <>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              📈 Upcoming Expirations
              <Chip label={upcoming.length} color="success" size="small" />
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {upcomingCards}
            </Grid>
          </>
        )}

        {/* Expired leases */}
        {expired.length > 0 && (
          <Accordion
            sx={{
              borderRadius: 2,
              border: "1px solid #fecaca",
              boxShadow: 3,
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ bgcolor: "#fef2f2" }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                📉 Expired International Leases
                <Chip label={expired.length} color="error" size="small" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {expiredCards}
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(NonUsLeasesSection);
