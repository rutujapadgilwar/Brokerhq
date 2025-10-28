import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  MailOutline as MailOutlineIcon,
  Visibility as ViewDetailsIcon,
  Delete as DeleteIcon, 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const WatchlistPage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [message, setMessage] = useState(""); // ✅ success/error message
  const [openSnackbar, setOpenSnackbar] = useState(false); // ✅ Snackbar state
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const fetchWatchlistDetails = async () => {
    try {
      const watchlistRes = await fetch(
        `${backendUrl}/api/watchlist?user_id=brokerhq`
      );
      if (!watchlistRes.ok) throw new Error("Failed to fetch watchlist");
      const watchlistData = await watchlistRes.json();
      const tenantIds = watchlistData.watchlist.map((item) => item.tenant_id);

      const tenantDetails = await Promise.all(
        tenantIds.map(async (id) => {
          try {
            const res = await fetch(`${backendUrl}/api/tenants/${id}`);
            if (!res.ok) return null;
            const data = await res.json();
            return data;
          } catch (err) {
            console.error("Failed fetching tenant:", id, err);
            return null;
          }
        })
      );

      setTenants(tenantDetails.filter(Boolean));
    } catch (err) {
      console.error("Error fetching watchlist tenants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlistDetails();
  }, []);

  const handleSelectAllClick = (e) => {
    if (e.target.checked) setSelected(tenants.map((t) => t.tenant_id));
    else setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else if (selectedIndex === 0)
      newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1)
      newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0)
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleRowMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleRowMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleTenantClick = () => {
    if (selectedRow) {
      navigate(`/tenant/${selectedRow.tenant_id || selectedRow._id}`);
      handleRowMenuClose();
    }
  };

  const handleDeleteSaved = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/watchlist/${
          selectedRow.tenant_id || selectedRow._id
        }?user_id=brokerhq`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setTenants((prev) =>
          prev.filter(
            (tenant) =>
              tenant.tenant_id !== selectedRow.tenant_id &&
              tenant._id !== selectedRow._id
          )
        );

        setSelected((prev) =>
          prev.filter(
            (id) => id !== selectedRow.tenant_id && id !== selectedRow._id
          )
        );

        setMessage("Tenant successfully deleted ✅");
        setOpenSnackbar(true);

        handleRowMenuClose();
      } else {
        console.error("Failed to delete tenant:", await res.text());
        setMessage("Failed to delete tenant ❌");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error("Error deleting tenant:", err);
      setMessage("Error deleting tenant ❌");
      setOpenSnackbar(true);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center">
        <CircularProgress />
      </div>
    );

  if (!tenants.length)
    return (
      <div className="p-6 text-center">
        {message || "No tenants in your watchlist."}

        {/* Snackbar for messages */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            severity={message.includes("successfully") ? "success" : "error"}
            onClose={() => setOpenSnackbar(false)}
          >
            {message}
          </Alert>
        </Snackbar>
      </div>
    );

  return (
    <Box className="max-w-7xl mx-auto px-6 py-8">
      <Navbar />

      <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        {/* Header with Select All */}
        <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={selected.length === tenants.length}
              onChange={handleSelectAllClick}
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm font-medium text-slate-700">
              Select All ({tenants.length})
            </span>
          </label>
          {selected.length > 0 && (
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
              {selected.length} selected
            </span>
          )}
        </div>

        {/* Tenant Cards */}
        <div className="divide-y divide-slate-200/50">
          {tenants.map((tenant) => {
            const isItemSelected = isSelected(tenant.tenant_id);

            return (
              <div
                key={tenant.tenant_id}
                className="p-6 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <label className="flex items-center mt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isItemSelected}
                      onChange={() => handleClick(tenant.tenant_id)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                  </label>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {tenant.tenant_name}
                        </h3>

                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            <LocationIcon className="w-4 h-4" />
                            <span>
                              {tenant.headquarter_address?.street},{" "}
                              {tenant.headquarter_address?.city},{" "}
                              {tenant.headquarter_address?.state}{" "}
                              {tenant.headquarter_address?.zip}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <BusinessIcon className="w-4 h-4" />
                            <span>{tenant.industry}</span>
                          </div>

                          {tenant.website && (
                            <div>
                              <a
                                href={tenant.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline"
                              >
                                Website
                              </a>
                            </div>
                          )}

                          {tenant.phone && <div>📞 {tenant.phone}</div>}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => handleRowMenuOpen(e, tenant)}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreVertIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleRowMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { borderRadius: 2, mt: 1 },
        }}
      >
        <MenuItem onClick={handleTenantClick}>
          <ListItemIcon>
            <ViewDetailsIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>

        <MenuItem onClick={handleDeleteSaved}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      {/* Snackbar for messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          severity={message.includes("successfully") ? "success" : "error"}
          onClose={() => setOpenSnackbar(false)}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WatchlistPage;
