import {
  Card,
  CardContent,
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

const ExpansionNews = ({ newsData }) => {
  const [tab, setTab] = useState(0);
  if (!newsData) return null;

  const { real_estate = [], federal = [], states = {} } = newsData;

  const categories = [
    { label: "Federal", icon: <GavelIcon />, color: "primary", data: federal },
    {
      label: "Real Estate",
      icon: <ApartmentIcon />,
      color: "success",
      data: real_estate,
    },
    {
      label: "States",
      icon: <MapIcon />,
      color: "secondary",
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
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        🚀 Expansion News
      </Typography>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
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
            .filter((item) => item.label === "expansion")
            .map((item, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                {renderCard(item, categories[tab].color)}
              </Grid>
            ))}

        {/* States */}
        {tab === 2 &&
          Object.entries(categories[2].data).map(([state, items]) => {
            const expansionItems = items.filter(
              (item) => item.label === "expansion"
            );
            if (expansionItems.length === 0) return null;

            return (
              <Grid item xs={12} key={state}>
                {/* State Header */}
                <Chip
                  label={state}
                  color="secondary"
                  sx={{ fontWeight: 600, mb: 2 }}
                />

                {/* State News Grid */}
                <Grid container spacing={2}>
                  {expansionItems.map((item, idx) => (
                    <Grid item xs={12} md={6} key={idx}>
                      {renderCard(item, "secondary")}
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

export default ExpansionNews;
