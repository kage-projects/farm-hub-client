import { Box } from '@chakra-ui/react';
import { useColorModeValue } from '../../../components/ui/color-mode';
import { useEffect, useRef, useState } from 'react';

export interface GoogleMapPickerProps {
  lat?: number;
  lng?: number;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
  centerCity?: { lat: number; lng: number };
}

// Declare Google Maps types
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options?: any) => any;
        Marker: new (options?: any) => any;
        event: {
          addListener: (instance: any, eventName: string, handler: (e: any) => void) => void;
        };
      };
    };
  }
}

/**
 * Google Map Picker Component
 * Allows user to click on map to select coordinates
 */
export function GoogleMapPicker({ 
  lat, 
  lng, 
  onMapClick,
  height = '400px',
  centerCity
}: GoogleMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  // Default center: Padang, Sumatera Barat
  const defaultCenter = { lat: -0.94924, lng: 100.35427 };
  // Use centerCity if provided, otherwise use selected coordinates, otherwise default
  const center = centerCity || (lat && lng ? { lat, lng } : defaultCenter);

  useEffect(() => {
    // Load Google Maps API
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        setMapLoaded(true); // Set to true anyway to show fallback
      };
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !window.google?.maps || !mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      // Add click listener to map
      window.google.maps.event.addListener(mapInstanceRef.current, 'click', (e: any) => {
        if (!e.latLng) return;

        const clickedLat = e.latLng.lat();
        const clickedLng = e.latLng.lng();

        // Update or create marker
        if (markerRef.current) {
          markerRef.current.setPosition({ lat: clickedLat, lng: clickedLng });
        } else {
          markerRef.current = new window.google.maps.Marker({
            position: { lat: clickedLat, lng: clickedLng },
            map: mapInstanceRef.current,
            draggable: true,
            title: 'Lokasi Proyek',
          });

          window.google.maps.event.addListener(markerRef.current, 'dragend', () => {
            const position = markerRef.current?.getPosition();
            if (position && onMapClick) {
              onMapClick(position.lat(), position.lng());
            }
          });
        }

        // Call onMapClick callback
        if (onMapClick) {
          onMapClick(clickedLat, clickedLng);
        }
      });
    }

    // Update map center when centerCity changes
    if (centerCity && mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: centerCity.lat, lng: centerCity.lng });
      mapInstanceRef.current.setZoom(13);
    }

    // Update marker position when lat/lng props change
    if (lat && lng) {
      if (markerRef.current) {
        markerRef.current.setPosition({ lat, lng });
        // Only center map if not using centerCity
        if (!centerCity) {
          mapInstanceRef.current.setCenter({ lat, lng });
        }
      } else {
        markerRef.current = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstanceRef.current,
          draggable: true,
          title: 'Lokasi Proyek',
        });

        window.google.maps.event.addListener(markerRef.current, 'dragend', () => {
          const position = markerRef.current?.getPosition();
          if (position && onMapClick) {
            onMapClick(position.lat(), position.lng());
          }
        });
      }
    } else if (markerRef.current) {
      // Remove marker if coordinates are cleared
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
  }, [mapLoaded, lat, lng, onMapClick, centerCity, center]);

  // Fallback UI if Google Maps API is not available
  if (!mapLoaded || !window.google?.maps) {
    return (
      <Box
        w="full"
        h={height}
        bg={bgColor}
        borderRadius="md"
        border="2px dashed"
        borderColor={borderColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
      >
        <Box textAlign="center" p={4}>
          <Box fontSize="sm" color="gray.500" mb={2}>
            Memuat peta...
          </Box>
          <Box fontSize="xs" color="gray.400">
            {!window.google ? 'Memuat Google Maps API...' : 'Pastikan Google Maps API key sudah dikonfigurasi'}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      ref={mapRef}
      w="full"
      h={height}
      borderRadius="md"
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
      position="relative"
    />
  );
}

