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
import axios from "axios";
import Navbar from "../components/dashboard/Navbar";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import TablePagination from "@mui/material/TablePagination";

export default function UploadedCsvDataPage() {
  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const userId = "brokerhq"; // ⚙️ Replace with your actual logged-in user ID
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
        console.log(result);
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

  const StyledTableRow = styled(TableRow)({
    cursor: "pointer",
  });
  const fetchCompanyInfoAgent = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.post(
        `${backendUrl}/auto-process-to-fetch-private-company-info`
      );

      setMessage(response.data.message || "Process completed!");
    } catch (error) {
      setMessage("❌ Error processing company data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleRowClick = (id) => {
    if (!id) return console.error("❌ company_id missing", id);
    navigate(`/private_company/${id}`);
  };
  const handleChangePage = (event, newPage) => {
  setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 4 }}>
      <Navbar />
      <Typography variant="h4" gutterBottom fontWeight={700} sx={{ mt: 6 }}>
        📋 My Data
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
                {/* PUBLISH DATE TOP-RIGHT */}
                <Typography
                  color="text.secondary"
                  
                >
                  {new Date(h.uploadedAt).toLocaleDateString()}
                </Typography>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
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
      <Box>
        <div>
          <Button
            fullWidth={false}
            variant="contained"
            onClick={fetchCompanyInfoAgent}
            disabled={loading}
            sx={{
              mt: 2,
              px: 3,
              py: 1.2,
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "none",
              letterSpacing: "0.5px",
              backgroundColor: loading ? "grey.400" : "primary.main",
              boxShadow: loading
                ? "none"
                : "0 4px 10px rgba(25, 118, 210, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: loading ? "grey.400" : "primary.dark",
                transform: loading ? "none" : "translateY(-2px)",
                boxShadow: loading
                  ? "none"
                  : "0 6px 14px rgba(25, 118, 210, 0.4)",
              },
            }}
          >
            {loading ? "Processing..." : "Fetch Company’s Information"}
          </Button>

          {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </div>
      </Box>
      <Paper
        sx={{
          mt: 6,
          p: 2,
          overflowX: "auto",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
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
              <TableRow
                sx={{
                  backgroundColor: "#f5f5f5",
                }}
              >
                {[
                  "COMPANY NAME",
                  "ADDRESS",
                  "CITY",
                  "STATE",
                  "LEASE EXPIRATION DATE",
                  "SQUARE FOOTAGE",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      color: "#333",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, idx) => (
                <StyledTableRow
                  key={row._id || idx}
                  onClick={() => handleRowClick(row._id)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f9f9f9" },
                    width: 4,
                    p: 0,
                    border: "none",
                    borderRadius: 3,
                  }}
                >
                  {/* Company Name - link look */}
                  <TableCell
                    sx={{
                      color: "#1976d2",
                      fontWeight: 500,
                      "&:hover": {},
                    }}
                  >
                    {row.company || "—"}
                  </TableCell>
                  <TableCell>{row.address || "—"}</TableCell>
                  <TableCell>{row.city || "—"}</TableCell>
                  <TableCell>{row.state || "—"}</TableCell>
                  <TableCell>{row.lease_date || "—"}</TableCell>
                  <TableCell>{row.sqft || "—"}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
            <TablePagination
              component="div"
              count={data.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
          />
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
                  <TableCell sx={{ fontWeight: "bold" }}>City</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>State</TableCell>
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
                    <TableCell>{row["city"] || "—"}</TableCell>
                    <TableCell>{row["state"] || "—"}</TableCell>
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
