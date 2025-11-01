import { VStack, HStack, Text, Box, SimpleGrid } from '@chakra-ui/react';
import { Slider } from '../forms/Slider';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { useState, useMemo } from 'react';
import { calculateROICoach, type ROICoachResult } from '../../utils/ai/roiCoach';
import { ROIParameters } from '../../utils/onboarding/roiCalculator';
import { FiTrendingUp, FiInfo } from 'react-icons/fi';

export interface ROICoachProps {
  baseParams: ROIParameters;
  onParamsChange?: (params: ROIParameters) => void;
}

/**
 * ROI Coach Widget
 * - 3 skenario (conservative/moderate/aggressive)
 * - Interactive sliders untuk parameter adjustment
 * - Sensitivity analysis
 * - Natural language summary
 */
export function ROICoach({ baseParams, onParamsChange }: ROICoachProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [adjustedParams, setAdjustedParams] = useState<ROIParameters>(baseParams);

  const coachResult = useMemo(() => {
    return calculateROICoach(adjustedParams);
  }, [adjustedParams]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleSliderChange = (param: keyof ROIParameters, value: number) => {
    const newParams = { ...adjustedParams, [param]: value };
    setAdjustedParams(newParams);
    onParamsChange?.(newParams);
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <HStack gap={2}>
          <Box fontSize="lg" color="brand.600">
            <FiTrendingUp />
          </Box>
          <VStack align="start" gap={0} flex={1}>
            <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
              ROI Coach
            </Text>
            <Text fontSize="xs" color={textSecondary}>
              Analisis finansial dengan 3 skenario dan sensitivitas
            </Text>
          </VStack>
        </HStack>
      </CardHeader>

      <CardBody>
        <VStack align="stretch" gap={6}>
          {/* Summary */}
          <Box
            p={3}
            borderRadius="md"
            bg={useColorModeValue('brand.50', 'brand.900')}
            border="1px solid"
            borderColor={useColorModeValue('brand.200', 'brand.700')}
          >
            <HStack gap={2} mb={2}>
              <FiInfo size={14} color={useColorModeValue('#25521a', '#8fb887')} />
              <Text fontSize="xs" fontWeight="semibold" color="brand.700">
                Ringkasan Analisis
              </Text>
            </HStack>
            <Text fontSize="xs" color={textPrimary} lineHeight="tall">
              {coachResult.summary}
            </Text>
          </Box>

          {/* 3 Scenarios */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textPrimary} mb={3}>
              Tiga Skenario Finansial
            </Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              {/* Conservative */}
              <Box
                p={3}
                borderRadius="md"
                border="1px solid"
                borderColor={useColorModeValue('red.200', 'red.700')}
                bg={useColorModeValue('red.50', 'red.900')}
              >
                <Text fontSize="xs" fontWeight="semibold" color="red.700" mb={2}>
                  Konservatif
                </Text>
                <VStack align="start" gap={1}>
                  <Text fontSize="xs" color={textSecondary}>
                    ROI: <Text as="span" fontWeight="bold" fontSize="sm">{coachResult.scenarios.conservative.roi.toFixed(1)}%</Text>
                  </Text>
                  <Text fontSize="xs" color={textSecondary}>
                    Laba: {formatCurrency(coachResult.scenarios.conservative.profit)}
                  </Text>
                  <Text fontSize="xs" color={textSecondary}>
                    BEP: {formatCurrency(coachResult.scenarios.conservative.bepPerKg)}/kg
                  </Text>
                </VStack>
              </Box>

              {/* Moderate */}
              <Box
                p={3}
                borderRadius="md"
                border="1px solid"
                borderColor={useColorModeValue('brand.300', 'brand.700')}
                bg={useColorModeValue('brand.50', 'brand.900')}
              >
                <Text fontSize="xs" fontWeight="semibold" color="brand.700" mb={2}>
                  Moderat
                </Text>
                <VStack align="start" gap={1}>
                  <Text fontSize="xs" color={textSecondary}>
                    ROI: <Text as="span" fontWeight="bold" fontSize="sm">{coachResult.scenarios.moderate.roi.toFixed(1)}%</Text>
                  </Text>
                  <Text fontSize="xs" color={textSecondary}>
                    Laba: {formatCurrency(coachResult.scenarios.moderate.profit)}
                  </Text>
                  <Text fontSize="xs" color={textSecondary}>
                    BEP: {formatCurrency(coachResult.scenarios.moderate.bepPerKg)}/kg
                  </Text>
                </VStack>
              </Box>

              {/* Aggressive */}
              <Box
                p={3}
                borderRadius="md"
                border="1px solid"
                borderColor={useColorModeValue('green.300', 'green.700')}
                bg={useColorModeValue('green.50', 'green.900')}
              >
                <Text fontSize="xs" fontWeight="semibold" color="green.700" mb={2}>
                  Agresif
                </Text>
                <VStack align="start" gap={1}>
                  <Text fontSize="xs" color={textSecondary}>
                    ROI: <Text as="span" fontWeight="bold" fontSize="sm">{coachResult.scenarios.aggressive.roi.toFixed(1)}%</Text>
                  </Text>
                  <Text fontSize="xs" color={textSecondary}>
                    Laba: {formatCurrency(coachResult.scenarios.aggressive.profit)}
                  </Text>
                  <Text fontSize="xs" color={textSecondary}>
                    BEP: {formatCurrency(coachResult.scenarios.aggressive.bepPerKg)}/kg
                  </Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Sensitivity Sliders */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textPrimary} mb={3}>
              Analisis Sensitivitas (±10%)
            </Text>
            <VStack align="stretch" gap={4}>
              {/* SR Slider */}
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="xs" color={textSecondary}>
                    SR (Survival Rate): {(adjustedParams.sr * 100).toFixed(0)}%
                  </Text>
                  <Text fontSize="xs" color={textSecondary}>
                    ΔROI: {coachResult.sensitivities.find((s) => s.parameter === 'SR (Survival Rate)')?.deltaROI.toFixed(1)}%
                  </Text>
                </HStack>
                <Slider
                  value={adjustedParams.sr}
                  min={0.5}
                  max={1.0}
                  step={0.01}
                  onChange={(e) => handleSliderChange('sr', parseFloat(e.target.value))}
                  colorScheme="brand"
                />
              </Box>

              {/* FCR Slider */}
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="xs" color={textSecondary}>
                    FCR: {adjustedParams.fcr.toFixed(2)}
                  </Text>
                  <Text fontSize="xs" color={textSecondary}>
                    ΔROI: {coachResult.sensitivities.find((s) => s.parameter === 'FCR (Feed Conversion Ratio)')?.deltaROI.toFixed(1)}%
                  </Text>
                </HStack>
                <Slider
                  value={adjustedParams.fcr}
                  min={0.8}
                  max={2.0}
                  step={0.1}
                  onChange={(e) => handleSliderChange('fcr', parseFloat(e.target.value))}
                  colorScheme="brand"
                />
              </Box>

              {/* Feed Price Slider */}
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="xs" color={textSecondary}>
                    Harga Pakan: {formatCurrency(adjustedParams.feedPricePerKg)}/kg
                  </Text>
                  <Text fontSize="xs" color={textSecondary}>
                    ΔROI: {coachResult.sensitivities.find((s) => s.parameter === 'Harga Pakan')?.deltaROI.toFixed(1)}%
                  </Text>
                </HStack>
                <Slider
                  value={adjustedParams.feedPricePerKg}
                  min={8000}
                  max={15000}
                  step={100}
                  onChange={(e) => handleSliderChange('feedPricePerKg', parseFloat(e.target.value))}
                  colorScheme="brand"
                />
              </Box>

              {/* Selling Price Slider */}
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="xs" color={textSecondary}>
                    Harga Jual: {formatCurrency(adjustedParams.sellingPricePerKg)}/kg
                  </Text>
                  <Text fontSize="xs" color={textSecondary}>
                    ΔROI: {coachResult.sensitivities.find((s) => s.parameter === 'Harga Jual')?.deltaROI.toFixed(1)}%
                  </Text>
                </HStack>
                <Slider
                  value={adjustedParams.sellingPricePerKg}
                  min={20000}
                  max={40000}
                  step={500}
                  onChange={(e) => handleSliderChange('sellingPricePerKg', parseFloat(e.target.value))}
                  colorScheme="brand"
                />
              </Box>
            </VStack>
          </Box>

          {/* Main Drivers */}
          {coachResult.mainDrivers.length > 0 && (
            <Box
              p={3}
              borderRadius="md"
              border="1px solid"
              borderColor={borderColor}
              bg={useColorModeValue('gray.50', 'gray.800')}
            >
              <Text fontSize="xs" fontWeight="semibold" color={textPrimary} mb={2}>
                Faktor Paling Berpengaruh (Top 3):
              </Text>
              <VStack align="start" gap={1}>
                {coachResult.mainDrivers.map((driver, idx) => (
                  <HStack key={idx} gap={2}>
                    <Text fontSize="xs" color="brand.600">#{idx + 1}</Text>
                    <Text fontSize="xs" color={textPrimary}>{driver}</Text>
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

