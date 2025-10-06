import {
  Card,
  Typography,
  Grid,
  Container,
  Tabs,
  Tab,
  Box,
  Button,
  Chip,
} from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import ApartmentIcon from "@mui/icons-material/Apartment";
import MapIcon from "@mui/icons-material/Map";
import { useState } from "react";

const ContractionNews = ({ newsData }) => {
  const [tab, setTab] = useState(0);
  if (!newsData) return null;

  const { real_estate = [], federal = [], states = {} } = newsData;

  const categories = [
    { label: "Federal", icon: <GavelIcon />, color: "error", data: federal },
    {
      label: "Real Estate",
      icon: <ApartmentIcon />,
      color: "error",
      data: real_estate,
    },
    {
      label: "States",
      icon: <MapIcon />,
      color: "error",
      data: states, // keep grouped by state
    },
  ];

  const renderCard = (item, color) => (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderLeft: "5px solid #dc2626",
        transition: "0.3s",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, mb: 1 }}
        color={color + ".main"}
      >
        {item.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Source: {item.source || "Unknown"} | {item.date || "N/A"}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Button
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        color="error"
        size="small"
        sx={{
          mt: 1,
          alignSelf: "flex-start",
          textTransform: "none",
          borderRadius: 2,
        }}
      >
        Read more →
      </Button>
    </Card>
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "error.main" }}>
        🔻 Contraction News
      </Typography>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        textColor="error"
        indicatorColor="error"
        sx={{ mb: 3 }}
      >
        {categories.map((c, idx) => (
          <Tab
            key={idx}
            icon={c.icon}
            iconPosition="start"
            label={c.label}
            sx={{ fontWeight: 600 }}
          />
        ))}
      </Tabs>

      {/* News Grid */}
      <Grid container spacing={3}>
        {/* Federal & Real Estate */}
        {tab !== 2 &&
          categories[tab].data
            .filter((item) => item.label === "contraction")
            .map((item, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                {renderCard(item, categories[tab].color)}
              </Grid>
            ))}

        {/* States */}
        {tab === 2 &&
          Object.entries(categories[2].data).map(([state, items]) => {
            const contractionItems = items.filter(
              (item) => item.label === "contraction"
            );
            if (contractionItems.length === 0) return null;

            return (
              <Grid item xs={12} key={state}>
                {/* State Header */}
                <Chip
                  label={state}
                  color="error"
                  sx={{ fontWeight: 600, mb: 2 }}
                />

                {/* State News Grid */}
                <Grid container spacing={2}>
                  {contractionItems.map((item, idx) => (
                    <Grid item xs={12} md={6} key={idx}>
                      {renderCard(item, "error")}
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            );
          })}
      </Grid>
    </Container>
  );
};

export default ContractionNews;
