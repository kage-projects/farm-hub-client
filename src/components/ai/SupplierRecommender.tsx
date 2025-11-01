import { VStack, HStack, Text, Box, Badge } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { Button } from '../button/Button';
import { useColorModeValue } from '../ui/color-mode';
import { recommendSuppliers } from '../../utils/ai/recommender';
import { mockSuppliers } from '../../data/mockSuppliers';
import type { SupplierData } from '../../data/mockSuppliers';
import { FiZap, FiMapPin } from 'react-icons/fi';

export interface SupplierRecommenderProps {
  userLocation?: { lat: number; lng: number };
  category?: SupplierData['category'];
  itemId?: string;
  qty?: number;
  deliveryBy?: string;
  budget?: number;
  onSelectSupplier?: (supplierId: string) => void;
}

/**
 * AI Supplier Recommender Component
 * - Top-3 supplier recommendations
 * - Alasan rekomendasi
 * - ETA prediction (p50/p90)
 */
export function SupplierRecommender({
  userLocation = { lat: -0.94924, lng: 100.35427 }, // Default: Padang
  category,
  onSelectSupplier,
}: SupplierRecommenderProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const recommendations = recommendSuppliers(mockSuppliers, userLocation, category, 3);

  if (recommendations.length === 0) {
    return (
      <Card variant="elevated">
        <CardBody>
          <Text color={textSecondary}>Tidak ada rekomendasi supplier yang tersedia.</Text>
        </CardBody>
      </Card>
    );
  }

  return (
    <VStack align="stretch" gap={4}>
      {/* Header */}
      <HStack gap={2}>
        <Box fontSize="xl" color="brand.600">
          <FiZap />
        </Box>
        <VStack align="start" gap={0} flex={1}>
          <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
            Rekomendasi Supplier Terbaik
          </Text>
          <Text fontSize="sm" color={textSecondary}>
            Dipilih berdasarkan skor, jarak, dan performa historis
          </Text>
        </VStack>
      </HStack>

      {/* Recommendations */}
      <VStack align="stretch" gap={4}>
        {recommendations.map((rec) => {
          const score = rec.score;
          const positiveReasons = rec.reasons.filter((r) => r.impact === 'positive');

          return (
            <Card key={rec.supplier.id} variant="elevated">
              <CardHeader>
                <HStack justify="space-between" align="start">
                  <HStack gap={2}>
                    <Badge colorScheme="accent" variant="solid" fontSize="xs">
                      #{rec.rank} Rekomendasi
                    </Badge>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      Score: {(score.totalScore * 100).toFixed(0)}/100
                    </Text>
                  </HStack>
                  <HStack gap={1}>
                    <FiMapPin size={14} />
                    <Text fontSize="xs" color={textSecondary}>
                      {rec.distance.toFixed(1)} km
                    </Text>
                  </HStack>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" gap={4}>
                  {/* Supplier Basic Info */}
                  <VStack align="start" gap={2}>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                        {rec.supplier.name}
                      </Text>
                      <HStack gap={1}>
                        <FiMapPin size={14} />
                        <Text fontSize="xs" color={textSecondary}>
                          {rec.distance.toFixed(1)} km
                        </Text>
                      </HStack>
                    </HStack>
                    <Text fontSize="sm" color={textSecondary}>
                      {rec.supplier.location.address}
                    </Text>
                    <HStack gap={2} flexWrap="wrap">
                      <Badge colorScheme="brand" variant="solid" fontSize="xs">
                        Score: {(score.totalScore * 100).toFixed(0)}
                      </Badge>
                      <Badge colorScheme="yellow" variant="solid" fontSize="xs">
                        ⭐ {rec.supplier.rating.toFixed(1)}
                      </Badge>
                    </HStack>
                  </VStack>

                  {/* Reasons */}
                  {positiveReasons.length > 0 && (
                    <Box
                      p={3}
                      borderRadius="md"
                      bg={useColorModeValue('brand.50', 'brand.900')}
                      border="1px solid"
                      borderColor={useColorModeValue('brand.200', 'brand.700')}
                    >
                      <Text fontSize="xs" fontWeight="semibold" color="brand.700" mb={2}>
                        Mengapa direkomendasikan:
                      </Text>
                      <VStack align="start" gap={1}>
                        {positiveReasons.slice(0, 3).map((reason, idx) => (
                          <HStack key={idx} gap={2}>
                            <Text fontSize="xs" color="brand.600">✓</Text>
                            <Text fontSize="xs" color={textPrimary}>{reason.label}</Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {/* ETA Prediction */}
                  <HStack justify="space-between" fontSize="xs" color={textSecondary}>
                    <Text>
                      Estimasi tiba: <Text as="span" fontWeight="semibold">{rec.etaP50}h</Text> (median), <Text as="span" fontWeight="semibold">{rec.etaP90}h</Text> (90%)
                    </Text>
                  </HStack>

                  {/* Action Button */}
                  {onSelectSupplier && (
                    <Button
                      variant="solid"
                      colorScheme="brand"
                      size="sm"
                      onClick={() => onSelectSupplier(rec.supplier.id)}
                    >
                      Pilih Supplier Ini
                    </Button>
                  )}
                </VStack>
              </CardBody>
            </Card>
          );
        })}
      </VStack>
    </VStack>
  );
}

