import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CardActionArea } from "@mui/material";
import Link from "@mui/material/Link";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  Card,
  CardContent,
  CardHeader,
  Container,
} from "@mui/material";
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";
import { styled } from "@mui/material/styles";
import Navbar from "../components/dashboard/Navbar";
import ExpansionNews from "../components/tenantDetailsPage/ExpansionNews";
import ContractionNews from "../components/tenantDetailsPage/ContractionNews";
import HeaderSection from "../components/tenantDetailsPage/HeaderSection";
import CompanySummary from "../components/tenantDetailsPage/company_AI_summary";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const isUSAddress = (address) =>
  address &&
  usStates.some((state) => address.toLowerCase().includes(state.toLowerCase()));

// Styled components
const HeaderContainer = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  padding: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  marginTop: "64px",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'url("data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 100 100\\"><defs><pattern id=\\"grid\\" width=\\"10\\" height=\\"10\\" patternUnits=\\"userSpaceOnUse\\"><path d=\\"M 10 0 L 0 0 0 10\\" fill=\\"none\\" stroke=\\"rgba(255,255,255,0.1)\\" stroke-width=\\"1\\"/></pattern></defs><rect width=\\"100\\" height=\\"100\\" fill=\\"url(%23grid)\\"/></svg>")',
    opacity: 0.3,
  },
}));

const HeaderContent = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  maxWidth: 1200,
  margin: "0 auto",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  border: "1px solid #e2e8f0",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
  },
}));

const CardIcon = styled(Box)(({ theme, variant }) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.5rem",
  color: "white",
  background:
    variant === "opportunity"
      ? "linear-gradient(45deg, #ff6b6b, #ee5a52)"
      : variant === "timeline"
      ? "linear-gradient(45deg, #4facfe, #00f2fe)"
      : variant === "strategy"
      ? "linear-gradient(45deg, #a8e6cf, #3d8b85)"
      : variant === "contacts"
      ? "linear-gradient(45deg, #4ecdc4, #44a08d)"
      : "linear-gradient(45deg, #667eea, #764ba2)",
}));


const TenantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leases, setLeases] = useState([]);
  const [usLeases, setUsLeases] = useState({ upcoming: [], expired: [] });
  const [nonUsLeases, setNonUsLeases] = useState({ upcoming: [], expired: [] });
  const [newsData, setNewsData] = useState(null);
  const [tenQData, setTenQData] = useState({ summary: [], url: null });
  const [eightkdata, setEightkdata] = useState([]);
  const [companyAISummary, setCompanyAISummary] = useState({ summary: "" });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [leaseCounts, setLeaseCounts] = useState({
  usTotal: 0,
  nonUsTotal: 0,
});
  useEffect(() => {
    const fetchTenant = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/tenants/${id}`);
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        setTenant(data);
      } catch (error) {
        console.error("Error fetching tenant:", error);
        setTenant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [id]);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/property_details/${id}`
        );
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const propertyData = await res.json();

        // Extract all leases across reports
        const allReports = propertyData?.data?.[0]?.All_Reports || {};
        let leaseList = [];
        let officerSet = new Set();
        Object.values(allReports).forEach((reports) => {
          reports.forEach((report) => {
            (report["Executive Officers"] || []).forEach((name) =>
              officerSet.add(name)
            );

            if (Array.isArray(report.Leases) && report.Leases.length > 0) {
              const filtered = report.Leases.filter((lease) => {
                const isRealEstate = lease["Real Estate Property"] === "Yes";

                // Check if lease expiration date exists and is not null/empty
                const hasValidExpirationDate =
                  lease["Lease Expiration Date"] &&
                  lease["Lease Expiration Date"].trim() !== "" &&
                  lease["Lease Expiration Date"] !== "null" &&
                  lease["Lease Expiration Date"] !== null;

                // Also check clean_lease_expiration_date if it exists
                const hasValidCleanDate =
                  lease["clean_lease_expiration_date"] &&
                  lease["clean_lease_expiration_date"].trim() !== "" &&
                  lease["clean_lease_expiration_date"] !== null &&
                  lease["clean_lease_expiration_date"] !== null;

                return (
                  isRealEstate && (hasValidExpirationDate || hasValidCleanDate)
                );
              }).map((lease) => ({
                ...lease,
                filingDate: report["Filing Date"], // attach filing date
                url: report["URL"], // attach document URL
              }));

              leaseList = [...leaseList, ...filtered];
            }
          });
        });

        setLeases(leaseList);
        const us = { upcoming: [], expired: [] };
        const nonUs = { upcoming: [], expired: [] };

        setLeaseCounts({
  usTotal: us.upcoming.length + us.expired.length,
  nonUsTotal: nonUs.upcoming.length + nonUs.expired.length,
});
        leaseList.forEach((lease) => {
          // Use clean_lease_expiration_date if available, otherwise fall back to original
          const dateString =
            lease["clean_lease_expiration_date"] ||
            lease["Lease Expiration Date"];

          // Skip if still no valid date
          if (
            !dateString ||
            dateString.trim() === "" ||
            dateString === "null"
          ) {
            return;
          }
          let leaseDate;
          try {
            if (
              dateString.includes("-") &&
              dateString.split("-").length === 3
            ) {
              // Format: YYYY-MM-DD
              leaseDate = new Date(
                dateString + (dateString.split("-").length === 2 ? "-01" : "")
              );
            } else {
              // Try parsing as is
              leaseDate = new Date(dateString);
            }

            // Check if date is valid
            if (isNaN(leaseDate.getTime())) {
              return; // Skip invalid dates
            }
          } catch (error) {
            console.warn("Failed to parse date:", dateString);
            return; // Skip unparseable dates
          }
          const target = isUSAddress(lease["Lease Property Address"])
            ? us
            : nonUs;

          if (leaseDate >= new Date()) target.upcoming.push(lease);
          else target.expired.push(lease);
        });

        // Optional: sort by expiration date
        const sortByDate = (arr) =>
          arr.sort((a, b) => {
            const getDate = (lease) => {
              const dateString =
                lease["clean_lease_expiration_date"] ||
                lease["Lease Expiration Date"];
              return new Date(dateString);
            };
            return getDate(a) - getDate(b);
          });

        setUsLeases({
          upcoming: sortByDate(us.upcoming),
          expired: sortByDate(us.expired),
        });

        setNonUsLeases({
          upcoming: sortByDate(nonUs.upcoming),
          expired: sortByDate(nonUs.expired),
        });
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    fetchPropertyData();
  }, [id]);

  //News Data
  useEffect(() => {
    async function fetchNews() {
      try {
        const newsRes = await fetch(
          `${backendUrl}/news_data/${id}`
        );
        const data = await newsRes.json();
        console.log(data);
        setNewsData(data);
      } catch (err) {
        console.error("Error fetching news", err);
      }
    }

    fetchNews();
  }, [id]);

  //tenq_summary
  useEffect(() => {
    async function fetchtenQ() {
      try {
        const tenqRes = await fetch(
          `${backendUrl}/tenq_summary/${id}`
        );
        const data = await tenqRes.json();
        setTenQData(data || []);
      } catch (err) {
        console.error("Error fetching tenq data", err);
      }
    }

    fetchtenQ();
  }, [id]);

  //eightk data
  useEffect(() => {
    async function fetcheightK() {
      try {
        const eightKres = await fetch(
          `${backendUrl}/eightk_data/${id}`
        );
        const data = await eightKres.json();
        setEightkdata(data || []);
      } catch (err) {
        console.error("Error fetching eightk data", err);
      }
    }

    fetcheightK();
  }, [id]);

  //Company AI summary
  useEffect(() => {
    async function fetchcomapnyAISummary() {
      try {
        const aiSummaryres = await fetch(
          `${backendUrl}/tenants/comapny_AI_summary/${id}`
        );
        const data = await aiSummaryres.json();
        console.log("company summary", data);
        setCompanyAISummary(data && data.summary ? data : null);
      } catch (err) {
        console.error("Error fetching company AI summary data", err);
      }
    }

    fetchcomapnyAISummary();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>Loading tenant details...</Typography>
      </Box>
    );
  }

  if (!tenant) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>Tenant not found</Typography>
      </Box>
    );
  }

  // Safely flatten all 8-K updates, ignoring empty or malformed entries
  const updates = (Array.isArray(eightkdata) ? eightkdata : [eightkdata])
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
  // Also update your sortedLeases logic:
  const sortedLeases = leases
    ?.filter((lease) => {
      // Additional filtering to ensure we only show leases with valid dates
      const dateString =
        lease["clean_lease_expiration_date"] || lease["Lease Expiration Date"];
      return (
        dateString &&
        dateString.trim() !== "" &&
        dateString !== "null" &&
        dateString !== null
      );
    })
    ?.sort((a, b) => {
      // Parse the clean expiration dates
      const parseDate = (lease) => {
        const dateString =
          lease["clean_lease_expiration_date"] ||
          lease["Lease Expiration Date"];
        if (!dateString || dateString.trim() === "" || dateString === "null") {
          return null;
        }

        try {
          // Handle YYYY-MM or YYYY-MM-DD formats
          if (dateString.includes("-")) {
            const parts = dateString.split("-");
            if (parts.length === 2) {
              // YYYY-MM format, add day
              return new Date(dateString + "-01");
            } else if (parts.length === 3) {
              // YYYY-MM-DD format
              return new Date(dateString);
            }
          }
          return new Date(dateString);
        } catch (error) {
          console.warn("Failed to parse date for sorting:", dateString);
          return null;
        }
      };

      const dateA = parseDate(a);
      const dateB = parseDate(b);

      // If either date is null, sort it to the end
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      // Both dates exist, sort normally
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Navbar />
      {/* Header */}
      <Box sx={{ mt: 4 }}>
        <HeaderSection tenant={tenant} eightkData={eightkdata} />
      </Box>
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          {/* AI summary*/}
          <Grid item xs={15} lg={12}>
            <StyledCard>
              <CardContent>
                <div>
                  <CompanySummary data={companyAISummary} />
                </div>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: "grid", gap: 4 }}>
              {/*Company News */}
              <StyledCard>
                <CardContent>
                  <div className="space-y-6">
                    <ExpansionNews newsData={newsData} />
                    <ContractionNews newsData={newsData} />
                  </div>
                </CardContent>
              </StyledCard>

              <StyledCard
                sx={{
                  bgcolor: "#f9fafb",
                  borderRadius: "16px",
                  boxShadow: 3,
                }}
              >
                <CardHeader
                  avatar={
                    <CardIcon
                      variant="strategy"
                      sx={{ bgcolor: "#2563eb", color: "white" }}
                    >
                      <DescriptionIcon />
                    </CardIcon>
                  }
                  title="Recent 10-Q Summary"
                  titleTypographyProps={{
                    variant: "h6",
                    fontWeight: 700,
                    sx: { color: "#1e293b" },
                  }}
                />

                <CardContent>
                  <List sx={{ pl: 2 }}>
                    {/* Header info */}
                    {tenQData?.url && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Source:</strong>{" "}
                          <Link
                            href={tenQData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{ fontWeight: 500 }}
                          >
                            {tenQData.url}
                          </Link>
                        </Typography>
                      </Box>
                    )}

                    {Array.isArray(tenQData?.summary) && tenQData.summary.map((item, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          flexDirection: "column",
                          mb: 2,
                          p: 2,
                          borderRadius: "12px",
                          bgcolor: "#ffffff",
                          boxShadow: 1,
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: 3,
                            bgcolor: "#f1f5f9",
                          },
                        }}
                      >
                        {/* Summary Point */}
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 600, color: "#0f172a", mb: 1 }}
                        >
                          • {item.summary_point}
                        </Typography>

                        {/* Details */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#475569",
                            lineHeight: 1.5,
                            mb: 0.5,
                          }}
                        >
                          <strong style={{ color: "#2563eb" }}>Details:</strong>{" "}
                          {item.details}
                        </Typography>

                        {/* Implications */}
                        <Typography
                          variant="body2"
                          sx={{ color: "#475569", lineHeight: 1.5 }}
                        >
                          <strong style={{ color: "#16a34a" }}>
                            Implications:
                          </strong>{" "}
                          {item.implications}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </StyledCard>

              <StyledCard>
                <CardContent>
                  {/* Lease Properties Section - Separate US and Non-US with Collapsible Expired */}
                  {(usLeases.upcoming.length > 0 ||
                    usLeases.expired.length > 0 ||
                    nonUsLeases.upcoming.length > 0 ||
                    nonUsLeases.expired.length > 0) && (
                    <Container sx={{ mt: 2, mb: 2 }}>
                      {/* US Properties Card */}
                      {(usLeases.upcoming.length > 0 ||
                        usLeases.expired.length > 0) && (
                        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 4 }}>
                          <CardHeader
                            avatar={
                              <CardIcon variant="opportunity">
                                <LocationIcon />
                              </CardIcon>
                            }
                            title={`US Lease Properties (${
                              usLeases.upcoming.length + usLeases.expired.length
                            })`}
                            titleTypographyProps={{
                              variant: "h5",
                              fontWeight: 700,
                              sx: { color: "#1e293b" },
                            }}
                            subheader={
                              <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
                                <Chip
                                  label={`${usLeases.upcoming.length} Upcoming`}
                                  color="success"
                                  size="small"
                                  variant="outlined"
                                />
                                <Chip
                                  label={`${usLeases.expired.length} Expired`}
                                  color="error"
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            }
                          />
                          <CardContent>
                            {/* Upcoming US Leases - Always Visible */}
                            {usLeases.upcoming.length > 0 && (
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
                                  <Chip
                                    label={usLeases.upcoming.length}
                                    color="success"
                                    size="small"
                                    sx={{ ml: 1 }}
                                  />
                                </Typography>
                                <Grid container spacing={3} sx={{ mb: 3 }}>
                                  {usLeases.upcoming.map((lease, index) => (
                                    <Grid
                                      item
                                      xs={12}
                                      md={6}
                                      lg={4}
                                      key={`us-upcoming-${index}`}
                                    >
                                      <Card
                                        sx={{
                                          cursor: "pointer",
                                          borderRadius: 3,
                                          boxShadow: 4,
                                          border: "2px solid #16a34a",
                                          transition:
                                            "transform 0.3s, box-shadow 0.3s",
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
                                            avatar={
                                              <Avatar
                                                sx={{ bgcolor: "#16a34a" }}
                                              >
                                                <BusinessIcon />
                                              </Avatar>
                                            }
                                            title={
                                              <Typography
                                                variant="h6"
                                                sx={{
                                                  fontWeight: 600,
                                                  lineHeight: 1.3,
                                                  fontSize: "0.95rem",
                                                }}
                                              >
                                                {
                                                  lease[
                                                    "Lease Property Address"
                                                  ]
                                                }
                                              </Typography>
                                            }
                                            subheader={
                                              <Chip
                                                label={`Expires: ${
                                                  lease[
                                                    "clean_lease_expiration_date"
                                                  ] ||
                                                  lease["Lease Expiration Date"]
                                                }`}
                                                color="success"
                                                size="small"
                                                sx={{ mt: 1 }}
                                              />
                                            }
                                          />
                                          <CardContent sx={{ pt: 1 }}>
                                            <Box sx={{ mb: 1 }}>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                <strong>Property Type:</strong>{" "}
                                                {lease["Property Type"]}
                                              </Typography>
                                            </Box>
                                            <Box>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                <strong>Square Footage:</strong>{" "}
                                                {lease["Square Foot Area"] ||
                                                  "N/A"}
                                              </Typography>
                                            </Box>
                                          </CardContent>
                                        </CardActionArea>
                                      </Card>
                                    </Grid>
                                  ))}
                                </Grid>
                              </>
                            )}

                            {/* Expired US Leases - Collapsible */}
                            {usLeases.expired.length > 0 && (
                              <Accordion
                                sx={{
                                  borderRadius: 2,
                                  border: "1px solid #fecaca",
                                  boxShadow: 3,
                                  "&:before": { display: "none" }, // Remove default MUI accordion line
                                  mb: 2,
                                }}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  sx={{
                                    bgcolor: "#fef2f2",
                                    borderRadius: "8px 8px 0 0",
                                    minHeight: 56,
                                    "&.Mui-expanded": {
                                      minHeight: 56,
                                    },
                                    "& .MuiAccordionSummary-content": {
                                      margin: "12px 0",
                                      "&.Mui-expanded": {
                                        margin: "12px 0",
                                      },
                                    },
                                  }}
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
                                    📉 Expired US Leases
                                    <Chip
                                      label={usLeases.expired.length}
                                      color="error"
                                      size="small"
                                      sx={{ ml: 1 }}
                                    />
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 3 }}>
                                  <Grid container spacing={3}>
                                    {usLeases.expired.map((lease, index) => (
                                      <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        lg={4}
                                        key={`us-expired-${index}`}
                                      >
                                        <Card
                                          sx={{
                                            cursor: "pointer",
                                            borderRadius: 3,
                                            boxShadow: 4,
                                            border: "2px solid #dc2626",
                                            transition:
                                              "transform 0.3s, box-shadow 0.3s",
                                            "&:hover": {
                                              transform: "translateY(-5px)",
                                              boxShadow: 8,
                                            },
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            opacity: 0.9,
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
                                              avatar={
                                                <Avatar
                                                  sx={{ bgcolor: "#dc2626" }}
                                                >
                                                  <BusinessIcon />
                                                </Avatar>
                                              }
                                              title={
                                                <Typography
                                                  variant="h6"
                                                  sx={{
                                                    fontWeight: 600,
                                                    lineHeight: 1.3,
                                                    fontSize: "0.95rem",
                                                  }}
                                                >
                                                  {
                                                    lease[
                                                      "Lease Property Address"
                                                    ]
                                                  }
                                                </Typography>
                                              }
                                              subheader={
                                                <Chip
                                                  label={`Expired: ${
                                                    lease[
                                                      "clean_lease_expiration_date"
                                                    ] ||
                                                    lease[
                                                      "Lease Expiration Date"
                                                    ]
                                                  }`}
                                                  color="error"
                                                  size="small"
                                                  sx={{ mt: 1 }}
                                                />
                                              }
                                            />
                                            <CardContent sx={{ pt: 1 }}>
                                              <Box sx={{ mb: 1 }}>
                                                <Typography
                                                  variant="body2"
                                                  color="text.secondary"
                                                >
                                                  <strong>
                                                    Property Type:
                                                  </strong>{" "}
                                                  {lease["Property Type"]}
                                                </Typography>
                                              </Box>
                                              <Box>
                                                <Typography
                                                  variant="body2"
                                                  color="text.secondary"
                                                >
                                                  <strong>
                                                    Square Footage:
                                                  </strong>{" "}
                                                  {lease["Square Foot Area"] ||
                                                    "N/A"}
                                                </Typography>
                                              </Box>
                                            </CardContent>
                                          </CardActionArea>
                                        </Card>
                                      </Grid>
                                    ))}
                                  </Grid>
                                </AccordionDetails>
                              </Accordion>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Non-US Properties Card */}
                      {(nonUsLeases.upcoming.length > 0 ||
                        nonUsLeases.expired.length > 0) && (
                        <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                          <CardHeader
                            avatar={<CardIcon variant="timeline">🌍</CardIcon>}
                            title={`International Lease Properties (${
                              nonUsLeases.upcoming.length +
                              nonUsLeases.expired.length
                            })`}
                            titleTypographyProps={{
                              variant: "h5",
                              fontWeight: 700,
                              sx: { color: "#1e293b" },
                            }}
                            subheader={
                              <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
                                <Chip
                                  label={`${nonUsLeases.upcoming.length} Upcoming`}
                                  color="success"
                                  size="small"
                                  variant="outlined"
                                />
                                <Chip
                                  label={`${nonUsLeases.expired.length} Expired`}
                                  color="error"
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                            }
                          />
                          <CardContent>
                            {/* Upcoming Non-US Leases - Always Visible */}
                            {nonUsLeases.upcoming.length > 0 && (
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
                                  <Chip
                                    label={nonUsLeases.upcoming.length}
                                    color="success"
                                    size="small"
                                    sx={{ ml: 1 }}
                                  />
                                </Typography>
                                <Grid container spacing={3} sx={{ mb: 3 }}>
                                  {nonUsLeases.upcoming.map((lease, index) => (
                                    <Grid
                                      item
                                      xs={12}
                                      md={6}
                                      lg={4}
                                      key={`nonus-upcoming-${index}`}
                                    >
                                      <Card
                                        sx={{
                                          cursor: "pointer",
                                          borderRadius: 3,
                                          boxShadow: 4,
                                          border: "2px solid #2563eb",
                                          transition:
                                            "transform 0.3s, box-shadow 0.3s",
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
                                            avatar={
                                              <Avatar
                                                sx={{ bgcolor: "#2563eb" }}
                                              >
                                                <BusinessIcon />
                                              </Avatar>
                                            }
                                            title={
                                              <Typography
                                                variant="h6"
                                                sx={{
                                                  fontWeight: 600,
                                                  lineHeight: 1.3,
                                                  fontSize: "0.95rem",
                                                }}
                                              >
                                                {
                                                  lease[
                                                    "Lease Property Address"
                                                  ]
                                                }
                                              </Typography>
                                            }
                                            subheader={
                                              <Chip
                                                label={`Expires: ${
                                                  lease[
                                                    "clean_lease_expiration_date"
                                                  ] ||
                                                  lease["Lease Expiration Date"]
                                                }`}
                                                color="primary"
                                                size="small"
                                                sx={{ mt: 1 }}
                                              />
                                            }
                                          />
                                          <CardContent sx={{ pt: 1 }}>
                                            <Box sx={{ mb: 1 }}>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                <strong>Property Type:</strong>{" "}
                                                {lease["Property Type"]}
                                              </Typography>
                                            </Box>
                                            <Box>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                <strong>Square Footage:</strong>{" "}
                                                {lease["Square Foot Area"] ||
                                                  "N/A"}
                                              </Typography>
                                            </Box>
                                          </CardContent>
                                        </CardActionArea>
                                      </Card>
                                    </Grid>
                                  ))}
                                </Grid>
                              </>
                            )}

                            {/* Expired Non-US Leases - Collapsible */}
                            {nonUsLeases.expired.length > 0 && (
                              <Accordion
                                sx={{
                                  borderRadius: 2,
                                  border: "1px solid #fecaca",
                                  boxShadow: 3,
                                  "&:before": { display: "none" }, // Remove default MUI accordion line
                                  mb: 2,
                                }}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  sx={{
                                    bgcolor: "#fef2f2",
                                    borderRadius: "8px 8px 0 0",
                                    minHeight: 56,
                                    "&.Mui-expanded": {
                                      minHeight: 56,
                                    },
                                    "& .MuiAccordionSummary-content": {
                                      margin: "12px 0",
                                      "&.Mui-expanded": {
                                        margin: "12px 0",
                                      },
                                    },
                                  }}
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
                                    <Chip
                                      label={nonUsLeases.expired.length}
                                      color="error"
                                      size="small"
                                      sx={{ ml: 1 }}
                                    />
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 3 }}>
                                  <Grid container spacing={3}>
                                    {nonUsLeases.expired.map((lease, index) => (
                                      <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        lg={4}
                                        key={`nonus-expired-${index}`}
                                      >
                                        <Card
                                          sx={{
                                            cursor: "pointer",
                                            borderRadius: 3,
                                            boxShadow: 4,
                                            border: "2px solid #dc2626",
                                            transition:
                                              "transform 0.3s, box-shadow 0.3s",
                                            "&:hover": {
                                              transform: "translateY(-5px)",
                                              boxShadow: 8,
                                            },
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            opacity: 0.9,
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
                                              avatar={
                                                <Avatar
                                                  sx={{ bgcolor: "#dc2626" }}
                                                >
                                                  <BusinessIcon />
                                                </Avatar>
                                              }
                                              title={
                                                <Typography
                                                  variant="h6"
                                                  sx={{
                                                    fontWeight: 600,
                                                    lineHeight: 1.3,
                                                    fontSize: "0.95rem",
                                                  }}
                                                >
                                                  {
                                                    lease[
                                                      "Lease Property Address"
                                                    ]
                                                  }
                                                </Typography>
                                              }
                                              subheader={
                                                <Chip
                                                  label={`Expired: ${
                                                    lease[
                                                      "clean_lease_expiration_date"
                                                    ] ||
                                                    lease[
                                                      "Lease Expiration Date"
                                                    ]
                                                  }`}
                                                  color="error"
                                                  size="small"
                                                  sx={{ mt: 1 }}
                                                />
                                              }
                                            />
                                            <CardContent sx={{ pt: 1 }}>
                                              <Box sx={{ mb: 1 }}>
                                                <Typography
                                                  variant="body2"
                                                  color="text.secondary"
                                                >
                                                  <strong>
                                                    Property Type:
                                                  </strong>{" "}
                                                  {lease["Property Type"]}
                                                </Typography>
                                              </Box>
                                              <Box>
                                                <Typography
                                                  variant="body2"
                                                  color="text.secondary"
                                                >
                                                  <strong>
                                                    Square Footage:
                                                  </strong>{" "}
                                                  {lease["Square Foot Area"] ||
                                                    "N/A"}
                                                </Typography>
                                              </Box>
                                            </CardContent>
                                          </CardActionArea>
                                        </Card>
                                      </Grid>
                                    ))}
                                  </Grid>
                                </AccordionDetails>
                              </Accordion>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </Container>
                  )}
                </CardContent>
              </StyledCard>
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
  <Box
    sx={{
      display: "grid",
      gap: 3,
      height: "fit-content",
      position: "sticky",
      top: 32,
    }}
  >
    {/* Executive Officer Changes */}
    <StyledCard>
      <CardHeader
        avatar={<CardIcon variant="contacts">👥</CardIcon>}
        title="Executive Officer Changes"
        titleTypographyProps={{ variant: "h6", fontWeight: 700 }}
      />
      <CardContent>
        {Array.isArray(updates) && updates.length > 0 ? (
          <Grid container spacing={2}>
            {updates.map((update, index) => (
              <Grid item xs={12} key={index}>
                {/* 👇 Wrap with CardActionArea */}
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 2,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardActionArea
                    component="a"
                    href={update?.URL || "#"} // 👈 per-update URL
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ p: 2 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {/* Left: Name + Role */}
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {update?.Name || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {update?.Role_Affected || "N/A"}
                        </Typography>
                      </Box>

                      {/* Right: Change label + Effective Date */}
                      <Box sx={{ textAlign: "right" }}>
                        <Chip
                          label={update?.Type_of_Change || "N/A"}
                          color="primary"
                          size="small"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          {update?.Effective_Date || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No executive officer changes found in this filing.
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  </Box>
</Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default TenantDetailsPage;
