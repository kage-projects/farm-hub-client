import { VStack, HStack, Text, Box, SimpleGrid, Badge } from '@chakra-ui/react';
import { WizardStep } from '../WizardStep';
import { Card, CardBody, CardHeader } from '../../surfaces/Card';
import { useColorModeValue } from '../../ui/color-mode';
import { calculateSurfaceArea, calculateVolume } from '../../../utils/onboarding/validation';

export interface ReviewData {
  location: {
    city: string;
    address: string;
    waterSource: string;
  };
  pond: {
    pondType: string;
    length: number;
    width: number;
    depth: number;
    stockingDensity: number;
    species: string;
  };
  target: {
    targetHarvestWeight: number;
    targetHarvestDate: string;
    budget: number;
  };
}

export interface ROSPreview {
  totalFeedRequired: number;
  estimatedTimeToProperSize: number;
  estimatedHarvestDate: Date;
}

export interface ROIPreview {
  conservative: { roi: number; profit: number; bepPerKg: number };
  moderate: { roi: number; profit: number; bepPerKg: number };
  aggressive: { roi: number; profit: number; bepPerKg: number };
}

export interface ReviewStepProps {
  data: ReviewData;
  rosPreview?: ROSPreview;
  roiPreview?: ROIPreview;
  onGenerate: () => void;
  isValid: boolean;
}

/**
 * Review Step - Review semua input dan preview ROS/ROI
 */
export function ReviewStep({ data, rosPreview, roiPreview, onGenerate, isValid }: ReviewStepProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const surfaceArea = calculateSurfaceArea({ length: data.pond.length, width: data.pond.width });
  const volume = calculateVolume({ length: data.pond.length, width: data.pond.width, depth: data.pond.depth });
  const totalFish = surfaceArea * data.pond.stockingDensity;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <WizardStep
      title="Review & Konfirmasi"
      description="Tinjau semua informasi sebelum membuat rencana operasional"
    >
      <VStack gap={6} align="stretch">
        {/* Location Summary */}
        <Card variant="elevated">
          <CardHeader>
            <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
              Lokasi & Sumber Air
            </Text>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" gap={2}>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Kota</Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>{data.location.city}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Alamat</Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>{data.location.address}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Sumber Air</Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>{data.location.waterSource}</Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Pond Summary */}
        <Card variant="elevated">
          <CardHeader>
            <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
              Detail Kolam
            </Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Tipe Kolam</Text>
                <Badge colorScheme="brand">{data.pond.pondType}</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Ukuran</Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                  {data.pond.length}m × {data.pond.width}m × {data.pond.depth}m
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Luas Permukaan</Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>{surfaceArea.toFixed(2)} m²</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Volume</Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>{volume.toFixed(2)} m³</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Jenis Ikan</Text>
                <Badge colorScheme="secondary">{data.pond.species}</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Padat Tebar</Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>{data.pond.stockingDensity} ekor/m²</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Total Ikan</Text>
                <Text fontSize="sm" fontWeight="bold" color="brand.600">{Math.floor(totalFish)} ekor</Text>
              </HStack>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Target Summary */}
        <Card variant="elevated">
          <CardHeader>
            <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
              Target Panen & Budget
            </Text>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" gap={2}>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Target Berat</Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>{data.target.targetHarvestWeight}g/ekor</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Tanggal Target</Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                  {new Date(data.target.targetHarvestDate).toLocaleDateString('id-ID')}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Budget</Text>
                <Text fontSize="sm" fontWeight="bold" color="brand.600">{formatCurrency(data.target.budget)}</Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* ROS Preview */}
        {rosPreview && (
          <Card variant="elevated">
            <CardHeader>
              <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                Preview Rencana Operasional (ROS)
              </Text>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" gap={2}>
                <HStack justify="space-between">
                  <Text fontSize="sm" color={textSecondary}>Total Pakan Diperlukan</Text>
                  <Text fontSize="sm" fontWeight="bold" color="brand.600">{rosPreview.totalFeedRequired.toFixed(2)} kg</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color={textSecondary}>Estimasi Waktu ke Ukuran Target</Text>
                  <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                    {Math.floor(rosPreview.estimatedTimeToProperSize / 7)} minggu
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color={textSecondary}>Estimasi Tanggal Panen</Text>
                  <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                    {rosPreview.estimatedHarvestDate.toLocaleDateString('id-ID')}
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* ROI Preview */}
        {roiPreview && (
          <Card variant="elevated">
            <CardHeader>
              <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                Preview Analisis Finansial (3 Skenario)
              </Text>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                <Box p={3} borderRadius="md" border="1px solid" borderColor="gray.200" bg="red.50">
                  <Text fontSize="xs" fontWeight="semibold" color="red.700" mb={2}>Konservatif</Text>
                  <Text fontSize="xs" color="gray.600">ROI: <Text as="span" fontWeight="bold">{roiPreview.conservative.roi.toFixed(1)}%</Text></Text>
                  <Text fontSize="xs" color="gray.600">Laba: {formatCurrency(roiPreview.conservative.profit)}</Text>
                  <Text fontSize="xs" color="gray.600">BEP: {formatCurrency(roiPreview.conservative.bepPerKg)}/kg</Text>
                </Box>
                <Box p={3} borderRadius="md" border="1px solid" borderColor="brand.300" bg="brand.50">
                  <Text fontSize="xs" fontWeight="semibold" color="brand.700" mb={2}>Moderat</Text>
                  <Text fontSize="xs" color="gray.600">ROI: <Text as="span" fontWeight="bold">{roiPreview.moderate.roi.toFixed(1)}%</Text></Text>
                  <Text fontSize="xs" color="gray.600">Laba: {formatCurrency(roiPreview.moderate.profit)}</Text>
                  <Text fontSize="xs" color="gray.600">BEP: {formatCurrency(roiPreview.moderate.bepPerKg)}/kg</Text>
                </Box>
                <Box p={3} borderRadius="md" border="1px solid" borderColor="green.300" bg="green.50">
                  <Text fontSize="xs" fontWeight="semibold" color="green.700" mb={2}>Agresif</Text>
                  <Text fontSize="xs" color="gray.600">ROI: <Text as="span" fontWeight="bold">{roiPreview.aggressive.roi.toFixed(1)}%</Text></Text>
                  <Text fontSize="xs" color="gray.600">Laba: {formatCurrency(roiPreview.aggressive.profit)}</Text>
                  <Text fontSize="xs" color="gray.600">BEP: {formatCurrency(roiPreview.aggressive.bepPerKg)}/kg</Text>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>
        )}

        {!isValid && (
          <Box p={3} borderRadius="md" bg="red.50" border="1px solid" borderColor="red.200">
            <Text fontSize="sm" color="red.700">
              ⚠️ Mohon perbaiki error di step sebelumnya sebelum melanjutkan.
            </Text>
          </Box>
        )}
      </VStack>
    </WizardStep>
  );
}


