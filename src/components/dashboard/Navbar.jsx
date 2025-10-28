import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
  styled,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  WatchLater as WatchlistIcon,
  Person as PersonIcon,
  Assignment as TasksIcon,
  Menu as MenuIcon,
  Mail as MailIcon,
  AccountCircle,
  More as MoreIcon,
} from "@mui/icons-material";
import StorageIcon from "@mui/icons-material/Storage";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  color: theme.palette.text.primary,
}));

const LogoImage = styled("img")(({ theme }) => ({
  height: "32px",
  width: "32px",
  objectFit: "contain",
  transition: "all 0.3s ease",
  [theme.breakpoints.up("sm")]: {
    height: "40px",
    width: "40px",
  },
}));

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(3); // Example notification count
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("demoLoggedIn");
    localStorage.removeItem("demoOnboardingComplete");
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={() => handleNavigation("/settings")}>
        Settings
      </MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              BrokerHQ
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Link
              to="/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                padding: 1,
              }}
            >
              <LogoImage
                src="/brokerhq_icon.png"
                alt="BrokerHQ"
                loading="eager"
              />
            </Link>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="My Data">
              <IconButton
                component={Link}
                to="/getCsvData" // route to your uploaded CSV page
                size="small"
                sx={{
                  color:
                    location.pathname === "/getCsvData"
                      ? "primary.main"
                      : "inherit",
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                    boxShadow: theme.shadows[2],
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease",
                  ml: 1,
                }}
              >
                <StorageIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Watchlist">
              <IconButton
                component={Link}
                to="/watchlist"
                size="small"
                sx={{
                  color:
                    location.pathname === "/watchlist"
                      ? "primary.main"
                      : "inherit",
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                    boxShadow: theme.shadows[2],
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <WatchlistIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton
                component={Link}
                to="/alerts"
                size="small"
                sx={{
                  color:
                    location.pathname === "/notifications"
                      ? "primary.main"
                      : "inherit",
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                    boxShadow: theme.shadows[2],
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Badge badgeContent={notifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{
                  ml: 2,
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                    boxShadow: theme.shadows[2],
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={(event) => setMobileMoreAnchorEl(event.currentTarget)}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>
      {renderMobileMenu}
      {renderMenu}
    </>
  );
};

export default Navbar;
