import { VStack, HStack, Text, Box, SimpleGrid } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { FormInput } from '../forms/FormInput';
import { Checkbox } from '../forms/Checkbox';
import { Button } from '../button/Button';
import { useColorModeValue } from '../ui/color-mode';
import { getSamplingRecommendation } from '../../utils/qc/sampling';
import { getQCSpec } from '../../data/mockQCSpecs';
import type { QCSpec } from '../../data/mockQCSpecs';
import { calculatePenalty, type QCRecord, PenaltyCalculator } from './PenaltyCalculator';
import { FiUpload, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export interface QCFormData extends QCRecord {
  itemType: 'bibit' | 'pakan' | 'obat' | 'logistik';
  orderId: string;
  orderValue: number;
  photos?: File[];
}

export interface QCFormProps {
  data: QCFormData;
  onChange: (data: Partial<QCFormData>) => void;
  onSubmit: (result: { pass: boolean; penalty?: number }) => void;
}

/**
 * QC Form Component
 * - Sampling calculator
 * - Item-specific checks
 * - Penalty calculation
 * - Photo upload (mock)
 */
export function QCForm({ data, onChange, onSubmit }: QCFormProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const spec = getQCSpec(data.itemType);
  const sampling = getSamplingRecommendation(data.itemType, data.totalQuantity);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleSubmit = () => {
    const penaltyResult = calculatePenalty(data, spec, data.orderValue);
    const pass = !penaltyResult.hasPenalty;
    onSubmit({
      pass,
      penalty: penaltyResult.penaltyAmount,
    });
  };

  const canSubmit = (): boolean => {
    if (data.itemType === 'bibit') {
      return data.mortality !== undefined && data.averageSize !== undefined && data.expectedSize !== undefined;
    } else if (data.itemType === 'pakan' || data.itemType === 'logistik') {
      return data.weightActual !== undefined && data.weightExpected !== undefined;
    }
    return true;
  };

  return (
    <VStack align="stretch" gap={6}>
      {/* Sampling Info */}
      <Card variant="elevated">
        <CardHeader>
          <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
            Sampling QC
          </Text>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <Box>
              <Text fontSize="xs" color={textSecondary} mb={1}>
                Total Quantity
              </Text>
              <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                {data.totalQuantity.toLocaleString('id-ID')} {data.itemType === 'bibit' ? 'ekor' : 'unit'}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color={textSecondary} mb={1}>
                Sample Size
              </Text>
              <Text fontSize="sm" fontWeight="semibold" color="brand.600">
                {sampling.sampleSize} {data.itemType === 'bibit' ? 'ekor' : 'unit'} ({sampling.percentage.toFixed(2)}%)
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color={textSecondary} mb={1}>
                Status
              </Text>
              <Text fontSize="sm" fontWeight="semibold" color={sampling.recommended ? 'green.600' : 'orange.600'}>
                {sampling.recommended ? '✓ Sesuai rekomendasi' : '⚠ Perlu penyesuaian'}
              </Text>
            </Box>
          </SimpleGrid>
          <Box fontSize="xs" color={textSecondary} mt={3}>
            💡 Sampling otomatis dihitung berdasarkan standar QC: {sampling.percentage.toFixed(2)}% dari total quantity (minimum {sampling.minSampleSize}).
          </Box>
        </CardBody>
      </Card>

      {/* QC Checks based on item type */}
      <Card variant="elevated">
        <CardHeader>
          <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
            Pengecekan Kualitas
          </Text>
        </CardHeader>
        <CardBody>
          <VStack align="stretch" gap={4}>
            {/* Bibit checks */}
            {data.itemType === 'bibit' && (
              <>
                <FormInput
                  label="Ukuran Rata-rata (gram atau cm)"
                  type="number"
                  min="0"
                  step="0.1"
                  value={data.averageSize || ''}
                  onChange={(e) => onChange({ averageSize: parseFloat(e.target.value) || undefined })}
                  placeholder="Contoh: 120"
                  required
                  helperText={`Ekspektasi: ${data.expectedSize || 'N/A'} (±${spec.criteria.sizeTolerance}%)`}
                />
                <FormInput
                  label="Ukuran Ekspektasi (gram atau cm)"
                  type="number"
                  min="0"
                  step="0.1"
                  value={data.expectedSize || ''}
                  onChange={(e) => onChange({ expectedSize: parseFloat(e.target.value) || undefined })}
                  placeholder="Contoh: 120"
                  required
                />
                <FormInput
                  label="Jumlah Mortalitas dalam Sample"
                  type="number"
                  min="0"
                  max={sampling.sampleSize}
                  value={data.mortality || ''}
                  onChange={(e) => onChange({ mortality: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  required
                  helperText={`Maksimal mortalitas: ${Math.ceil(sampling.sampleSize * (spec.criteria.mortalityMax || 0) / 100)} ekor (${spec.criteria.mortalityMax}%)`}
                />
              </>
            )}

            {/* Pakan checks */}
            {data.itemType === 'pakan' && (
              <>
                <FormInput
                  label="Berat Aktual (kg)"
                  type="number"
                  min="0"
                  step="0.1"
                  value={data.weightActual || ''}
                  onChange={(e) => onChange({ weightActual: parseFloat(e.target.value) || undefined })}
                  placeholder="Contoh: 24.5"
                  required
                  helperText={`Ekspektasi: ${data.weightExpected || 'N/A'} kg (±${spec.criteria.weightTolerance}%)`}
                />
                <FormInput
                  label="Berat Ekspektasi per Unit (kg)"
                  type="number"
                  min="0"
                  step="0.1"
                  value={data.weightExpected || ''}
                  onChange={(e) => onChange({ weightExpected: parseFloat(e.target.value) || undefined })}
                  placeholder="Contoh: 25"
                  required
                />
                <Checkbox
                  checked={data.hasExpiryIssue || false}
                  onChange={(e) => onChange({ hasExpiryIssue: e.target.checked })}
                >
                  <Text fontSize="sm" color={textPrimary}>
                    Terdapat item yang sudah/akan expire
                  </Text>
                </Checkbox>
                <Checkbox
                  checked={data.hasPackagingIssue || false}
                  onChange={(e) => onChange({ hasPackagingIssue: e.target.checked })}
                >
                  <Text fontSize="sm" color={textPrimary}>
                    Kemasan rusak atau tidak sesuai standar
                  </Text>
                </Checkbox>
              </>
            )}

            {/* Logistik checks */}
            {data.itemType === 'logistik' && (
              <>
                <FormInput
                  label="Berat/Kondisi Aktual"
                  type="text"
                  value={data.weightActual?.toString() || ''}
                  onChange={(e) => onChange({ weightActual: parseFloat(e.target.value) || undefined })}
                  placeholder="Deskripsi kondisi"
                  required
                />
                <Checkbox
                  checked={data.hasPackagingIssue || false}
                  onChange={(e) => onChange({ hasPackagingIssue: e.target.checked })}
                >
                  <Text fontSize="sm" color={textPrimary}>
                    Kondisi fisik tidak sesuai atau rusak
                  </Text>
                </Checkbox>
              </>
            )}

            {/* Photo Upload (Mock) */}
            <Box>
              <Text fontSize="sm" fontWeight="medium" color={textPrimary} mb={2}>
                Upload Bukti Foto/Video (Opsional)
              </Text>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FiUpload />}
                onClick={() => {
                  // Mock file upload
                  alert('Fitur upload foto akan tersedia setelah backend integration');
                }}
              >
                Pilih File
              </Button>
              <Text fontSize="xs" color={textSecondary} mt={2}>
                Rekomendasi: Foto sample yang dicek, mortalitas (jika ada), kemasan, label exp (untuk pakan/obat)
              </Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Penalty Calculator */}
      {canSubmit() && (
        <PenaltyCalculator
          qcRecord={data}
          spec={spec}
          orderValue={data.orderValue}
        />
      )}

      {/* Submit Button */}
      <HStack justify="flex-end">
        <Button
          variant="solid"
          colorScheme={canSubmit() ? 'brand' : 'gray'}
          onClick={handleSubmit}
          disabled={!canSubmit()}
          leftIcon={canSubmit() ? <FiCheckCircle /> : <FiXCircle />}
        >
          {canSubmit() ? 'Submit QC Hasil' : 'Lengkapi Form Terlebih Dahulu'}
        </Button>
      </HStack>
    </VStack>
  );
}

