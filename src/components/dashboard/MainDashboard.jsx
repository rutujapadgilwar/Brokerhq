import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Avatar,
  Badge,
} from "@mui/material";
import {
  Home as HomeIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import "./MainDashboard.css";
import { BarChart3, Brain, Search, Bell, List, Users, Flame, Clock, FileText, Upload } from "lucide-react";
import {
  Person as PersonIcon,
} from "@mui/icons-material";
const MainDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const stats = [
    {
      label: 'Active Prospects',
      number: '1,247',
      change: '+12% from last month',
      positive: true,
      icon: Users,
      bgColor: '#DBEAFE',
      iconColor: '#3B82F6'
    },
    {
      label: 'New Prospects this week',
      number: '89',
      change: '+24% this week',
      positive: true,
      icon: Flame,
      bgColor: '#FEE2E2',
      iconColor: '#EF4444'
    },
    {
      label: 'Time Saved',
      number: '23 hrs',
      change: '+7 hours saved',
      positive: false,
      icon: Clock,
      bgColor: '#D1FAE5',
      iconColor: '#10B981'
    },
    {
      label: 'Reports Generated',
      number: '15',
      change: '+10 reports pulled',
      positive: true,
      icon: FileText,
      bgColor: '#E9D5FF',
      iconColor: '#A855F7'
    }
  ];

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "white",
        position: "relative",
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          background:
            "linear-gradient(180deg, rgba(246, 246, 248, 0.95) 0%, rgba(235, 239, 250, 0.9) 50%, rgba(249, 250, 250, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          color: "black",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "4px 0 32px rgba(0, 0, 0, 0.15)",
          position: "relative",
          zIndex: 10,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
            pointerEvents: "none",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            boxSizing: "border-box",
            position: "relative",
            width: "100%",
            height: "81px",
            borderBottom: "1px solid #E5E7EB",
            borderRadius: 0,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              width: "173px",
              height: "38px",
              left: "34px",
              top: "21px",
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: "28px",
              color: "#1765C2",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
            onClick={() => handleNavigation("/dashboard")}
          >
            <img
              src="/brokerhq_icon.png"
              alt="BrokerHQ Logo"
              style={{ height: 45, width: 56 }}
            />
            BrokerHQ
          </Typography>
        </Box>

        {/* Menu Items */}
        <Box sx={{ flex: 1, position: "relative", zIndex: 1, mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              background: isActiveRoute("/dashboard")
                ? "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)"
                : "transparent",
              backdropFilter: isActiveRoute("/dashboard")
                ? "blur(10px)"
                : "none",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "0 12px 12px 0",
              marginRight: 2,
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(26, 24, 24, 0.15), rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(10px)",
                transform: "translateX(4px)",
              },
            }}
            onClick={() => handleNavigation("/dashboard")}
          >
            <HomeIcon sx={{ fontSize: 16, color: "#111827" }} />
            <span
              style={{
                fontFamily: "Inter",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "17px",
                color: "#111827",
              }}
            >
              Dashboard
            </span>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              background: isActiveRoute("/tenant")
                ? "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)"
                : "transparent",
              backdropFilter: isActiveRoute("/tenant") ? "blur(10px)" : "none",
              borderRight: isActiveRoute("/tenant")
                ? "3px solid #fbbf24"
                : "none",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "0 12px 12px 0",
              marginRight: 2,
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(26, 24, 24, 0.15), rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(10px)",
                transform: "translateX(4px)",
              },
            }}
            onClick={() => handleNavigation("/tenant")}
          >
            <Brain size={16} color="#fdfdffff" fill="#414348ff" />
            <span
              style={{
                fontFamily: "Inter",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "17px",
                color: "#111827",
              }}
            >
              Prospect Intelligence
            </span>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              background: isActiveRoute("/industry")
                ? "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)"
                : "transparent",
              backdropFilter: isActiveRoute("/industry")
                ? "blur(10px)"
                : "none",
              borderRight: isActiveRoute("/industry")
                ? "3px solid #fbbf24"
                : "none",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "0 12px 12px 0",
              marginRight: 2,
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(26, 24, 24, 0.15), rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(10px)",
                transform: "translateX(4px)",
              },
            }}
            onClick={() => handleNavigation("/industry")}
          >
            <Search size={16} color="#111827" />
            <span
              style={{
                fontFamily: "Inter",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "17px",
                color: "#111827",
              }}
            >
              Industry Trend Dashboard
            </span>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              background: isActiveRoute("/watchlist")
                ? "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)"
                : "transparent",
              backdropFilter: isActiveRoute("/watchlist")
                ? "blur(10px)"
                : "none",
              borderRight: isActiveRoute("/watchlist")
                ? "3px solid #fbbf24"
                : "none",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "0 12px 12px 0",
              marginRight: 2,
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(26, 24, 24, 0.15) 0%, rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(10px)",
                transform: "translateX(4px)",
              },
            }}
            onClick={() => handleNavigation("/watchlist")}
          >
            <List size={16} color="#111827" />
            <span
              style={{
                fontFamily: "Inter",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "17px",
                color: "#111827",
              }}
            >
              Watchlist
            </span>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              background: isActiveRoute("/alerts")
                ? "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)"
                : "transparent",
              backdropFilter: isActiveRoute("/alerts") ? "blur(10px)" : "none",
              borderRight: isActiveRoute("/alerts")
                ? "3px solid #fbbf24"
                : "none",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              borderRadius: "0 12px 12px 0",
              marginRight: 2,
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(26, 24, 24, 0.15) 0%, rgba(255,255,255,0.05) 100%)",
                backdropFilter: "blur(10px)",
                transform: "translateX(4px)",
              },
            }}
            onClick={() => handleNavigation("/upload")}
          >
            <Upload size={16} color="#111827" fill="#111827" />
            <span
              style={{
                fontFamily: "Inter",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "17px",
                color: "#111827",
              }}
            >
              Upload CSV
            </span>
          </Box>
        </Box>
      </Box>

      {/* Navbar */}
      <Box
        sx={{
          boxSizing: "border-box",
          position: "fixed",
          width: "calc(100% - 240px)",
          height: "81px",
          left: "240px",
          top: "0px",
          background: "#FFFFFF",
          borderBottom: "1px solid #E5E7EB",
          borderRadius: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          zIndex: 5,
        }}
      >
        <Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: '#111827',
              fontSize: '24px',
              lineHeight: '32px',
              mb: 0.5
            }}
          >
            Dashboard
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#4B5563',
              fontSize: '14px',
              lineHeight: '20px'
            }}
          >
            Welcome back! Here's what's happening with your prospects.
          </Typography>
        </Box>
        
        {/* Right Section - Icons and Profile */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          {/* Notification Bell */}
          <IconButton
            sx={{
              width: "40px",
              height: "40px",
              background: "#EFF6FF",
              "&:hover": {
                background: "#DBEAFE",
              },  
            }}
            onClick={() => handleNavigation("/alerts")}
          >
            <Badge
              badgeContent={1}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#EF4444",
                  color: "#FFFFFF",
                  fontSize: "10px",
                  minWidth: "16px",
                  height: "16px",
                  top: 2,
                  right: 2,
                },
              }}
            >
              <Bell size={20} color="#1765C2" />
            </Badge>
          </IconButton>

          {/* Profile Avatar */}
          <Box
            sx={{
              position: "relative",
              width: "40px",
              height: "40px",
              cursor: "pointer",
            }}
            onClick={() => handleNavigation("/settings")}
          >
            <Avatar sx={{ width: 40, height: 40 }}>
                              <PersonIcon />
                            </Avatar>
            
          </Box>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          marginLeft: "240px",
          marginTop: "81px",
          p: 3,
          overflowY: "auto",
        }}
      >
      </Box>
    </Box>
  );
};

export default MainDashboard;
