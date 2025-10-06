import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Link as IntegrationsIcon,
  Security as PermissionsIcon,
  CreditCard as BillingIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Navbar from './Navbar';

// Styled components
const StyledCard = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
  padding: theme.spacing(3),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[15],
    transform: 'translateY(-5px)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: 'white',
  textTransform: 'none',
  fontWeight: 500,
  padding: '8px 16px',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
    boxShadow: theme.shadows[4],
    transform: 'translateY(-1px)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
    },
  },
}));

// Mock data for demonstration
const mockUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  mobile: '+1 (555) 123-4567',
  brokerLicense: 'BRK123456',
};

const mockIntegrations = [
  {
    id: 1,
    name: 'Salesforce',
    status: 'connected',
    lastSync: '2024-03-15 14:30',
    type: 'crm',
  },
  {
    id: 2,
    name: 'HubSpot',
    status: 'disconnected',
    lastSync: null,
    type: 'crm',
  },
  {
    id: 3,
    name: 'Property Data Feed',
    status: 'connected',
    lastSync: '2024-03-15 13:45',
    type: 'feed',
  },
];

const mockBillingData = {
  plan: 'Professional',
  usage: {
    properties: 150,
    tenants: 75,
    buyers: 50,
  },
  nextBilling: '2024-04-15',
  paymentMethod: {
    type: 'Visa',
    last4: '4242',
    expiry: '12/25',
  },
};

const SettingsPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [userData, setUserData] = useState(mockUserData);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    instantPush: true,
    alertCategories: {
      hotLeads: true,
      permits: true,
      leaseExpiry: true,
      dealRisk: true,
      marketChange: true,
      companyUpdate: true,
      fundingRound: true,
      hiringSpike: true,
    },
  });
  const [permissions, setPermissions] = useState({
    sharePropertyData: true,
    shareTenantData: true,
    shareBuyerData: true,
    dataGranularity: {
      property: 'at_asset_level',
      tenant: 'at_asset_level',
      buyer: 'stat_pos_level',
    },
  });
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleUserDataChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (field, value) => {
    if (field.includes('.')) {
      const [category, subcategory] = field.split('.');
      setNotifications(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [subcategory]: value,
        },
      }));
    } else {
      setNotifications(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handlePermissionChange = (field, value) => {
    if (field.includes('.')) {
      const [category, subcategory] = field.split('.');
      setPermissions(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [subcategory]: value,
        },
      }));
    } else {
      setPermissions(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSaveProfile = () => {
    // Implement save profile functionality
    console.log('Saving profile:', userData);
  };

  const handleSavePassword = () => {
    // Implement password change functionality
    console.log('Changing password:', passwordData);
  };

  const handleSaveNotifications = () => {
    // Implement save notifications functionality
    console.log('Saving notifications:', notifications);
  };

  const handleSavePermissions = () => {
    // Implement save permissions functionality
    console.log('Saving permissions:', permissions);
  };

  const handleConnectIntegration = (integration) => {
    // Implement OAuth flow
    console.log('Connecting integration:', integration);
  };

  const handleDisconnectIntegration = (integration) => {
    // Implement disconnect functionality
    console.log('Disconnecting integration:', integration);
  };

  const handleUpdatePaymentMethod = () => {
    // Implement payment method update
    console.log('Updating payment method:', newPaymentMethod);
    setPaymentDialogOpen(false);
  };

  const getTabLabel = (index) => {
    switch (index) {
      case 0: return 'Personal Info';
      case 1: return 'Notifications';
      case 2: return 'CRM Integrations';
      case 3: return 'Billing';
      case 4: return 'Permissions';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-40" style={{ marginTop: '64px' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-slate-600 mt-1">Manage your account preferences and settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Box sx={{ p: 3, display: 'flex', gap: 3, maxWidth: '1400px', mx: 'auto' }}>
        {/* Left Sidebar Navigation */}
        <StyledCard sx={{ width: 280, height: 'fit-content', position: 'sticky', top: 100 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ 
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              background: 'linear-gradient(45deg, #6366F1 30%, #8B5CF6 90%)'
            }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Jason Doe</Typography>
              <Typography variant="body2" color="text.secondary">Admin</Typography>
            </Box>
          </Stack>
          <List component="nav" sx={{ '& .MuiListItem-root': { borderRadius: 2, mb: 1 } }}>
            {[
              { icon: <PersonIcon />, text: 'Personal Info', value: 0 },
              { icon: <NotificationsIcon />, text: 'Notifications', value: 1 },
              { icon: <IntegrationsIcon />, text: 'CRM Integrations', value: 2 },
              { icon: <BillingIcon />, text: 'Billing', value: 3 },
              { icon: <PermissionsIcon />, text: 'Permissions', value: 4 },
            ].map((item) => (
              <ListItem
                key={item.text}
                button
                selected={currentTab === item.value}
                onClick={() => setCurrentTab(item.value)}
                sx={{
                  '&.Mui-selected': {
                    background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1) 30%, rgba(139, 92, 246, 0.1) 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.15) 30%, rgba(139, 92, 246, 0.15) 90%)',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(99, 102, 241, 0.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: currentTab === item.value ? 'primary.main' : 'inherit',
                  minWidth: 40 
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: currentTab === item.value ? 'bold' : 'normal',
                    color: currentTab === item.value ? 'primary.main' : 'inherit',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </StyledCard>

        {/* Right Content Area */}
        <Box sx={{ flexGrow: 1 }}>
          <StyledCard>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>{getTabLabel(currentTab)}</Typography>

            {/* Profile Tab */}
            {currentTab === 0 && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="Name"
                      value={userData.name}
                      onChange={(e) => handleUserDataChange('name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="Email"
                      value={userData.email}
                      onChange={(e) => handleUserDataChange('email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="Mobile"
                      value={userData.mobile}
                      onChange={(e) => handleUserDataChange('mobile', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      fullWidth
                      label="Broker License #"
                      value={userData.brokerLicense}
                      onChange={(e) => handleUserDataChange('brokerLicense', e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Change Password</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <StyledTextField
                      fullWidth
                      type="password"
                      label="Current Password"
                      value={passwordData.current}
                      onChange={(e) => handlePasswordChange('current', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <StyledTextField
                      fullWidth
                      type="password"
                      label="New Password"
                      value={passwordData.new}
                      onChange={(e) => handlePasswordChange('new', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <StyledTextField
                      fullWidth
                      type="password"
                      label="Confirm New Password"
                      value={passwordData.confirm}
                      onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <GradientButton onClick={handleSaveProfile}>
                    Save Profile
                  </GradientButton>
                  <GradientButton 
                    onClick={handleSavePassword}
                    sx={{
                      background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #8BC34A 30%, #4CAF50 90%)',
                      },
                    }}
                  >
                    Change Password
                  </GradientButton>
                </Stack>
              </Box>
            )}

            {/* Notifications Tab */}
            {currentTab === 1 && (
              <Box>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailDigest}
                        onChange={(e) => handleNotificationChange('emailDigest', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Email Digest"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.instantPush}
                        onChange={(e) => handleNotificationChange('instantPush', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Instant Push Notifications"
                  />

                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>Alert Categories</Typography>
                  <Grid container spacing={2}>
                    {Object.entries(notifications.alertCategories).map(([category, enabled]) => (
                      <Grid item xs={12} sm={6} md={4} key={category}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={enabled}
                              onChange={(e) => handleNotificationChange(`alertCategories.${category}`, e.target.checked)}
                              color="primary"
                            />
                          }
                          label={category.replace(/([A-Z])/g, ' $1').trim()}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>

                <GradientButton onClick={handleSaveNotifications} sx={{ mt: 3 }}>
                  Save Notification Settings
                </GradientButton>
              </Box>
            )}

            {/* Integrations Tab */}
            {currentTab === 2 && (
              <Box>
                <Stack spacing={2}>
                  {mockIntegrations.map((integration) => (
                    <StyledCard key={integration.id}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs>
                          <Typography variant="subtitle1" fontWeight="bold">{integration.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {integration.status === 'connected'
                              ? `Last synced: ${integration.lastSync}`
                              : 'Not connected'}
                          </Typography>
                        </Grid>
                        <Grid item>
                          {integration.status === 'connected' ? (
                            <GradientButton
                              onClick={() => handleDisconnectIntegration(integration)}
                              sx={{
                                background: 'linear-gradient(45deg, #EF5350 30%, #F44336 90%)',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #F44336 30%, #EF5350 90%)',
                                },
                              }}
                            >
                              Disconnect
                            </GradientButton>
                          ) : (
                            <GradientButton
                              onClick={() => handleConnectIntegration(integration)}
                            >
                              Connect
                            </GradientButton>
                          )}
                        </Grid>
                      </Grid>
                    </StyledCard>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Billing Tab */}
            {currentTab === 3 && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <StyledCard>
                      <Typography variant="subtitle1" gutterBottom fontWeight="bold">Current Plan</Typography>
                      <Typography variant="h5" color="primary" fontWeight="bold">{mockBillingData.plan}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Next billing date: {mockBillingData.nextBilling}
                      </Typography>
                    </StyledCard>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledCard>
                      <Typography variant="subtitle1" gutterBottom fontWeight="bold">Usage</Typography>
                      <Stack spacing={1}>
                        <Typography>Properties: {mockBillingData.usage.properties}</Typography>
                        <Typography>Tenants: {mockBillingData.usage.tenants}</Typography>
                        <Typography>Buyers: {mockBillingData.usage.buyers}</Typography>
                      </Stack>
                    </StyledCard>
                  </Grid>
                  <Grid item xs={12}>
                    <StyledCard>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">Payment Method</Typography>
                          <Typography>
                            {mockBillingData.paymentMethod.type} ending in {mockBillingData.paymentMethod.last4}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Expires {mockBillingData.paymentMethod.expiry}
                          </Typography>
                        </Box>
                        <GradientButton
                          onClick={() => setPaymentDialogOpen(true)}
                        >
                          Update Payment Method
                        </GradientButton>
                      </Stack>
                    </StyledCard>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Permissions Tab */}
            {currentTab === 4 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Choose whether to share fixonal data with BrokerHQ and at what level of granularity.
                </Typography>
                
                <Stack spacing={3}>
                  {['Property', 'Tenant', 'Buyer'].map((type) => (
                    <StyledCard key={type}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>{type} Data</Typography>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} md={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={permissions[`share${type}Data`]}
                                onChange={(e) => handlePermissionChange(`share${type}Data`, e.target.checked)}
                                color="primary"
                              />
                            }
                            label={`Share fixonal data with BrokerHQ`}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            <InputLabel>Data Granularity</InputLabel>
                            <Select
                              value={permissions.dataGranularity[type.toLowerCase()]}
                              onChange={(e) => handlePermissionChange(`dataGranularity.${type.toLowerCase()}`, e.target.value)}
                              label="Data Granularity"
                            >
                              <MenuItem value="at_asset_level">At the asset level</MenuItem>
                              <MenuItem value="stat_pos_level">Stat pos-level</MenuItem>
                              <MenuItem value="anonymized">Anonymized</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </StyledCard>
                  ))}
                </Stack>

                <GradientButton onClick={handleSavePermissions} sx={{ mt: 3 }}>
                  Save Changes
                </GradientButton>
              </Box>
            )}
          </StyledCard>
        </Box>
      </Box>

      {/* Payment Method Dialog */}
      <Dialog 
        open={paymentDialogOpen} 
        onClose={() => setPaymentDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Update Payment Method</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <StyledTextField
              fullWidth
              label="Card Number"
              value={newPaymentMethod.cardNumber}
              onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <StyledTextField
                  fullWidth
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={newPaymentMethod.expiry}
                  onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, expiry: e.target.value }))}
                />
              </Grid>
              <Grid item xs={6}>
                <StyledTextField
                  fullWidth
                  label="CVV"
                  value={newPaymentMethod.cvv}
                  onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cvv: e.target.value }))}
                />
              </Grid>
            </Grid>
            <StyledTextField
              fullWidth
              label="Name on Card"
              value={newPaymentMethod.name}
              onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, name: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setPaymentDialogOpen(false)}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <GradientButton onClick={handleUpdatePaymentMethod}>
            Update Payment Method
          </GradientButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SettingsPage; 