import { VStack, HStack, Text, Box } from '@chakra-ui/react';
import { Card, CardBody } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import type { QCSpec } from '../../data/mockQCSpecs';

export interface QCRecord {
  sampleSize: number;
  averageSize?: number; // grams or cm
  expectedSize?: number; // grams or cm
  mortality?: number; // count
  totalQuantity: number;
  weightActual?: number; // kg
  weightExpected?: number; // kg
  hasExpiryIssue?: boolean;
  hasPackagingIssue?: boolean;
}

export interface PenaltyResult {
  hasPenalty: boolean;
  penaltyAmount: number;
  penaltyPercentage: number;
  reasons: string[];
}

/**
 * Calculate penalty based on QC record and spec
 */
export function calculatePenalty(qcRecord: QCRecord, spec: QCSpec, orderValue: number): PenaltyResult {
  const reasons: string[] = [];
  let totalPenaltyPercentage = 0;

  // Check mortality (for bibit)
  if (spec.itemType === 'bibit' && qcRecord.mortality !== undefined && spec.criteria.mortalityMax !== undefined) {
    const mortalityRate = (qcRecord.mortality / qcRecord.sampleSize) * 100;
    if (mortalityRate > spec.criteria.mortalityMax) {
      const excess = mortalityRate - spec.criteria.mortalityMax;
      const penalty = excess * spec.penalties.mortalityExcess;
      totalPenaltyPercentage += penalty;
      reasons.push(
        `Mortalitas ${mortalityRate.toFixed(1)}% melebihi batas ${spec.criteria.mortalityMax}% (+${excess.toFixed(1)}%)`
      );
    }
  }

  // Check size tolerance (for bibit)
  if (spec.itemType === 'bibit' && qcRecord.averageSize && qcRecord.expectedSize && spec.criteria.sizeTolerance) {
    const sizeDiff = Math.abs(qcRecord.averageSize - qcRecord.expectedSize);
    const tolerancePercent = (sizeDiff / qcRecord.expectedSize) * 100;
    if (tolerancePercent > spec.criteria.sizeTolerance) {
      const excess = tolerancePercent - spec.criteria.sizeTolerance;
      const penalty = excess * spec.penalties.sizeMismatch;
      totalPenaltyPercentage += penalty;
      reasons.push(
        `Ukuran rata-rata berbeda ${tolerancePercent.toFixed(1)}% dari ekspektasi (toleransi: ±${spec.criteria.sizeTolerance}%)`
      );
    }
  }

  // Check weight tolerance (for pakan, logistik)
  if (
    (spec.itemType === 'pakan' || spec.itemType === 'logistik') &&
    qcRecord.weightActual &&
    qcRecord.weightExpected &&
    spec.criteria.weightTolerance
  ) {
    const weightDiff = qcRecord.weightExpected - qcRecord.weightActual;
    const tolerancePercent = (weightDiff / qcRecord.weightExpected) * 100;
    if (tolerancePercent > spec.criteria.weightTolerance) {
      const excess = tolerancePercent - spec.criteria.weightTolerance;
      const penalty = excess * spec.penalties.weightShortage;
      totalPenaltyPercentage += penalty;
      reasons.push(
        `Berat kurang ${tolerancePercent.toFixed(1)}% dari ekspektasi (toleransi: ±${spec.criteria.weightTolerance}%)`
      );
    }
  }

  // Check expiry (for pakan, obat)
  if (spec.criteria.expiryCheck && qcRecord.hasExpiryIssue) {
    totalPenaltyPercentage += spec.penalties.weightShortage || 5;
    reasons.push('Terdapat item yang sudah/akan expire');
  }

  // Check packaging
  if (spec.criteria.packagingCheck && qcRecord.hasPackagingIssue) {
    totalPenaltyPercentage += 2; // 2% flat penalty
    reasons.push('Kondisi kemasan tidak sesuai standar');
  }

  // Cap penalty at 50% of order value
  const cappedPenaltyPercentage = Math.min(totalPenaltyPercentage, 50);
  const penaltyAmount = (orderValue * cappedPenaltyPercentage) / 100;

  return {
    hasPenalty: cappedPenaltyPercentage > 0,
    penaltyAmount,
    penaltyPercentage: cappedPenaltyPercentage,
    reasons,
  };
}

/**
 * Penalty Calculator Display Component
 */
export interface PenaltyCalculatorProps {
  qcRecord: QCRecord;
  spec: QCSpec;
  orderValue: number;
}

export function PenaltyCalculator({ qcRecord, spec, orderValue }: PenaltyCalculatorProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  
  const penaltyResult = calculatePenalty(qcRecord, spec, orderValue);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (!penaltyResult.hasPenalty) {
    return (
      <Card variant="elevated">
        <CardBody>
          <Box textAlign="center" py={4}>
            <Text fontSize="md" fontWeight="semibold" color="green.600">
              ✓ QC PASS - Tidak ada penalti
            </Text>
          </Box>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardBody>
        <VStack align="stretch" gap={4}>
          <Box
            p={3}
            borderRadius="md"
            bg={useColorModeValue('red.50', 'red.900')}
            border="1px solid"
            borderColor={useColorModeValue('red.200', 'red.700')}
          >
            <Text fontSize="sm" fontWeight="semibold" color="red.700" mb={2}>
              QC FAIL / PARTIAL - Penalti Diterapkan
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="red.600">
              Potongan: {formatCurrency(penaltyResult.penaltyAmount)} ({penaltyResult.penaltyPercentage.toFixed(1)}%)
            </Text>
          </Box>

          {/* Reasons */}
          {penaltyResult.reasons.length > 0 && (
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color={textPrimary} mb={2}>
                Alasan Penalti:
              </Text>
              <VStack align="start" gap={1}>
                {penaltyResult.reasons.map((reason, idx) => (
                  <HStack key={idx} gap={2} align="start">
                    <Text fontSize="xs" color="red.600">•</Text>
                    <Text fontSize="xs" color={textPrimary} flex={1}>{reason}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          )}

          {/* Adjusted Payment */}
          <Box
            p={2}
            borderRadius="md"
            border="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            bg={useColorModeValue('gray.50', 'gray.800')}
          >
            <HStack justify="space-between">
              <Text fontSize="xs" color={textSecondary}>Pembayaran setelah penalti:</Text>
              <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                {formatCurrency(orderValue - penaltyResult.penaltyAmount)}
              </Text>
            </HStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
}

