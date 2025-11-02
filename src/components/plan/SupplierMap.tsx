import { VStack, HStack, Text, Box, Badge, Button, SimpleGrid, Spinner } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { FiMapPin, FiPackage, FiShoppingCart, FiTool } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import * as React from 'react';
import { searchSuppliers, type SupplierLocation } from '../../services/googleMapsPlacesApi';
import { Alert } from '../feedback/Alert';
import { loadGoogleMapsAPI } from '../../utils/googleMapsLoader';

// Re-export SupplierLocation for backward compatibility
export type { SupplierLocation };

export interface SupplierMapProps {
  suppliers?: SupplierLocation[];
  centerLocation?: { lat: number; lng: number };
  jenisIkan?: string;
  kota?: string;
}

type SupplierFilterType = 'all' | 'bibit' | 'pakan' | 'pasar' | 'peralatan';

/**
 * Peta Supplier - Interaktif map untuk lokasi supplier
 * - Bibit ikan
 * - Pakan
 * - Pasar/penjualan
 * - Peralatan
 */
export function SupplierMap({ suppliers, centerLocation, jenisIkan, kota }: SupplierMapProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const [filterType, setFilterType] = useState<SupplierFilterType>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedSuppliers, setFetchedSuppliers] = useState<SupplierLocation[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  // Load Google Maps API (singleton - will only load once)
  useEffect(() => {
    loadGoogleMapsAPI()
      .then(() => {
        setMapLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to load Google Maps API:', error);
        setMapLoaded(true); // Set to true anyway to show fallback
      });
  }, []);

  // Fetch suppliers from Google Maps Places API
  useEffect(() => {
    const fetchSuppliers = async () => {
      // Use provided suppliers if available, otherwise fetch from API
      if (suppliers && suppliers.length > 0) {
        setFetchedSuppliers(suppliers);
        return;
      }

      // Need kota to fetch from API (centerLocation is optional, but recommended)
      if (!kota) {
        console.log('SupplierMap: kota tidak ada, skip fetch');
        return;
      }

      // Log untuk debugging
      console.log('SupplierMap: Fetching suppliers dengan:', {
        kota,
        jenisIkan,
        centerLocation,
      });

      setIsLoading(true);
      setError(null);

      try {
        // Generate keywords based on supplier type
        const supplierTypes = [
          {
            type: 'bibit' as const,
            keyword: jenisIkan ? `bibit ${jenisIkan} ${kota}` : `bibit ikan ${kota}`,
          },
          {
            type: 'pakan' as const,
            keyword: `pakan ikan ${kota}`,
          },
          {
            type: 'pasar' as const,
            keyword: `pasar ikan ${kota}`,
          },
          {
            type: 'peralatan' as const,
            keyword: `peralatan budidaya ikan ${kota}`,
          },
        ];

        // Use default location if centerLocation is not available
        const searchLocation = centerLocation || { lat: -0.94924, lng: 100.35427 }; // Default: Padang
        const results = await searchSuppliers(supplierTypes, searchLocation, 10000, jenisIkan, kota);
        setFetchedSuppliers(results);
      } catch (err: any) {
        const errorMessage = err.message || 'Gagal mengambil data supplier';
        setError(errorMessage);
        console.error('Error fetching suppliers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, [suppliers, centerLocation, jenisIkan, kota]);

  // Use only fetched suppliers or provided suppliers (no dummy data)
  const defaultSuppliers: SupplierLocation[] = fetchedSuppliers.length > 0 ? fetchedSuppliers : (suppliers || []);

  // Initialize map and markers
  useEffect(() => {
    if (!mapLoaded || !window.google?.maps || !mapRef.current) {
      console.log('SupplierMap: Map initialization skipped - mapLoaded:', mapLoaded, 'google.maps:', !!window.google?.maps, 'mapRef:', !!mapRef.current);
      return;
    }

    // Use default location if centerLocation is not provided
    const mapCenter = centerLocation || { lat: -0.94924, lng: 100.35427 }; // Default: Padang
    console.log('SupplierMap: Initializing map with center:', mapCenter);

    // Wait a bit for DOM to be ready
    const timer = setTimeout(() => {
      if (!mapRef.current) {
        console.log('SupplierMap: mapRef.current tidak ada saat timeout');
        return;
      }

      // Initialize map if not exists
      if (!mapInstanceRef.current) {
        try {
          console.log('SupplierMap: Creating new map instance');
          mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
            center: mapCenter,
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false,
            rotateControl: false,
            scaleControl: false,
            disableDefaultUI: true,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
              {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
              {
                featureType: 'administrative',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
              {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{ visibility: 'on' }],
              },
              {
                featureType: 'road',
                elementType: 'labels.text.stroke',
                stylers: [{ visibility: 'on' }],
              },
              {
                featureType: 'road.highway',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }],
              },
              {
                featureType: 'road.arterial',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }],
              },
              {
                featureType: 'road.local',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }],
              },
            ],
          });
          console.log('SupplierMap: Map instance created:', mapInstanceRef.current);
          
          // Trigger resize to ensure map renders correctly after a short delay
          setTimeout(() => {
            if (mapInstanceRef.current && window.google?.maps?.event) {
              try {
                (window.google.maps.event as any).trigger(mapInstanceRef.current, 'resize');
                console.log('SupplierMap: Resize event triggered');
              } catch (e) {
                console.warn('Could not trigger resize event:', e);
              }
            }
          }, 200);
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      } else {
        console.log('SupplierMap: Updating existing map center');
        mapInstanceRef.current.setCenter(mapCenter);
        mapInstanceRef.current.setZoom(13);
        // Trigger resize
        setTimeout(() => {
          if (mapInstanceRef.current && window.google?.maps?.event) {
            try {
              (window.google.maps.event as any).trigger(mapInstanceRef.current, 'resize');
            } catch (e) {
              console.warn('Could not trigger resize event:', e);
            }
          }
        }, 100);
      }

      // Clear existing markers
      markersRef.current.forEach((marker: any) => {
        marker.setMap(null);
      });
      markersRef.current = [];

      // Add center marker (your location) if centerLocation is provided
      if (centerLocation && mapInstanceRef.current) {
        const centerMarker = new window.google.maps.Marker({
          position: centerLocation,
          map: mapInstanceRef.current,
          title: 'Lokasi Proyek',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });
        markersRef.current.push(centerMarker);
      } else if (mapInstanceRef.current) {
        // Add default center marker if centerLocation is not provided
        const centerMarker = new window.google.maps.Marker({
          position: mapCenter,
          map: mapInstanceRef.current,
          title: 'Lokasi Pusat',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#6b7280',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });
        markersRef.current.push(centerMarker);
      }

      // Add supplier markers
      const filteredSuppliers = filterType === 'all' 
        ? defaultSuppliers 
        : defaultSuppliers.filter(s => s.type === filterType);

      const bounds = new window.google.maps.LatLngBounds();

      filteredSuppliers.forEach((supplier) => {
        if (!supplier.coordinates || !mapInstanceRef.current) return;

        const markerColor = getMarkerColor(supplier.type);
        const marker = new window.google.maps.Marker({
          position: supplier.coordinates,
          map: mapInstanceRef.current,
          title: supplier.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: markerColor,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        // Add click listener to show info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${supplier.name}</h3>
              <p style="margin: 4px 0; font-size: 12px; color: #666;">${supplier.address}</p>
              ${supplier.distance ? `<p style="margin: 4px 0; font-size: 12px; color: #666;">📍 ${supplier.distance}</p>` : ''}
              ${supplier.rating ? `<p style="margin: 4px 0; font-size: 12px; color: #666;">⭐ ${supplier.rating}</p>` : ''}
            </div>
          `,
        });

        marker.addListener('click', () => {
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          infoWindow.open(mapInstanceRef.current, marker);
          infoWindowRef.current = infoWindow;
        });

        markersRef.current.push(marker);
        bounds.extend(supplier.coordinates);
      });

      // Fit bounds to show all markers
      if (filteredSuppliers.length > 0 && bounds.getNorthEast() && mapInstanceRef.current) {
        try {
          mapInstanceRef.current.fitBounds(bounds);
          // Trigger resize and adjust zoom
          setTimeout(() => {
            if (mapInstanceRef.current && window.google?.maps?.event) {
              try {
                (window.google.maps.event as any).trigger(mapInstanceRef.current, 'resize');
                const currentZoom = mapInstanceRef.current.getZoom();
                if (currentZoom > 15) {
                  mapInstanceRef.current.setZoom(15);
                }
              } catch (e) {
                console.warn('Error adjusting zoom:', e);
              }
            }
          }, 200);
        } catch (error) {
          console.error('Error fitting bounds:', error);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(mapCenter);
            mapInstanceRef.current.setZoom(13);
          }
        }
      } else if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter(mapCenter);
        mapInstanceRef.current.setZoom(13);
        setTimeout(() => {
          if (mapInstanceRef.current && window.google?.maps?.event) {
            try {
              (window.google.maps.event as any).trigger(mapInstanceRef.current, 'resize');
            } catch (e) {
              console.warn('Could not trigger resize event:', e);
            }
          }
        }, 100);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [mapLoaded, defaultSuppliers, filterType, centerLocation]);

  const getMarkerColor = (type: string): string => {
    switch (type) {
      case 'bibit':
        return '#10b981'; // Emerald green - terang dan jelas
      case 'pakan':
        return '#3b82f6'; // Blue - biru terang
      case 'pasar':
        return '#f59e0b'; // Amber/Orange - kuning orange terang
      case 'peralatan':
        return '#ef4444'; // Red - merah terang
      default:
        return '#6b7280'; // Gray
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bibit':
        return <FiPackage />;
      case 'pakan':
        return <FiShoppingCart />;
      case 'pasar':
        return <FiMapPin />;
      case 'peralatan':
        return <FiTool />;
      default:
        return <FiMapPin />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bibit':
        return 'brand';
      case 'pakan':
        return 'secondary';
      case 'pasar':
        return 'accent';
      case 'peralatan':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bibit':
        return 'Bibit Ikan';
      case 'pakan':
        return 'Pakan';
      case 'pasar':
        return 'Pasar/Penjualan';
      case 'peralatan':
        return 'Peralatan';
      default:
        return type;
    }
  };

  // Filter suppliers based on selected type
  const filteredSuppliers = filterType === 'all' 
    ? defaultSuppliers 
    : defaultSuppliers.filter(s => s.type === filterType);

  const groupedSuppliers = filteredSuppliers.reduce((acc, supplier) => {
    if (!acc[supplier.type]) {
      acc[supplier.type] = [];
    }
    acc[supplier.type].push(supplier);
    return acc;
  }, {} as Record<string, SupplierLocation[]>);

  const filterOptions: { type: SupplierFilterType; label: string; icon: React.ReactNode }[] = [
    { type: 'all', label: 'Semua', icon: <FiMapPin /> },
    { type: 'bibit', label: 'Bibit Ikan', icon: <FiPackage /> },
    { type: 'pakan', label: 'Pakan', icon: <FiShoppingCart /> },
    { type: 'pasar', label: 'Pasar/Penjualan', icon: <FiMapPin /> },
    { type: 'peralatan', label: 'Peralatan', icon: <FiTool /> },
  ];

  return (
    <VStack align="stretch" gap={4}>
      {/* Loading State */}
      {isLoading && (
        <Card variant="elevated">
          <CardBody>
            <VStack gap={4}>
              <Spinner size="lg" color="brand.500" />
              <Text color={textSecondary}>Memuat data supplier dari Google Maps...</Text>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Alert 
          status="error" 
          variant="subtle"
          title={error}
        />
      )}

      {/* Filter Buttons */}
      <Card variant="elevated">
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
            Filter Supplier
          </Text>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 2, md: 5 }} gap={2}>
            {filterOptions.map((option) => (
              <Button
                key={option.type}
                size="sm"
                variant={filterType === option.type ? 'solid' : 'outline'}
                colorScheme={filterType === option.type ? 'brand' : 'gray'}
                onClick={() => setFilterType(option.type)}
              >
                <HStack gap={2}>
                  <Box>{option.icon}</Box>
                  <Text>{option.label}</Text>
                </HStack>
              </Button>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Google Maps */}
      <Card variant="elevated">
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
            Peta Lokasi Supplier
          </Text>
        </CardHeader>
        <CardBody>
          <Box
            ref={mapRef}
            w="100%"
            width="100%"
            h="400px"
            height="400px"
            minH="400px"
            borderRadius="md"
            border="1px solid"
            borderColor={borderColor}
            overflow="hidden"
            position="relative"
            bg={bgColor}
            style={{ minHeight: '400px' }}
          >
            {!mapLoaded && (
              <Box
                position="absolute"
                inset={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={bgColor}
                zIndex={10}
              >
                <VStack gap={2}>
                  <Spinner size="lg" color="brand.500" />
                  <Text fontSize="sm" color={textSecondary}>
                    Memuat peta...
                  </Text>
                </VStack>
              </Box>
            )}
            {mapLoaded && !window.google?.maps && (
            <Box
              position="absolute"
                inset={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={bgColor}
                zIndex={10}
              >
                <Text fontSize="sm" color={textSecondary}>
                  Gagal memuat Google Maps API
              </Text>
            </Box>
            )}
          </Box>
        </CardBody>
      </Card>

      {/* Supplier List - Only show if there are suppliers */}
      {defaultSuppliers.length === 0 && !isLoading && !error && (
        <Card variant="elevated">
          <CardBody>
            <Box textAlign="center" py={8}>
              <Text color={textSecondary}>
                Tidak ada supplier ditemukan. Pastikan lokasi proyek sudah diatur.
              </Text>
          </Box>
        </CardBody>
      </Card>
      )}

      {defaultSuppliers.length > 0 && Object.entries(groupedSuppliers).map(([type, typeSuppliers]) => (
        <Card key={type} variant="elevated">
          <CardHeader>
            <HStack>
              <Box fontSize="lg" color={useColorModeValue(`${getTypeColor(type)}.600`, `${getTypeColor(type)}.400`)}>
                {getTypeIcon(type)}
              </Box>
              <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
                {getTypeLabel(type)}
              </Text>
              <Badge colorScheme={getTypeColor(type)} variant="subtle">
                {typeSuppliers.length} supplier
              </Badge>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" gap={3}>
              {typeSuppliers.map((supplier) => (
                <Box
                  key={supplier.id}
                  p={4}
                  borderRadius="md"
                  border="1px solid"
                  borderColor={borderColor}
                  bg={useColorModeValue('white', 'gray.800')}
                >
                  <VStack align="stretch" gap={2}>
                    <HStack justify="space-between" align="start">
                      <VStack align="start" gap={1} flex={1}>
                        <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                          {supplier.name}
                        </Text>
                        <Text fontSize="sm" color={textSecondary}>
                          {supplier.address}
                        </Text>
                      </VStack>
                      {supplier.rating && (
                        <Badge colorScheme="yellow" variant="solid">
                          ⭐ {supplier.rating}
                        </Badge>
                      )}
                    </HStack>
                    <HStack gap={4} flexWrap="wrap">
                      {supplier.distance && (
                        <Text fontSize="sm" color={textSecondary}>
                          📍 {supplier.distance}
                        </Text>
                      )}
                      {supplier.contact && (
                        <Text fontSize="sm" color={textSecondary}>
                          📞 {supplier.contact}
                        </Text>
                      )}
                    </HStack>
                    <HStack gap={2} mt={2}>
                      <Button size="sm" variant="outline" colorScheme={getTypeColor(type)}>
                        Lihat di Peta
                      </Button>
                      <Button size="sm" variant="ghost" colorScheme={getTypeColor(type)}>
                        Hubungi
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
}

