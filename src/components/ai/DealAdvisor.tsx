import { VStack, HStack, Text, Box, Badge } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { recommendPriceModel, type DealAdvisorInput } from '../../utils/ai/dealAdvisor';
import { FiZap, FiInfo } from 'react-icons/fi';

export interface DealAdvisorProps {
  item: string;
  horizonWeeks: number;
  volatility30d?: number;
  volume?: number;
  riskAppetite?: 'low' | 'medium' | 'high';
  priceModel?: 'spot' | 'fixed' | 'indexed'; // Current/selected model (optional)
}

/**
 * AI Deal Advisor Component
 * - Recommend price model (Spot/Fixed/Indexed)
 * - Explainability dengan alasan
 * - Show alternatives
 */
export function DealAdvisor({
  item,
  horizonWeeks,
  volatility30d = 0.1,
  volume = 100,
  riskAppetite = 'medium',
  priceModel,
}: DealAdvisorProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const input: DealAdvisorInput = {
    item,
    horizonWeeks,
    volatility30d,
    volume,
    riskAppetite,
  };

  const recommendation = recommendPriceModel(input);

  const modelLabels = {
    spot: 'Spot',
    fixed: 'Fixed Short-Term',
    indexed: 'Indexed',
  };

  const modelColors = {
    spot: 'accent',
    fixed: 'brand',
    indexed: 'secondary',
  } as const;

  const isRecommended = !priceModel || priceModel === recommendation.recommendation;

  return (
    <Card variant="elevated">
      <CardHeader>
        <HStack gap={2}>
          <Box fontSize="lg" color="accent.600">
            <FiZap />
          </Box>
          <VStack align="start" gap={0} flex={1}>
            <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
              Deal Advisor
            </Text>
            <Text fontSize="xs" color={textSecondary}>
              Rekomendasi model harga berdasarkan analisis pasar
            </Text>
          </VStack>
        </HStack>
      </CardHeader>

      <CardBody>
        <VStack align="stretch" gap={4}>
          {/* Recommendation */}
          <Box
            p={3}
            borderRadius="md"
            bg={useColorModeValue(`${modelColors[recommendation.recommendation]}.50`, `${modelColors[recommendation.recommendation]}.900`)}
            border="2px solid"
            borderColor={useColorModeValue(`${modelColors[recommendation.recommendation]}.300`, `${modelColors[recommendation.recommendation]}.700`)}
          >
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                Rekomendasi:
              </Text>
              <Badge colorScheme={modelColors[recommendation.recommendation]} variant="solid">
                {modelLabels[recommendation.recommendation]}
              </Badge>
            </HStack>
            <Text fontSize="xs" color={textSecondary} mb={2}>
              Confidence: {(recommendation.confidence * 100).toFixed(0)}%
            </Text>
            {isRecommended && (
              <HStack gap={1} color="green.600">
                <FiInfo size={12} />
                <Text fontSize="xs">Model ini cocok untuk kondisi Anda</Text>
              </HStack>
            )}
          </Box>

          {/* Reasons */}
          <Box>
            <Text fontSize="xs" fontWeight="semibold" color={textPrimary} mb={2}>
              Mengapa:
            </Text>
            <VStack align="start" gap={1}>
              {recommendation.reasons.map((reason, idx) => (
                <HStack key={idx} gap={2} align="start">
                  <Text fontSize="xs" color="brand.600">•</Text>
                  <Text fontSize="xs" color={textPrimary} flex={1}>{reason}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>

          {/* Alternatives */}
          {recommendation.alternatives && recommendation.alternatives.length > 0 && (
            <Box
              p={3}
              borderRadius="md"
              border="1px solid"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              bg={useColorModeValue('gray.50', 'gray.800')}
            >
              <Text fontSize="xs" fontWeight="semibold" color={textSecondary} mb={2}>
                Alternatif yang bisa dipertimbangkan:
              </Text>
              <VStack align="start" gap={2}>
                {recommendation.alternatives.map((alt, idx) => (
                  <HStack key={idx} gap={2}>
                    <Badge colorScheme={modelColors[alt.model]} variant="outline" fontSize="xs">
                      {modelLabels[alt.model]}
                    </Badge>
                    <Text fontSize="xs" color={textSecondary}>{alt.reason}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}

