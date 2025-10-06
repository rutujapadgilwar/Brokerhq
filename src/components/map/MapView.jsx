import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Loader } from '@googlemaps/js-api-loader';

// Seattle coordinates
const SEATTLE_CENTER = {
  lat: 47.6062,
  lng: -122.3321
};

// Styled components
const MapContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '100%',
  minHeight: '700px',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  position: 'relative',
  boxShadow: theme.shadows[5],
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
}));

const MapView = ({ locations = [], onMarkerClick }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places']
      });

      try {
        const google = await loader.load();
        
        // Initialize map
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: SEATTLE_CENTER,
          zoom: 12,
          styles: [
            
          ]
        });

        setMap(mapInstance);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers = [];

    // Add new markers
    locations.forEach(location => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.title,
        animation: google.maps.Animation.DROP
      });

      // Add click listener
      marker.addListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(location);
        }
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Fit bounds if there are multiple locations
    if (locations.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach(location => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds);
    } else if (locations.length === 1) {
      map.setCenter({ lat: locations[0].lat, lng: locations[0].lng });
      map.setZoom(15);
    }
  }, [map, locations]);

  return (
    <MapContainer>
      <Box
        ref={mapRef}
        sx={{
          width: '100%',
          height: '100%',
          minHeight: '500px'
        }}
      />
    </MapContainer>
  );
};

export default MapView; 