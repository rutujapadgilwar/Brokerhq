import React, { useState, useEffect, useRef } from "react";
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
import LeaseSummaryCard from "../components/tenantDetailsPage/10kLeaseSummaryCard"
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming"
];

const usStateAbbreviations = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const isUSAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  
  const addressLower = address.toLowerCase().trim();
  
  // Check for explicit US indicators
  const usIndicators = [
    'u.s.', 'u.s.a', 'usa', 'united states',
    'u. s.', 'us,', ', us'
  ];
  
  if (usIndicators.some(indicator => addressLower.includes(indicator))) {
    return true;
  }
  
  // Check for state names (full names)
  if (usStates.some(state => addressLower.includes(state.toLowerCase()))) {
    return true;
  }
  
  // Check for state abbreviations with common patterns
  // Pattern 1: State abbreviation followed by zip code (e.g., "CA 94102", "TX 75001")
  const stateZipPattern = new RegExp(`\\b(${usStateAbbreviations.join('|')})\\s+\\d{5}`, 'i');
  if (stateZipPattern.test(address)) {
    return true;
  }
  
  // Pattern 2: City, State format (e.g., "Bellevue, WA", "Austin, TX")
  const cityStatePattern = new RegExp(`,\\s*(${usStateAbbreviations.join('|')})\\b`, 'i');
  if (cityStatePattern.test(address)) {
    return true;
  }
  
  // Pattern 3: Just state abbreviation at the end (e.g., "123 Main St WA")
  const stateAtEndPattern = new RegExp(`\\b(${usStateAbbreviations.join('|')})$`, 'i');
  if (stateAtEndPattern.test(address.trim())) {
    return true;
  }
  
  // Check for common US zip code pattern (5 digits or 5+4 format)
  const zipPattern = /\b\d{5}(-\d{4})?\b/;
  if (zipPattern.test(address)) {
    // If it has a zip code, check if it doesn't have obvious non-US indicators
    const nonUSIndicators = [
      'canada', 'mexico', 'uk', 'united kingdom', 'china', 'japan',
      'germany', 'france', 'india', 'australia', 'brazil', 'spain',
      'italy', 'korea', 'netherlands', 'sweden', 'switzerland'
    ];
    
    const hasNonUSIndicator = nonUSIndicators.some(country => 
      addressLower.includes(country)
    );
    
    if (!hasNonUSIndicator) {
      return true;
    }
  }
  
  return false;
};
// Styled components
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
  const [propertyData, setPropertyData] = useState({});
  const [leaseCounts, setLeaseCounts] = useState({
    usTotal: 0,
    nonUsTotal: 0,
  });
  const propertyRef = useRef(null);
  const scrollToProperty = () => {
    propertyRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    const fetchTenantMaster = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/api/tenantdetailspage/${id}`);
        const master = await res.json();
        // 1. BASIC TENANT INFO
        setTenant(master.tenant_info || {});

        // 2. PROPERTY + LEASE COUNTS
        const propertyData = master.property_data[0] || {};
        setPropertyData(propertyData);
        setLeaseCounts(
          propertyData?.lease_counts || {
            usTotal: 0,
            nonUsTotal: 0,
            total: 0,
          }
        );

        // 3. FLATTEN LEASE REPORTS
        const allReports = propertyData.All_Reports || {};
        let leaseList = [];
        Object.values(allReports).forEach((reports) =>
          reports.forEach((report) => {
            if (Array.isArray(report.Leases)) {
              leaseList.push(
                ...report.Leases.filter(
                  (l) => l["Real Estate Property"] === "Yes"
                ).map((l) => ({
                  ...l,
                  filingDate: report["Filing Date"],
                  url: report["URL"],
                }))
              );
            }
          })
        );

        console.log("📊 Total leases found:", leaseList.length);
        setLeases(leaseList);

        // 4. US vs NON-US LEASE SPLIT
        const us = { upcoming: [], expired: [], noExpiration: [] };
        const nonUs = { upcoming: [], expired: [], noExpiration: [] };

        leaseList.forEach((lease) => {
          const dateString =
            lease["clean_lease_expiration_date"] ||
            lease["Lease Expiration Date"];

          const hasSquareFootage =
            lease["Square Foot Area"] &&
            lease["Square Foot Area"] !== "Not specified" &&
            lease["Square Foot Area"] !== "null";

          const hasAddress =
            lease["Lease Property Address"] &&
            lease["Lease Property Address"] !== "Not specified" &&
            lease["Lease Property Address"] !== "null";

          // If no valid date but has square footage and address, add to noExpiration
          if (
            (!dateString ||
              dateString === "null" ||
              dateString === "Not specified") &&
            hasSquareFootage &&
            hasAddress
          ) {
            const target = isUSAddress(lease["Lease Property Address"])
              ? us
              : nonUs;
            target.noExpiration.push(lease);
            console.log("✅ Added to noExpiration:", {
              address: lease["Lease Property Address"],
              squareFootage: lease["Square Foot Area"],
              propertyType: lease["Property Type"],
            });
            return;
          }

          // If has valid date, process as before
          if (!dateString || dateString === "null") return;

          const leaseDate = new Date(dateString);
          if (isNaN(leaseDate.getTime())) return;

          const target = isUSAddress(lease["Lease Property Address"])
            ? us
            : nonUs;

          if (leaseDate >= new Date()) target.upcoming.push(lease);
          else target.expired.push(lease);
        });

        const sortByDate = (arr) =>
          arr.sort(
            (a, b) =>
              new Date(
                a["clean_lease_expiration_date"] || a["Lease Expiration Date"]
              ) -
              new Date(
                b["clean_lease_expiration_date"] || b["Lease Expiration Date"]
              )
          );

        const usLeasesData = {
          upcoming: sortByDate(us.upcoming),
          expired: sortByDate(us.expired),
          noExpiration: us.noExpiration,
        };

        const nonUsLeasesData = {
          upcoming: sortByDate(nonUs.upcoming),
          expired: sortByDate(nonUs.expired),
          noExpiration: nonUs.noExpiration,
        };

        // Console log summary
        console.log("🇺🇸 US Leases Summary:", {
          upcoming: usLeasesData.upcoming.length,
          expired: usLeasesData.expired.length,
          noExpiration: usLeasesData.noExpiration.length,
          total:
            usLeasesData.upcoming.length +
            usLeasesData.expired.length +
            usLeasesData.noExpiration.length,
        });

        console.log("🌍 Non-US Leases Summary:", {
          upcoming: nonUsLeasesData.upcoming.length,
          expired: nonUsLeasesData.expired.length,
          noExpiration: nonUsLeasesData.noExpiration.length,
          total:
            nonUsLeasesData.upcoming.length +
            nonUsLeasesData.expired.length +
            nonUsLeasesData.noExpiration.length,
        });

        console.log(
          "📍 US Leases with no expiration date:",
          usLeasesData.noExpiration
        );
        console.log(
          "📍 Non-US Leases with no expiration date:",
          nonUsLeasesData.noExpiration
        );

        setUsLeases(usLeasesData);
        setNonUsLeases(nonUsLeasesData);
         // 5. CALCULATE LEASE COUNTS FROM ACTUAL DATA
        const calculatedLeaseCounts = {
          usTotal: usLeasesData.upcoming.length + 
                  usLeasesData.expired.length + 
                  (usLeasesData.noExpiration?.length || 0),
          nonUsTotal: nonUsLeasesData.upcoming.length + 
                      nonUsLeasesData.expired.length + 
                      (nonUsLeasesData.noExpiration?.length || 0),
          total: leaseList.length
        };

        setLeaseCounts(calculatedLeaseCounts);

        console.log("📈 Calculated Lease Counts:", calculatedLeaseCounts);

        // 5. NEWS, 10Q, 8K, AI SUMMARY
        setNewsData(master.news_data[0] || []);
        setTenQData(master.tenq_data[0] || []);
        setEightkdata(master.eightk_data[0] || []);
        setCompanyAISummary(master.ai_data[0] || []);
      } catch (err) {
        console.error("Tenant Master fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantMaster();
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

  const handleTenantClick = (tenantId) => {
    navigate(`/tenant/${tenantId}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Navbar />
      {/* Header */}
      <Box sx={{ mt: 4 }}>
        <HeaderSection
          tenant={tenant}
          leaseCounts={leaseCounts}
          onScrollToProperty={scrollToProperty}
        />
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

                    {Array.isArray(tenQData?.summary) &&
                      tenQData.summary.map((item, index) => (
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
                            <strong style={{ color: "#2563eb" }}>
                              Details:
                            </strong>{" "}
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
              
              <Box sx={{ mt: 4 }}>
                <LeaseSummaryCard
                  propertyData={propertyData}
                />
              </Box>
              <StyledCard ref={propertyRef} sx={{ mt: 4 }}>
                <CardContent>
                  {/* Lease Properties Section - Separate US and Non-US with Collapsible Expired */}
                  {(usLeases.upcoming.length > 0 ||
                    usLeases.expired.length > 0 ||
                    usLeases.noExpiration?.length > 0 ||
                    nonUsLeases.upcoming.length > 0 ||
                    nonUsLeases.expired.length > 0 ||
                    nonUsLeases.noExpiration?.length > 0) && (
                    <Container sx={{ mt: 2, mb: 2 }}>
                      {/* US Properties Card */}
                      {(usLeases.upcoming.length > 0 ||
                        usLeases.expired.length > 0 ||
                        usLeases.noExpiration?.length > 0) && (
                        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 4 }}>
                          <CardHeader
                            avatar={
                              <CardIcon variant="opportunity">
                                <LocationIcon />
                              </CardIcon>
                            }
                            title={`US Lease Properties (${
                              usLeases.upcoming.length +
                              usLeases.expired.length +
                              (usLeases.noExpiration?.length || 0)
                            })`}
                            titleTypographyProps={{
                              variant: "h5",
                              fontWeight: 700,
                              sx: { color: "#1e293b" },
                            }}
                            subheader={
                              <Box
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  gap: 2,
                                  flexWrap: "wrap",
                                }}
                              >
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
                                {usLeases.noExpiration?.length > 0 && (
                                  <Chip
                                    label={`${usLeases.noExpiration.length} No Expiration`}
                                    color="warning"
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
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

                            {/* No Expiration Date US Leases - Collapsible */}
                            {usLeases.noExpiration?.length > 0 && (
                              <Accordion
                                sx={{
                                  borderRadius: 2,
                                  border: "1px solid #fbbf24",
                                  boxShadow: 3,
                                  "&:before": { display: "none" },
                                  mb: 2,
                                }}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  sx={{
                                    bgcolor: "#fef3c7",
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
                                      color: "#d97706",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    📋 No Expiration Date Specified
                                    <Chip
                                      label={usLeases.noExpiration.length}
                                      color="warning"
                                      size="small"
                                      sx={{ ml: 1 }}
                                    />
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 3 }}>
                                  <Grid container spacing={3}>
                                    {usLeases.noExpiration.map(
                                      (lease, index) => (
                                        <Grid
                                          item
                                          xs={12}
                                          md={6}
                                          lg={4}
                                          key={`us-noexp-${index}`}
                                        >
                                          <Card
                                            sx={{
                                              cursor: "pointer",
                                              borderRadius: 3,
                                              boxShadow: 4,
                                              border: "2px solid #fbbf24",
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
                                                    sx={{ bgcolor: "#d97706" }}
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
                                                    label="Expiration: Not Specified"
                                                    color="warning"
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
                                                    {lease[
                                                      "Square Foot Area"
                                                    ] || "N/A"}
                                                  </Typography>
                                                </Box>
                                              </CardContent>
                                            </CardActionArea>
                                          </Card>
                                        </Grid>
                                      )
                                    )}
                                  </Grid>
                                </AccordionDetails>
                              </Accordion>
                            )}

                            {/* Expired US Leases - Collapsible */}
                            {usLeases.expired.length > 0 && (
                              <Accordion
                                sx={{
                                  borderRadius: 2,
                                  border: "1px solid #fecaca",
                                  boxShadow: 3,
                                  "&:before": { display: "none" },
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
                        nonUsLeases.expired.length > 0 ||
                        nonUsLeases.noExpiration?.length > 0) && (
                        <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                          <CardHeader
                            avatar={<CardIcon variant="timeline">🌍</CardIcon>}
                            title={`International Lease Properties (${
                              nonUsLeases.upcoming.length +
                              nonUsLeases.expired.length +
                              (nonUsLeases.noExpiration?.length || 0)
                            })`}
                            titleTypographyProps={{
                              variant: "h5",
                              fontWeight: 700,
                              sx: { color: "#1e293b" },
                            }}
                            subheader={
                              <Box
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  gap: 2,
                                  flexWrap: "wrap",
                                }}
                              >
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
                                {nonUsLeases.noExpiration?.length > 0 && (
                                  <Chip
                                    label={`${nonUsLeases.noExpiration.length} No Expiration`}
                                    color="warning"
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
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

                            {/* No Expiration Date Non-US Leases - Collapsible */}
                            {nonUsLeases.noExpiration?.length > 0 && (
                              <Accordion
                                sx={{
                                  borderRadius: 2,
                                  border: "1px solid #fbbf24",
                                  boxShadow: 3,
                                  "&:before": { display: "none" },
                                  mb: 2,
                                }}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  sx={{
                                    bgcolor: "#fef3c7",
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
                                      color: "#d97706",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    📋 No Expiration Date Specified
                                    <Chip
                                      label={nonUsLeases.noExpiration.length}
                                      color="warning"
                                      size="small"
                                      sx={{ ml: 1 }}
                                    />
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 3 }}>
                                  <Grid container spacing={3}>
                                    {nonUsLeases.noExpiration.map(
                                      (lease, index) => (
                                        <Grid
                                          item
                                          xs={12}
                                          md={6}
                                          lg={4}
                                          key={`nonus-noexp-${index}`}
                                        >
                                          <Card
                                            sx={{
                                              cursor: "pointer",
                                              borderRadius: 3,
                                              boxShadow: 4,
                                              border: "2px solid #fbbf24",
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
                                                    sx={{ bgcolor: "#d97706" }}
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
                                                    label="Expiration: Not Specified"
                                                    color="warning"
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
                                                    {lease[
                                                      "Square Foot Area"
                                                    ] || "N/A"}
                                                  </Typography>
                                                </Box>
                                              </CardContent>
                                            </CardActionArea>
                                          </Card>
                                        </Grid>
                                      )
                                    )}
                                  </Grid>
                                </AccordionDetails>
                              </Accordion>
                            )}

                            {/* Expired Non-US Leases - Collapsible */}
                            {nonUsLeases.expired.length > 0 && (
                              <Accordion
                                sx={{
                                  borderRadius: 2,
                                  border: "1px solid #fecaca",
                                  boxShadow: 3,
                                  "&:before": { display: "none" },
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
                              href={update?.URL || "#"}
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
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {update?.Name || "N/A"}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
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

              <StyledCard>
                <CardHeader
                  title="Competitor List"
                  titleTypographyProps={{ variant: "h6", fontWeight: 700 }}
                />
                <CardContent>
                  {Array.isArray(tenant.competitor_list) &&
                  tenant.competitor_list.length > 0 ? (
                    <Grid container spacing={2}>
                      {tenant.competitor_list.map((competitor, index) => (
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
                              onClick={() => handleTenantClick(competitor?._id)}
                              sx={{ p: 2, cursor: "pointer" }}
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
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {competitor?.tenant_name || "N/A"}
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
                      No Competitor found for this tenant.
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
