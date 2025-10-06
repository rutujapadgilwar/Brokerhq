import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  FormGroup,
  RadioGroup,
  Radio,
  Divider,
  LinearProgress,
  Switch,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const steps = [
  'Firm Identity',
  'Broker License Verification',
  'Default Filters Setup',
  'CRM Connection',
];

const OnboardingWizard = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firmName: '',
    role: '',
    officeLocation: '',
    brokerLicenseNumber: '',
    licensingState: '',
    licenseFile: null,
    defaultAssetTypes: [],
    defaultCounties: [],
    preferredDealSize: '',
    autoApplyFilters: false,
    crmConnected: false,
    crmSyncOnLogin: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' || type === 'radio' ? checked : value,
    }));
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => {
      const newTypes = checked
        ? [...prev.defaultAssetTypes, name]
        : prev.defaultAssetTypes.filter((type) => type !== name);
      return { ...prev, defaultAssetTypes: newTypes };
    });
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      licenseFile: e.target.files[0],
    }));
  };

  const handleNext = () => {
    // Basic validation for Step 1 (Firm Identity)
    if (activeStep === 0) {
      if (!formData.firmName || !formData.role) {
        alert('Please fill all required fields in Firm Identity.');
        return;
      }
    }
    // Basic validation for Step 2 (Broker License Verification)
    if (activeStep === 1) {
      if (!formData.brokerLicenseNumber || !formData.licensingState) {
        alert('Please fill all required fields in Broker License Verification.');
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFinish = () => {
    // In a real app, send formData to backend
    console.log('Onboarding Complete:', formData);
    console.log('Calling onComplete handler');
    if (onComplete) {
      onComplete();
    } else {
      console.error('onComplete handler is not provided');
    }
  };

  const handleSkipCrm = () => {
    console.log('Skipping CRM setup');
    if (onComplete) {
      onComplete();
    } else {
      console.error('onComplete handler is not provided');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Firm Identity
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Firm Identity</Typography>
            <TextField
              label="Firm Name (required)"
              name="firmName"
              value={formData.firmName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Role (required)</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                label="Role (required)"
              >
                <MenuItem value="Broker">Broker</MenuItem>
                <MenuItem value="Managing Broker">Managing Broker</MenuItem>
                <MenuItem value="Analyst">Analyst</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Office Location (optional)"
              name="officeLocation"
              value={formData.officeLocation}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Box>
        );
      case 1: // Broker License Verification
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Broker License Verification</Typography>
            <TextField
              label="Broker License Number (required)"
              name="brokerLicenseNumber"
              value={formData.brokerLicenseNumber}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Licensing State (required)</InputLabel>
              <Select
                name="licensingState"
                value={formData.licensingState}
                onChange={handleInputChange}
                label="Licensing State (required)"
              >
                <MenuItem value="WA">Washington</MenuItem>
                <MenuItem value="OR">Oregon</MenuItem>
                <MenuItem value="CA">California</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2, mb: 1 }}>
              <input
                accept="application/pdf,image/*"
                style={{ display: 'none' }}
                id="license-upload-button"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="license-upload-button">
                <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                  Upload License (Optional)
                </Button>
              </label>
              {formData.licenseFile && (
                <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
                  {formData.licenseFile.name}
                </Typography>
              )}
            </Box>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
              "By proceeding, you confirm that your license is valid and that you are authorized to use BrokerHQ to upload and manage data on behalf of your firm."
            </Typography>
          </Box>
        );
      case 2: // Default Filters Setup
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Default Filters Setup</Typography>
            <FormControl component="fieldset" margin="normal">
              <Typography variant="subtitle1" gutterBottom>Default Asset Types</Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="Office"
                      checked={formData.defaultAssetTypes.includes('Office')}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Office"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="Industrial"
                      checked={formData.defaultAssetTypes.includes('Industrial')}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Industrial"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="Retail"
                      checked={formData.defaultAssetTypes.includes('Retail')}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Retail"
                />
              </FormGroup>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Default Counties/Submarkets</InputLabel>
              <Select
                multiple
                name="defaultCounties"
                value={formData.defaultCounties}
                onChange={(e) => handleMultiSelectChange('defaultCounties', e.target.value)}
                label="Default Counties/Submarkets"
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="King County">King County</MenuItem>
                <MenuItem value="Snohomish County">Snohomish County</MenuItem>
                <MenuItem value="Pierce County">Pierce County</MenuItem>
              </Select>
            </FormControl>

            <FormControl component="fieldset" margin="normal">
              <Typography variant="subtitle1" gutterBottom>Preferred Deal Size</Typography>
              <RadioGroup
                name="preferredDealSize"
                value={formData.preferredDealSize}
                onChange={handleInputChange}
              >
                <FormControlLabel value="<5K SF" control={<Radio />} label="<5K SF" />
                <FormControlLabel value="5K–15K SF" control={<Radio />} label="5K–15K SF" />
                <FormControlLabel value="15K–50K SF" control={<Radio />} label="15K–50K SF" />
                <FormControlLabel value=">50K SF" control={<Radio />} label=">50K SF" />
              </RadioGroup>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  name="autoApplyFilters"
                  checked={formData.autoApplyFilters}
                  onChange={handleInputChange}
                  color="primary"
                />
              }
              label="Auto-apply these filters on dashboard load"
              sx={{ mt: 2 }}
            />
          </Box>
        );
      case 3: // CRM Connection
        return (
          <Box>
            <Typography variant="h6" gutterBottom>CRM Connection</Typography>
            <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={
                  <img 
                    src="/salesforce.png" 
                    alt="Salesforce" 
                    style={{ height: 20, width: 'auto' }} 
                  />
                } 
                onClick={() => setFormData(prev => ({...prev, crmConnected: true}))}
              >
                Salesforce
              </Button>
              <Button 
                variant="outlined" 
                startIcon={
                  <img 
                    src="/hubspot.jpg" 
                    alt="HubSpot" 
                    style={{ height: 20, width: 'auto' }} 
                  />
                } 
                onClick={() => setFormData(prev => ({...prev, crmConnected: true}))}
              >
                HubSpot
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<CloudUploadIcon />}
              >
                Upload CSV
              </Button>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  name="crmSyncOnLogin"
                  checked={formData.crmSyncOnLogin}
                  onChange={handleInputChange}
                />
              }
              label="Enable CRM sync on login"
              sx={{ mt: 2 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Status: {formData.crmConnected ? 'Connected' : 'Not connected'}
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          width: '100%',
          maxWidth: 600,
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            Onboarding Wizard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
          </Typography>
          <LinearProgress variant="determinate" value={((activeStep + 1) / steps.length) * 100} sx={{ mt: 1 }} />
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Box>
              <Button 
                variant="text" 
                onClick={handleSkipCrm} 
                sx={{ mr: 2, textTransform: 'none', fontWeight: 500 }}
              >
                Skip
              </Button>
              <Button 
                variant="contained" 
                onClick={handleFinish} 
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Finish Setup
              </Button>
            </Box>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Continue
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default OnboardingWizard;