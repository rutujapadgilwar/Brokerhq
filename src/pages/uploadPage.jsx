import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinkIcon from "@mui/icons-material/Link";
import Navbar from "../components/dashboard/Navbar";

function UploadPage() {
  const time = new Date().toISOString();
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({
    company: "",
    address: "",
    city: "",
    state: "",
    lease_date: "",
    sqft: "",
  });
  const [step, setStep] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 50; // render 50 rows per chunk (tweak as needed)
  const paginatedData = tableData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const [reviewOpen, setReviewOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handlePreview = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${backendUrl}/preview_headers`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) return alert(data.detail);
      setHeaders(data.headers);
      setStep(2);
    } catch (err) {
      console.error("Preview error:", err);
      alert("Error previewing file");
    }
  };

  const handleProcess = async () => {
    if (Object.values(mapping).some((v) => v === "")) {
      alert("Please map all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mapping", JSON.stringify(mapping));

    try {
      const res = await fetch(`${backendUrl}/process_csv`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) return alert(data.detail);

      // Normalize rows to always have errorMessage
      const rows = (data.rows || []).map((r, index) => {
        const rowError = data.errors?.find((e) => e.row === index + 2);
        return {
          ...r,
          errorMessage: rowError ? rowError.message : "",
        };
      });
      setTableData(rows);
      setReviewOpen(true);
    } catch (err) {
      console.error("Process error:", err);
      alert("Error processing file");
    }
  };
  const handleEdit = (index, field, value) => {
    setTableData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDeleteRow = (index) => {
    setTableData((prev) => prev.filter((_, i) => i !== index));
  };

  const revalidateData = async () => {
    try {
      const cleanedData = tableData.map((r) => ({
        ...r,
        errorMessage: "",
        errors: undefined,
      }));

      const res = await fetch(`${backendUrl}/validate_csv_rows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      const validatedRows = data.data.map((row, index) => {
        const rowError = data.errors?.find((err) => err.row === index + 2);
        return {
          ...row,
          errorMessage: rowError ? rowError.message : "",
          errors: undefined,
        };
      });

      setTableData(validatedRows);
      alert("✅ Revalidation complete");
    } catch (err) {
      console.error("Validation error:", err);
      alert("Error during revalidation");
    }
  };

  const allValid =
    tableData.length > 0 &&
    tableData.every((r) => !r.errorMessage || r.errorMessage.trim() === "");

  const handleProceedToTerms = () => {
    setReviewOpen(false);
    setTermsOpen(true);
  };

  const handleUploadFinal = async () => {
    try {
      const filteredData = tableData.map((row) => ({
        company: row["Company Name"] || "",
        address: row["Address"] || "",
        city: row["City"] || "",
        state: row["State"] || "",
        lease_date: row["Lease Expiration Date"] || "",
        sqft: row["Square Footage"] || "",
      }));

      const res = await fetch(`${backendUrl}/save_csv_uploaded_data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "brokerhq",
          data: filteredData, // <- edited data
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(`✅ ${result.count} records saved successfully!`);
        window.location.reload(); // reload page to refresh data
      } else {
        alert(`❌ Error saving: ${result.detail || JSON.stringify(result)}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading data");
    }
  };

  const renderDropdown = (field, label) => (
    <FormControl fullWidth key={field}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={mapping[field]}
        onChange={(e) => setMapping({ ...mapping, [field]: e.target.value })}
      >
        <MenuItem value="">
          <em>-- Select Column --</em>
        </MenuItem>
        {headers.map((h) => (
          <MenuItem key={h} value={h}>
            {h}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f7f8fa", minHeight: "100vh" }}>
      {/* Navbar if exists */}
      <Navbar />

      {/* Step 1: Upload */}
      {step === 1 && (
        <Card sx={{ maxWidth: 600, mx: "auto", p: 3, textAlign: "center" }}>
          <CardContent>
            <CloudUploadIcon sx={{ fontSize: 60, color: "primary.main" }} />
            <Typography variant="h6" gutterBottom>
              Upload CSV File
            </Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={<LinkIcon />}
            >
              Choose File
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>
            {file && (
              <Typography mt={2}>
                Selected: <strong>{file.name}</strong>
              </Typography>
            )}
            <Box mt={3}>
              <Button
                variant="contained"
                disabled={!file}
                onClick={handlePreview}
              >
                Continue to Mapping
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Mapping */}
      {step === 2 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Paper sx={{ p: 5, borderRadius: 3, width: "100%", maxWidth: 500 }}>
            <Typography variant="h5" gutterBottom textAlign="center">
              🧩 Map Your CSV Columns
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {renderDropdown("company", "Company Name")}
              {renderDropdown("address", "Address")}
              {renderDropdown("city", "City")}
              {renderDropdown("state", "State")}
              {renderDropdown("lease_date", "Lease Expiration Date")}
              {renderDropdown("sqft", "Square Footage")}
            </Box>
            <Box textAlign="center" mt={5}>
              <Button variant="contained" size="large" onClick={handleProcess}>
                Process & Review Data
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Review Dialog */}
      <Dialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>📋 Review Data</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Lease Expiration Date</TableCell>
                  <TableCell>Square Footage</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, i) => {
                  const globalIndex = i + page * rowsPerPage;
                  const errorMsg = row.errorMessage?.trim() || "";
                  const hasError = errorMsg !== "";

                  const fieldHasError = (field) =>
                    hasError &&
                    errorMsg.toLowerCase().includes(field.toLowerCase());

                  return (
                    <TableRow
                      key={i}
                      sx={{ backgroundColor: hasError ? "#ffe6e6" : "inherit" }}
                    >
                      <TableCell>
                        <TextField
                          value={row["Company Name"] ?? ""}
                          error={fieldHasError("Company Name")}
                          helperText={
                            fieldHasError("Company Name") ? errorMsg : ""
                          }
                          onChange={(e) =>
                            handleEdit(
                              globalIndex,
                              "Company Name",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          value={row["Address"] ?? ""}
                          error={fieldHasError("Address")}
                          helperText={fieldHasError("Address") ? errorMsg : ""}
                          onChange={(e) =>
                            handleEdit(globalIndex, "Address", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          value={row["City"] ?? ""}
                          error={fieldHasError("City")}
                          helperText={fieldHasError("City") ? errorMsg : ""}
                          onChange={(e) =>
                            handleEdit(globalIndex, "City", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          value={row["State"] ?? ""}
                          error={fieldHasError("State")}
                          helperText={fieldHasError("State") ? errorMsg : ""}
                          onChange={(e) =>
                            handleEdit(globalIndex, "State", e.target.value)
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          value={row["Lease Expiration Date"] ?? ""}
                          error={fieldHasError("Lease Expiration Date")}
                          helperText={
                            fieldHasError("Lease Expiration Date")
                              ? errorMsg
                              : ""
                          }
                          onChange={(e) =>
                            handleEdit(
                              globalIndex,
                              "Lease Expiration Date",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <TextField
                          value={row["Square Footage"] ?? ""}
                          error={fieldHasError("Square Footage")}
                          helperText={
                            fieldHasError("Square Footage") ? errorMsg : ""
                          }
                          onChange={(e) =>
                            handleEdit(
                              globalIndex,
                              "Square Footage",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Button
                          color="error"
                          variant="contained"
                          onClick={() => handleDeleteRow(globalIndex)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Button
              variant="outlined"
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={page === 0}
            >
              ← Previous
            </Button>

            <Typography>
              Page {page + 1} of {Math.ceil(tableData.length / rowsPerPage)}
            </Typography>

            <Button
              variant="outlined"
              onClick={() =>
                setPage((prev) =>
                  Math.min(
                    Math.ceil(tableData.length / rowsPerPage) - 1,
                    prev + 1
                  )
                )
              }
              disabled={page >= Math.ceil(tableData.length / rowsPerPage) - 1}
            >
              Next →
            </Button>
          </Box>

          {tableData.some((r) => r.errorMessage?.trim()) && (
            <Box mt={2} color="error.main">
              <Typography fontWeight={600}>⚠️ Issues Found:</Typography>
              <ul>
                {tableData.map((r, idx) =>
                  r.errorMessage?.trim() ? (
                    <li key={idx}>
                      Row {idx + 2}: {r.errorMessage}
                    </li>
                  ) : null
                )}
              </ul>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)}>Close</Button>
          {/* ✅ Only show Next → Terms if all rows are valid */}
          {allValid && tableData.length > 0 && (
            <Button
              variant="contained"
              color="success"
              onClick={handleProceedToTerms}
            >
              Next → Terms
            </Button>
          )}

          <Button variant="outlined" color="warning" onClick={revalidateData}>
            Revalidate Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* Terms Dialog */}
      <Dialog
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>📜 Terms & Conditions</DialogTitle>
        <DialogContent dividers>
          <Typography><b>By uploading this data, you confirm:</b></Typography>
          <ul>
            <li>I confirm that I am authorized to upload this data to BrokerHQ and that it does not violate any third-party rights or platform terms (e.g., CoStar, LoopNet, Crexi). I understand that BrokerHQ is not responsible for unauthorized or misused data uploads</li>
          </ul>
          <FormControlLabel
            control={
              <Checkbox
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
            }
            label="I agree to the Terms & Conditions"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTermsOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadFinal}
            disabled={!agree}
          >
            Upload Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UploadPage;
