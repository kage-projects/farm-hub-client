import { VStack, HStack, Text, Box } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { Button } from '../button/Button';
import { useColorModeValue } from '../ui/color-mode';
import type { SupplierData } from '../../data/mockSuppliers';
import type { SupplierScore } from '../../utils/supplier/scoring';
import { calculateBadges, getBadgeDefinition } from '../../utils/supplier/badges';
import { SupplierBadge } from './SupplierBadge';
import { FiMapPin, FiStar, FiPackage, FiShoppingCart, FiTool, FiDroplet } from 'react-icons/fi';

export interface SupplierCardProps {
  supplier: SupplierData;
  score: SupplierScore;
  distance?: number; // km (optional)
  onSelect?: (supplierId: string) => void;
}

const categoryIcons = {
  bibit: FiPackage,
  pakan: FiShoppingCart,
  obat: FiDroplet,
  logistik: FiTool,
};

const categoryLabels = {
  bibit: 'Bibit Ikan',
  pakan: 'Pakan',
  obat: 'Obat',
  logistik: 'Peralatan',
};

/**
 * Supplier Card Component
 * - Display supplier info dengan score & badges
 * - Distance, rating, price range
 * - Action button
 */
export function SupplierCard({ supplier, score, distance, onSelect }: SupplierCardProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const badges = calculateBadges(supplier, score);
  const CategoryIcon = categoryIcons[supplier.category] || FiPackage;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <VStack align="stretch" gap={3}>
          <HStack justify="space-between" align="start">
            <VStack align="start" gap={1} flex={1}>
              <HStack gap={2}>
                <Box fontSize="lg" color={`${supplier.category === 'bibit' ? 'brand' : supplier.category === 'pakan' ? 'secondary' : 'accent'}.600`}>
                  <CategoryIcon />
                </Box>
                <VStack align="start" gap={0}>
                  <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                    {supplier.name}
                  </Text>
                  <Text fontSize="xs" color={textSecondary}>
                    {categoryLabels[supplier.category]}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
            <Box>
              <Text fontSize="lg" fontWeight="bold" color="brand.600">
                {(score.totalScore * 100).toFixed(0)}
              </Text>
              <Text fontSize="xs" color={textSecondary} textAlign="right">
                Score
              </Text>
            </Box>
          </HStack>

          {/* Badges */}
          {badges.length > 0 && (
            <HStack gap={2} flexWrap="wrap">
              {badges.map((badgeType) => (
                <SupplierBadge key={badgeType} type={badgeType} />
              ))}
            </HStack>
          )}
        </VStack>
      </CardHeader>

      <CardBody>
        <VStack align="stretch" gap={3}>
          {/* Location */}
          <HStack gap={2}>
            <FiMapPin size={16} color={useColorModeValue('#718096', '#A0AEC0')} />
            <Text fontSize="sm" color={textSecondary} flex={1}>
              {supplier.location.address}
            </Text>
          </HStack>

          {/* Distance */}
          {distance !== undefined && (
            <HStack gap={2}>
              <Text fontSize="sm" color={textSecondary}>
                📍 Jarak: <Text as="span" fontWeight="medium">{distance.toFixed(1)} km</Text>
              </Text>
            </HStack>
          )}

          {/* Rating & Stats */}
          <HStack justify="space-between" flexWrap="wrap" gap={2}>
            <HStack gap={1}>
              <FiStar size={14} color="#F6AD55" fill="#F6AD55" />
              <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                {supplier.rating.toFixed(1)}
              </Text>
              <Text fontSize="xs" color={textSecondary}>
                ({supplier.transactionCount} transaksi)
              </Text>
            </HStack>
            <Text fontSize="xs" color={textSecondary}>
              SLA: {supplier.sla.averageDeliveryTime} jam
            </Text>
          </HStack>

          {/* Price Range */}
          <Box
            p={2}
            borderRadius="md"
            border="1px solid"
            borderColor={borderColor}
            bg={useColorModeValue('gray.50', 'gray.800')}
          >
            <Text fontSize="xs" color={textSecondary} mb={1}>
              Harga
            </Text>
            <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
              {formatCurrency(supplier.priceRange.min)} - {formatCurrency(supplier.priceRange.max)} / {supplier.priceRange.unit}
            </Text>
          </Box>

          {/* Action Button */}
          {onSelect && (
            <Button
              variant="solid"
              colorScheme="brand"
              size="sm"
              onClick={() => onSelect(supplier.id)}
            >
              Pilih Supplier
            </Button>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}

