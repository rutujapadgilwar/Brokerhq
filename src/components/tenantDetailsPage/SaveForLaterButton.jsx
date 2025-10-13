import { useState, useEffect } from "react";
import { Button, Tooltip, Stack, TableCell } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const SaveForLaterButton = ({ tenantId, userId, onStatusChange }) => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Check initial saved state
  useEffect(() => {
  const checkIfSaved = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/watchlist?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        const found = data.watchlist?.some(item => item.tenant_id === tenantId);
        setSaved(found);
        onStatusChange?.(found);
      }
    } catch (err) {
      console.error(err);
    }
  };
  if (userId && tenantId) checkIfSaved();
}, [tenantId, userId, onStatusChange]);

  // Toggle save/remove
  const handleToggle = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      if (saved) {
        const res = await fetch(
          `${backendUrl}/api/watchlist/${tenantId}?user_id=${userId}`,
          { method: "DELETE" }
        );
        if (res.ok) {
          setSaved(false);
          onStatusChange?.(false);
        }
      } else {
        const res = await fetch(`${backend}/api/watchlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, tenant_id: tenantId }),
        });
        if (res.ok) {
          setSaved(true);
          onStatusChange?.(true);
        }
      }
    } catch (err) {
      console.error("Watchlist update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TableCell sx={{ textAlign: "center" }}>
      <Stack direction="row" spacing={0.5} justifyContent="center">
        <Tooltip title={saved ? "Remove from Watchlist" : "Save for Later"}>
          <Button
            variant={saved ? "contained" : "outlined"}
            disabled={loading}
            sx={{
              minWidth: 0,
              backgroundColor: saved ? "#0F62FE" : "#fff",
              color: saved ? "#fff" : "#0F62FE",
              border: saved ? "none" : "1px solid #0F62FE",
              borderRadius: 6,
              p: "6px",
              "&:hover": {
                backgroundColor: saved ? "#0F62FE" : "#E3F0FF",
                border: saved ? "none" : "1px solid #0F62FE",
              },
            }}
            size="small"
            onClick={handleToggle}
          >
            {saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
          </Button>
        </Tooltip>
      </Stack>
    </TableCell>
  );
};

export default SaveForLaterButton;
