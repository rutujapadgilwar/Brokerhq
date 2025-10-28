import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Navbar from "../components/dashboard/Navbar";

export default function UploadedCsvDataPage() {
  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const userId = "brokerhq"; // ⚙️ Replace with your actual logged-in user ID

  // Fetch upload history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/csv_upload_history?user_id=${userId}`
        );
        const data = await res.json();
        setHistory(data || []);
      } catch (err) {
        console.error("❌ Error fetching history:", err);
      }
    };
    fetchHistory();
  }, [backendUrl, userId]);

  // Fetch all uploaded data (default table view)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/get_csv_uploaded_data?user_id=${userId}`
        );
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const result = await res.json();
        setData(result || []);
      } catch (err) {
        console.error("❌ Error fetching uploaded data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [backendUrl]);

  // Fetch records for a specific date
  const fetchDataForDate = async (date) => {
    if (!date) {
      console.error("❌ No date provided to fetchDataForDate");
      return;
    }

    // only send YYYY-MM-DD
    const formattedDate = date.split("T")[0];

    try {
      const res = await fetch(
        `${backendUrl}/get_csv_uploaded_data_by_date?user_id=${userId}&date=${encodeURIComponent(
          formattedDate
        )}`
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setRecords(data.records || []);
      setDialogOpen(true);
      setSelectedDate(formattedDate);
    } catch (err) {
      console.error("❌ Error fetching uploaded data:", err);
    }
  };

  const deleteDataForDate = async (date) => {
    if (!date) {
      console.error("❌ No date provided to deleteDataForDate");
      return;
    }

    // only send YYYY-MM-DD
    const formattedDate = date.split("T")[0];

    if (!window.confirm(`🗑️ Delete all data uploaded on ${date}?`)) return;
    try {
      const res = await fetch(
        `${backendUrl}/delete_uploaded_data?user_id=${userId}&date=${encodeURIComponent(
          formattedDate
        )}`,
        { method: "DELETE" }
      );
      window.location.reload();
      if (!res.ok) {
        const errData = await res.json();
        alert(`❌ Error: ${errData.detail || "Failed to delete"}`);
        return;
      }

      const data = await res.json();
      alert(data.message);
      setHistory((prev) => prev.filter((h) => !h.uploadedAt.startsWith(date)));
    } catch (err) {
      console.error("❌ Error deleting data:", err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
    <Navbar/>
      <Typography variant="h4" gutterBottom fontWeight={700} sx={{ mt: 6 }}>
        📋 Uploaded CSV Data
      </Typography>

      {/* --- UPLOAD HISTORY CARDS --- */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 2,
          mt: 3,
          pt: 3,
        }}
      >
        {history.length === 0 ? (
          <Typography
            color="text.secondary"
            sx={{ gridColumn: "1 / -1", textAlign: "center" }}
          >
            No upload history found.
          </Typography>
        ) : (
          history.map((h) => (
            <Paper key={h.date} sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">{h.date}</Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={() => deleteDataForDate(h.uploadedAt)}
                >
                  Delete All
                </Button>
              </Box>
              <Typography color="text.secondary">Records: {h.count}</Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => fetchDataForDate(h.uploadedAt)}
              >
                View Data
              </Button>
            </Paper>
          ))
        )}
      </Box>

      {/* --- DEFAULT DATA TABLE --- */}
      <Paper sx={{ mt: 6, p: 2, overflowX: "auto" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : data.length === 0 ? (
          <Typography align="center" sx={{ p: 3 }}>
            No uploaded data found.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Company Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Lease Expiration Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Square Footage
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row["company"] || "—"}</TableCell>
                  <TableCell>{row["address"] || "—"}</TableCell>
                  <TableCell>{row["lease_date"] || "—"}</TableCell>
                  <TableCell>{row["sqft"] || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* --- DIALOG --- */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Uploaded Data — {selectedDate}</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: 500 }}>
          {records.length === 0 ? (
            <Typography>No records found for this date.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Company Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Lease Expiration Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Square Footage
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row["company"] || "—"}</TableCell>
                    <TableCell>{row["address"] || "—"}</TableCell>
                    <TableCell>{row["lease_date"] || "—"}</TableCell>
                    <TableCell>{row["sqft"] || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
