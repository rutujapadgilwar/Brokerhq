import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ImageTest = () => {
  const testImages = [
    '/property.jpeg',
    '/brokerhq_icon.png',
    '/google.png',
    '/microsoft.png',
    '/linkedin.png',
    '/salesforce.png',
    '/hubspot.jpg'
  ];

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Image Loading Test
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {testImages.map((imagePath, index) => (
          <Box key={index} sx={{ textAlign: 'center' }}>
            <img
              src={imagePath}
              alt={`Test ${index + 1}`}
              style={{ 
                width: '100px', 
                height: '100px', 
                objectFit: 'cover',
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
              onError={(e) => {
                console.error(`Failed to load image: ${imagePath}`);
                e.target.style.border = '2px solid red';
                e.target.style.backgroundColor = '#ffebee';
              }}
              onLoad={() => {
                console.log(`Successfully loaded image: ${imagePath}`);
              }}
            />
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              {imagePath}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ImageTest; 