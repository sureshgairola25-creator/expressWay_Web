import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CommuteIcon from '@mui/icons-material/Commute';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PeopleIcon from '@mui/icons-material/People';
import LocationOn from '@mui/icons-material/LocationOn';
import AltRoute from '@mui/icons-material/AltRoute';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

export default function Sidebar({ open, onToggle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Trips', icon: <CommuteIcon />, path: '/admin/trips' },
    { text: 'Bookings', icon: <ConfirmationNumberIcon />, path: '/admin/bookings' },
    { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Cars', icon: <DirectionsCarIcon />, path: '/admin/cars' },
    { text: 'Coupons', icon: <LocalOfferIcon />, path: '/admin/coupons' },
    // { text: 'Manage Locations', icon: <LocationOn />, path: '/admin/locations' },
    { text: 'Manage Routes', icon: <AltRoute />, path: '/admin/routes' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onToggle}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f9fafb',
          borderRadius: '0 16px 16px 0',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          transition: 'width 0.3s ease-in-out',
          ...(open && { width: drawerWidth }),
          ...(!open && { width: 64 }),
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ color: '#7c3aed', fontWeight: 700 }}>
            {open ? 'ExpressCab' : 'E'}
          </Typography>
        </Box>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              backgroundColor: isActive(item.path) ? '#7c3aed' : 'transparent',
              color: isActive(item.path) ? '#fff' : '#374151',
              '&:hover': {
                backgroundColor: isActive(item.path) ? '#6b2fbc' : '#e5e7eb',
              },
              borderRadius: '8px',
              margin: '4px 8px',
              padding: '12px 16px',
              transition: 'all 0.2s ease-in-out',
              justifyContent: open ? 'flex-start' : 'center',
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive(item.path) ? '#fff' : '#6b7280',
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            {open && (
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: isActive(item.path) ? '#fff' : '#374151',
                    fontWeight: 500,
                  },
                }}
              />
            )}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
