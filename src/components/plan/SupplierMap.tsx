import { VStack, HStack, Text, Box, Badge, Button, SimpleGrid } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { FiMapPin, FiPackage, FiShoppingCart, FiTool } from 'react-icons/fi';
import { useState } from 'react';
import * as React from 'react';

export interface SupplierLocation {
  id: string;
  name: string;
  type: 'bibit' | 'pakan' | 'pasar' | 'peralatan';
  address: string;
  coordinates?: { lat: number; lng: number };
  distance?: string;
  contact?: string;
  rating?: number;
}

export interface SupplierMapProps {
  suppliers?: SupplierLocation[];
  centerLocation?: { lat: number; lng: number };
}

type SupplierFilterType = 'all' | 'bibit' | 'pakan' | 'pasar' | 'peralatan';

/**
 * Peta Supplier - Interaktif map untuk lokasi supplier
 * - Bibit ikan
 * - Pakan
 * - Pasar/penjualan
 * - Peralatan
 */
export function SupplierMap({ suppliers, centerLocation }: SupplierMapProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const [filterType, setFilterType] = useState<SupplierFilterType>('all');

  const defaultSuppliers: SupplierLocation[] = suppliers || [
    {
      id: '1',
      name: 'Peternakan Ikan Lele Sumber Rezeki',
      type: 'bibit',
      address: 'Jl. Raya Padang-Pariaman KM 12, Sumatera Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
      distance: '15 km',
      contact: '0812-3456-7890',
      rating: 4.5,
    },
    {
      id: '2',
      name: 'Toko Pakan Ikan Makmur',
      type: 'pakan',
      address: 'Jl. Ahmad Yani No. 45, Padang, Sumatera Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
      distance: '8 km',
      contact: '0813-4567-8901',
      rating: 4.8,
    },
    {
      id: '3',
      name: 'Pasar Ikan Terpadu Padang',
      type: 'pasar',
      address: 'Jl. Bung Hatta, Padang, Sumatera Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
      distance: '12 km',
      contact: '0751-123456',
      rating: 4.3,
    },
    {
      id: '4',
      name: 'PT Peralatan Budidaya Indonesia',
      type: 'peralatan',
      address: 'Jl. Sudirman No. 88, Padang, Sumatera Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
      distance: '10 km',
      contact: '0814-5678-9012',
      rating: 4.7,
    },
    {
      id: '5',
      name: 'UD Sumber Bibit Unggul',
      type: 'bibit',
      address: 'Jl. Raya Bukittinggi-Padang, Sumatera Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
      distance: '25 km',
      contact: '0815-6789-0123',
      rating: 4.6,
    },
    {
      id: '6',
      name: 'Supplier Pakan Premium',
      type: 'pakan',
      address: 'Jl. Gajah Mada No. 22, Padang, Sumatera Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
      distance: '6 km',
      contact: '0816-7890-1234',
      rating: 4.9,
    },
  ];

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
                leftIcon={<Box>{option.icon}</Box>}
              >
                {option.label}
              </Button>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Map Placeholder */}
      <Card variant="elevated">
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
            Peta Lokasi Supplier
          </Text>
        </CardHeader>
        <CardBody>
          <Box
            w="full"
            h="400px"
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
            {/* Simple SVG Map Representation */}
            <svg width="100%" height="100%" viewBox="0 0 400 300">
              {/* Background */}
              <rect width="400" height="300" fill={useColorModeValue('#e0f2fe', '#1e293b')} />
              
              {/* Roads */}
              <path
                d="M 50 150 L 150 120 L 250 140 L 350 130"
                stroke={useColorModeValue('#94a3b8', '#64748b')}
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M 100 50 L 100 250"
                stroke={useColorModeValue('#94a3b8', '#64748b')}
                strokeWidth="3"
                fill="none"
              />
              <path
                d="M 200 50 L 200 250"
                stroke={useColorModeValue('#94a3b8', '#64748b')}
                strokeWidth="3"
                fill="none"
              />
              
              {/* Supplier Markers */}
              {filteredSuppliers.slice(0, 4).map((supplier, idx) => {
                const positions = [
                  { x: 120, y: 100 },
                  { x: 180, y: 120 },
                  { x: 240, y: 140 },
                  { x: 300, y: 130 },
                ];
                const pos = positions[idx] || { x: 150, y: 150 };
                const color =
                  supplier.type === 'bibit'
                    ? '#25521a'
                    : supplier.type === 'pakan'
                    ? '#183d50'
                    : supplier.type === 'pasar'
                    ? '#be8900'
                    : '#6b7280';

                return (
                  <g key={supplier.id}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="12"
                      fill={color}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      fontSize="10"
                      fill="white"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {idx + 1}
                    </text>
                  </g>
                );
              })}
              
              {/* Center Location Marker (Your Farm) */}
              <g>
                <circle cx="200" cy="150" r="15" fill="#ef4444" stroke="white" strokeWidth="3" />
                <text
                  x="200"
                  y="155"
                  fontSize="12"
                  fill="white"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  You
                </text>
              </g>
            </svg>
            
            {/* Overlay Info */}
            <Box
              position="absolute"
              bottom={4}
              left={4}
              right={4}
              bg={useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(30, 41, 59, 0.95)')}
              p={3}
              borderRadius="md"
              backdropFilter="blur(8px)"
            >
              <Text fontSize="xs" color={textSecondary} textAlign="center">
                💡 Integrate dengan Google Maps API atau Leaflet untuk peta interaktif
              </Text>
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* Supplier List */}
      {Object.entries(groupedSuppliers).map(([type, typeSuppliers]) => (
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

