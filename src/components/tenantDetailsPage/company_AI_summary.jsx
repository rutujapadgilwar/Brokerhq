import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import { CheckCircle, AlertTriangle, MapPin, Layers } from "lucide-react";

export default function CompanySummary({ data }) {
  if (!data || !data.summary) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          AI summary not available.
        </Typography>
      </Box>
    );
  }
  const summary = data.summary;

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: 3, py: 4 }}>
      {/* Three-Paragraph Summary */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardHeader
          title={
            <Typography variant="h6" fontWeight={700}>
              Summary
            </Typography>
          }
        />
        <CardContent>
          <Stack spacing={2}>
            {summary.Three_paragraph_summary &&
              Object.entries(summary.Three_paragraph_summary).map(
                ([key, value], i) => (
                  <Box key={i}>
                    <Typography variant="body1" color="text.secondary">
                      {value}
                    </Typography>
                  </Box>
                )
              )}
          </Stack>
        </CardContent>
      </Card>

      {/* Growth & Pressure Indicators */}
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 4 }}>
        <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 2 }}>
          <CardHeader
            avatar={<CheckCircle color="green" />}
            title={
              <Typography variant="h6" fontWeight={700} color="success.main">
                Growth Indicators
              </Typography>
            }
          />
          <CardContent>
            <Stack spacing={1}>
              {(Array.isArray(summary.Growth_indicators)
                ? summary.Growth_indicators
                : []
              ).map((item, idx) => (
                <Chip
                  key={idx}
                  label={item}
                  color="success"
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    whiteSpace: "normal", // allow wrapping
                    height: "auto", // let chip grow vertically
                    "& .MuiChip-label": {
                      display: "block", // allow multi-line text
                      whiteSpace: "normal",
                    },
                  }}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 2 }}>
          <CardHeader
            avatar={<AlertTriangle color="orange" />}
            title={
              <Typography variant="h6" fontWeight={700} color="warning.main">
                Pressure Indicators
              </Typography>
            }
          />
          <CardContent>
            <Stack spacing={1}>
              {(Array.isArray(summary.Pressure_indicators)
                ? summary.Pressure_indicators
                : []
              ).map((item, idx) => (
                <Chip
                  key={idx}
                  label={item}
                  color="warning"
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    whiteSpace: "normal", // allow wrapping
                    height: "auto", // let chip grow vertically
                    "& .MuiChip-label": {
                      display: "block", // allow multi-line text
                      whiteSpace: "normal",
                    },
                  }}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Why it Matters for CRE */}
      {/* Why it Matters for CRE */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
        <CardHeader
          title={
            <Typography variant="h6" fontWeight={700}>
              Why it Matters for CRE
            </Typography>
          }
        />
        <CardContent>
          {summary?.Why_it_matters_for_CRE ? (
            typeof summary.Why_it_matters_for_CRE === "string" ? (
              <Typography variant="body1" color="text.secondary">
                {summary.Why_it_matters_for_CRE}
              </Typography>
            ) : (
              <Stack spacing={2}>
                {Object.entries(summary.Why_it_matters_for_CRE).map(
                  ([key, value], idx) => (
                    <Box key={idx}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        gutterBottom
                      >
                        {key.replace(/_/g, " ")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {value}
                      </Typography>
                    </Box>
                  )
                )}
              </Stack>
            )
          ) : (
            <Typography variant="body1" color="text.secondary">
              No implications available.
            </Typography>
          )}
        </CardContent>
      </Card>
      {/* Location Watch */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
        <CardHeader
          avatar={<MapPin color="blue" />}
          title={
            <Typography variant="h6" fontWeight={700} color="primary">
              Location Watch
            </Typography>
          }
        />
        <CardContent>
          <Stack spacing={2}>
            {/* Normalize locations into array */}
            {(() => {
              let locations = [];

              // Case 1: Array of Key_Hubs
              if (Array.isArray(summary?.Location_watch?.Key_Hubs)) {
                locations = summary.Location_watch.Key_Hubs.map((loc) => ({
                  label: [loc.City, loc.State, loc.Country]
                    .filter(Boolean)
                    .join(", "),
                  role: loc.Functional_Role || loc.Role || null,
                }));
              }
              // Case 2: Key_geographic_hubs (alt schema)
              else if (
                Array.isArray(summary?.Location_watch?.Key_geographic_hubs)
              ) {
                locations = summary.Location_watch.Key_geographic_hubs.map(
                  (loc) => ({
                    label: [loc.City, loc.State, loc.Country]
                      .filter(Boolean)
                      .join(", "),
                    role: loc.Functional_Role || loc.Role || null,
                  })
                );
              }
              // Case 3: Object of place → role
              else if (
                summary?.Location_watch &&
                typeof summary.Location_watch === "object"
              ) {
                locations = Object.entries(summary.Location_watch).map(
                  ([place, data]) => {
                    let role = null;

                    if (typeof data === "string") {
                      role = data;
                    } else if (typeof data === "object") {
                      role = data.Role || data.Functional_Role || null;
                    }

                    return { label: place, role };
                  }
                );
              }

              return locations.length > 0 ? (
                locations.map((loc, idx) => (
                  <Stack
                    key={idx}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Chip
                      label={loc.label || "Unknown"}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                    {loc.role && (
                      <Typography variant="body2" color="text.secondary">
                        {loc.role}
                      </Typography>
                    )}
                  </Stack>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No location data available
                </Typography>
              );
            })()}
          </Stack>
        </CardContent>
      </Card>

      {/* Extra Layers — CRE Decision Drivers */}
      <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
        <CardHeader
          avatar={<Layers color="purple" />}
          title={
            <Typography variant="h6" fontWeight={700} color="secondary">
              Extra Layers — CRE Decision Drivers
            </Typography>
          }
        />
        <CardContent>
          <Box sx={{ display: "grid", gap: 3 }}>
            {summary.Extra_layers &&
              Object.entries(summary.Extra_layers).map(
                ([driverKey, driverObj], idx) => (
                  <Card
                    key={idx}
                    sx={{
                      bgcolor: "#f3f4f6",
                      borderRadius: 2,
                      boxShadow: 1,
                      p: 2,
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{ mb: 1 }}
                    >
                      {driverKey
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Stack spacing={1}>
                      {driverObj && typeof driverObj === "object" ? (
                        Object.entries(driverObj).map(
                          ([topicKey, topicValue], subIdx) => (
                            <Box key={subIdx} sx={{ pl: 1 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: "secondary.main",
                                }}
                              >
                                {topicKey
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                {topicValue}
                              </Typography>
                            </Box>
                          )
                        )
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {typeof driverObj === "string"
                            ? driverObj
                            : JSON.stringify(driverObj)}
                        </Typography>
                      )}
                    </Stack>
                  </Card>
                )
              )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
