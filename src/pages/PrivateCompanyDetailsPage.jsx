import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Chip,
  Link as MuiLink,
  Button,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Public as PublicIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import Navbar from "../components/dashboard/Navbar";
import { Card, CardContent, CardHeader } from "@mui/material";

export default function PrivateCompanyDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(null);
  const [industryData, setIndustryData] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [competitorLoading, setCompetitorLoading] = useState(false);
  const [competitorError, setCompetitorError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setNewsLoading(true);

        // 1️⃣ Fetch company data
        const companyRes = await axios.get(
          `${backendUrl}/get-private-company-info/${id}`
        );
        if (companyRes.data.error) {
          console.error(companyRes.data.error);
          setData(null);
          setIndustryData(null);
          return;
        }

        const companyData = companyRes.data.company_data;
        setData(companyRes.data);

        try {
          setCompetitorLoading(true);

          const competitorRes = await axios.get(
            `${backendUrl}/api/${id}/privateCompetitors`
          );

          setCompetitors(competitorRes.data.similar_companies || []);
        } catch (err) {
          console.error("Error fetching competitors:", err);
          setCompetitorError("Unable to load competitor list");
        } finally {
          setCompetitorLoading(false);
        }
        if (companyData?.sector) {
          const encodedSector = encodeURIComponent(companyData.sector);
          const industryRes = await axios.get(
            `${backendUrl}/api/industrySectorAnalysis/${encodedSector}`
          );
          setIndustryData(industryRes.data);
        } else {
          console.warn("No sector available for this company.");
          setIndustryData(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setData(null);
        setIndustryData(null);
      } finally {
        setLoading(false);
        setNewsLoading(false);
      }
    };

    fetchData();
  }, [id]);
  if (loading) return <Typography>Loading...</Typography>;
  if (!data || !data.company_data) return;
  <Typography>
    {" "}
    <Navbar />
    No company data available.
  </Typography>;

  const {
    company,
    hq_address,
    domain,
    employee_count,
    active_job_count,
    locations,
    about,
    industry,
    sector,
  } = data.company_data;
  const { lease_date, city, state, address, sqft } = data || [];
  const imgUrl = data?.logo_url || "";
  const news = data?.news_data || [];
  const isPublic = !!data.company_data?.ticker;

  const goToPublicDashboard = async () => {
    try {
      const url = `${backendUrl}/api/tenants/get-tenant-id/${data.company_data.ticker}`;
      const res = await axios.get(url);
      if (res.data.found) {
        return navigate(`/tenant/${res.data.tenant_id}`);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Error fetching tenant:", err);
      alert("Something went wrong while checking tenant data.");
    }
  };

  if (isPublic) {
    return (
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 3, py: 15 }}>
        <Navbar />

        {/* HEADER */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 5 }}>
          <Avatar
            src={imgUrl}
            alt={company}
            sx={{
              bgcolor: "primary.main",
              width: 72,
              height: 72,
              fontSize: 28,
              fontWeight: 700,
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "";
            }}
          >
            {company
              ? company
                  .split(" ")
                  .map((n) => n.charAt(0))
                  .join("")
              : "?"}
          </Avatar>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: "#1d4ed8",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {company || "N/A"}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {data.company_data.ticker} • Public Company
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={goToPublicDashboard}
        >
          Go to Public Company Dashboard
        </Button>

        {/*Property Data From Uploaded CSV */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Property Data From Uploaded CSV
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Property Lease Expiration Date : {lease_date || ""}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Property Address :{" "}
            {address + ", " + city + ", " + state || "" + "" + ""}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Square Footage : {sqft || ""}
          </Typography>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 3, py: 15 }}>
        <Navbar />

        {/* HEADER */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 5 }}>
          <Avatar
            src={imgUrl}
            alt={company}
            sx={{
              bgcolor: "primary.main",
              width: 72,
              height: 72,
              fontSize: 28,
              fontWeight: 700,
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = ""; // remove broken image
            }}
          >
            {company
              ? company
                  .split(" ")
                  .map((n) => n.charAt(0))
                  .join("")
              : "?"}
          </Avatar>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: "#1d4ed8",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {company || "N/A"}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {industry || "N/A"} • {employee_count || "N/A"} Employees
            </Typography>
          </Box>
        </Box>

        {/* INFO CARDS */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoCard
              icon={<LocationIcon color="primary" />}
              label="HQ Address"
              value={hq_address || "N/A"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoCard
              icon={<PublicIcon color="primary" />}
              label="Website"
              value={
                domain ? (
                  <MuiLink
                    href={domain}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {domain}
                  </MuiLink>
                ) : (
                  "N/A"
                )
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <InfoCard
              icon={<WorkIcon color="primary" />}
              label="Active Jobs"
              value={active_job_count || "N/A"}
            />
          </Grid>
        </Grid>

        {/* ABOUT */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            About
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {about || "No description available."}
          </Typography>
        </Box>

        {/* LOCATIONS */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Locations
          </Typography>
          {locations && locations.length > 0 ? (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {locations.map((loc, idx) => (
                <Chip key={idx} label={loc} variant="outlined" />
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">
              No additional locations available.
            </Typography>
          )}
        </Box>

        {/*Property Data From Uploaded CSV */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Property Data From Uploaded CSV
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Property Lease Expiration Date : {lease_date || ""}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Property Address :{" "}
            {address + ", " + city + ", " + state || "" + "" + ""}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Square Footage : {sqft || ""}
          </Typography>
        </Box>
        {/* NEWS SECTION */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Recent News
          </Typography>

          {newsLoading ? (
            <Typography color="text.secondary">Loading news...</Typography>
          ) : !news || news.length === 0 ? (
            <Typography color="text.secondary">
              No recent news found.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {["Expansion", "Contraction"].map((type) => {
                const filteredNews = news.filter(
                  (n) => n.business_classification === type
                );
                if (filteredNews.length === 0) return null;

                const sectionColor = type === "Expansion" ? "green" : "red";

                const gov_classificationColor = (type) =>
                  type === "Federal"
                    ? "#14728e"
                    : type === "State"
                    ? "#bbbb03ff"
                    : type === "Real Estate"
                    ? "#ff9800"
                    : "#6c757d";

                return (
                  <Grid item xs={12} key={type}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: sectionColor,
                        textTransform: "capitalize",
                      }}
                    >
                      {type} News
                    </Typography>

                    <Grid container spacing={2}>
                      {filteredNews.map((item, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                          <Box
                            sx={{
                              borderRadius: 3,
                              boxShadow: 3,
                              p: 2,
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              borderLeft: `3px solid ${gov_classificationColor(
                                item.gov_classification
                              )}`,
                              transition: "0.3s",
                              "&:hover": {
                                boxShadow: 6,
                                transform: "translateY(-4px)",
                              },
                            }}
                          >
                            {/* GOV TAG */}
                            <Box
                              sx={{
                                fontSize: "11px",
                                fontWeight: "bold",
                                color: gov_classificationColor(
                                  item.gov_classification
                                ),
                                lineHeight: 1,
                              }}
                            >
                              {(() => {
                                const value = formatGov(
                                  item.gov_classification
                                );

                                if (
                                  !value ||
                                  value === "N/A" ||
                                  value === "None"
                                ) {
                                  return "Other";
                                }

                                return (
                                  value.charAt(0).toUpperCase() + value.slice(1)
                                );
                              })()}
                            </Box>

                            {/* TITLE */}
                            <MuiLink
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="none"
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 700, mt: 1 }}
                              >
                                {item.title}
                              </Typography>
                            </MuiLink>

                            {/* SUMMARY */}
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 1 }}
                            >
                              Summary: {item.summary}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="blue"
                              gutterBottom
                              sx={{ bottom: 50, left: 8 }}
                            >
                              Source: {item.source || "Unknown"}
                            </Typography>

                            {/* Date on the right */}
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              title="published_date"
                            >
                              {new Date(item.published).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
        {/* INDUSTRY ANALYSIS SECTION */}
        <Box sx={{ mt: 6 }}>
          {industryData ? (
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    {industryData.sector} {industryData.icon}
                  </Typography>
                }
              />

              <CardContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {industryData.relevance}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Growth Drivers:
                  </Typography>
                  <Typography variant="body2">
                    {industryData.growth_drivers}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Metrics:
                  </Typography>
                  {Object.entries(industryData.metrics).map(([key, value]) => (
                    <Typography key={key} variant="body2">
                      • <strong>{key}</strong>: {value}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card
              sx={{ p: 3, borderRadius: 3, boxShadow: 2, bgcolor: "#f8f9fa" }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                🚧 Sector Insights Not Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We are still generating industry insights for this company.
                Please check back later.
              </Typography>
            </Card>
          )}
        </Box>

        {/*Competitors List*/}
        <Card sx={{ mt: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, p: 2 }}>
            Competitor Companies
          </Typography>
          <CardContent>
            {competitorLoading && (
              <Typography variant="body2">Loading competitors...</Typography>
            )}

            {!competitorLoading && competitors.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No similar companies found.
              </Typography>
            )}

            <Grid container spacing={2}>
              {competitors.map((item) => (
                <Grid item xs={12} md={6} key={item._id}>
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #eee",
                      borderRadius: 2,
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#fafafa" },
                    }}
                    onClick={() => navigate(`/private_company/${item._id}`)}
                  >
                    <Typography fontWeight={600}>
                      {item.company_name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Employees: {item.employee_count}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
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

  function formatGov(type) {
    if (!type) return "N/A";
    switch (type) {
      case "federal":
        return "Federal";
      case "state":
        return "State";
      case "real_estate":
        return "Real Estate";
      default:
        return type;
    }
  }
}
