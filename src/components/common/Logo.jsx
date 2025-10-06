import React from 'react';
import { Box, Typography, styled } from '@mui/material';

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  textDecoration: 'none',
  color: 'inherit',
  padding: theme.spacing(1),
  '&:hover': {
    opacity: 0.9,
  },
}));

const LogoImage = styled('img')(({ theme }) => ({
  height: '32px',
  width: '32px',
  objectFit: 'contain',
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: {
    height: '40px',
    width: '40px',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.5rem',
  },
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '0.5px',
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'block',
  },
}));

const Logo = () => {
  return (
    <LogoContainer component="a" href="/">
      <LogoImage 
        src="/brokerhq_icon.png" 
        alt="BrokerHQ"
        loading="eager"
      />
      <LogoText></LogoText>
    </LogoContainer>
  );
};

export default Logo; 