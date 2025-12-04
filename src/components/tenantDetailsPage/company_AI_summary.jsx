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
    <Box sx={{ maxWidth: "1500px", mx: "auto", px: 1, py: 1 }}>
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
          <Stack>
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
                Positive Indicators
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
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    whiteSpace: "normal",
                    height: "auto",
                    color: "black", // text color
                    borderColor: "black", // outline color
                    "& .MuiChip-label": {
                      display: "block",
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
                Negative Indicators
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
                  variant="outlined"
                  sx={{
                    fontWeight: 500,
                    whiteSpace: "normal",
                    height: "auto",
                    color: "black", // text color
                    borderColor: "black", // outline color
                    "& .MuiChip-label": {
                      display: "block",
                      whiteSpace: "normal",
                    },
                  }}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

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

      {/* Extra Layers — CRE Decision Drivers */}
      {/* <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
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
      </Card> */}
    </Box>
  );
}
