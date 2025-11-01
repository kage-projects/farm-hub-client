import { VStack, HStack, Text, Box, Alert, SimpleGrid } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { FormInput } from '../forms/FormInput';
import { Select } from '../forms/Select';
import { useColorModeValue } from '../ui/color-mode';
import { calculateETP, getHarvestWindow, type ETPInput, type ETPResult } from '../../utils/harvest/etpCalculator';
import { useState } from 'react';
import { Button } from '../button/Button';

export interface ETPCalculatorProps {
  onCalculate?: (result: ETPResult) => void;
  initialValues?: Partial<ETPInput>;
}

const speciesOptions = [
  { value: 'lele', label: 'Lele' },
  { value: 'nila', label: 'Nila' },
  { value: 'patin', label: 'Patin' },
  { value: 'gurame', label: 'Gurame' },
  { value: 'mas', label: 'Mas' },
];

const feedQualityOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
];

/**
 * ETP Calculator Component
 * - Input: species, starting weight, target weight, start date
 * - Output: estimated harvest date, confidence level
 */
export function ETPCalculator({ onCalculate, initialValues }: ETPCalculatorProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  
  const [input, setInput] = useState<ETPInput>({
    species: initialValues?.species || 'lele',
    startingWeight: initialValues?.startingWeight || 5,
    targetWeight: initialValues?.targetWeight || 120,
    startDate: initialValues?.startDate || new Date(),
    waterTemperature: initialValues?.waterTemperature,
    feedQuality: initialValues?.feedQuality || 'standard',
  });

  const [result, setResult] = useState<ETPResult | null>(null);

  const handleCalculate = () => {
    const etpResult = calculateETP(input);
    setResult(etpResult);
    onCalculate?.(etpResult);
  };

  const harvestWindow = result ? getHarvestWindow(result) : null;

  return (
    <Card variant="elevated">
      <CardHeader>
        <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
          ETP Calculator (Estimated Time to Proper Size)
        </Text>
      </CardHeader>
      <CardBody>
        <VStack align="stretch" gap={4}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Select
              label="Jenis Ikan"
              value={input.species}
              onChange={(e) => setInput((prev) => ({ ...prev, species: e.target.value }))}
              items={speciesOptions}
            />
            
            <FormInput
              label="Berat Awal (gram)"
              type="number"
              min="1"
              step="1"
              value={input.startingWeight}
              onChange={(e) => setInput((prev) => ({ ...prev, startingWeight: parseFloat(e.target.value) || 0 }))}
              placeholder="Contoh: 5"
              helperText="Berat benih saat tebar"
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormInput
              label="Target Berat Panen (gram)"
              type="number"
              min="1"
              step="10"
              value={input.targetWeight}
              onChange={(e) => setInput((prev) => ({ ...prev, targetWeight: parseFloat(e.target.value) || 0 }))}
              placeholder="Contoh: 120"
              helperText="Berat target saat panen"
            />
            
            <FormInput
              label="Tanggal Tebar"
              type="date"
              value={input.startDate.toISOString().split('T')[0]}
              onChange={(e) => setInput((prev) => ({ ...prev, startDate: new Date(e.target.value) }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormInput
              label="Suhu Air (°C) - Opsional"
              type="number"
              min="20"
              max="35"
              step="0.5"
              value={input.waterTemperature || ''}
              onChange={(e) => setInput((prev) => ({ ...prev, waterTemperature: parseFloat(e.target.value) || undefined }))}
              placeholder="Contoh: 28"
              helperText="Optimal: 28-30°C"
            />
            
            <Select
              label="Kualitas Pakan"
              value={input.feedQuality || 'standard'}
              onChange={(e) => setInput((prev) => ({ ...prev, feedQuality: e.target.value as 'standard' | 'premium' }))}
              items={feedQualityOptions}
            />
          </SimpleGrid>

          <Button
            variant="solid"
            colorScheme="brand"
            onClick={handleCalculate}
          >
            Hitung ETP
          </Button>

          {/* Results */}
          {result && (
            <Box
              p={4}
              borderRadius="md"
              bg={useColorModeValue('brand.50', 'brand.900')}
              border="1px solid"
              borderColor={useColorModeValue('brand.200', 'brand.700')}
            >
              <VStack align="stretch" gap={3}>
                <HStack justify="space-between">
                  <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                    Estimasi Waktu Panen
                  </Text>
                  <Text fontSize="xs" color={textSecondary}>
                    Confidence: {result.confidence === 'high' ? '✓ Tinggi' : result.confidence === 'medium' ? '○ Sedang' : '⚠ Rendah'}
                  </Text>
                </HStack>
                
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                  <Box>
                    <Text fontSize="xs" color={textSecondary} mb={1}>Optimal</Text>
                    <Text fontSize="sm" fontWeight="bold" color="brand.600">
                      {result.estimatedDate.toLocaleDateString('id-ID')}
                    </Text>
                  </Box>
                  {harvestWindow && (
                    <>
                      <Box>
                        <Text fontSize="xs" color={textSecondary} mb={1}>Terlalu Awal</Text>
                        <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                          {harvestWindow.earliest.toLocaleDateString('id-ID')}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color={textSecondary} mb={1}>Terlalu Lambat</Text>
                        <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                          {harvestWindow.latest.toLocaleDateString('id-ID')}
                        </Text>
                      </Box>
                    </>
                  )}
                </SimpleGrid>

                <Box>
                  <Text fontSize="xs" color={textSecondary} mb={1}>
                    Waktu Estimasi
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                    {result.estimatedWeeks} minggu ({result.estimatedDays} hari)
                  </Text>
                </Box>

                {result.notes.length > 0 && (
                  <Alert status="info" variant="subtle">
                    <VStack align="start" gap={1}>
                      {result.notes.map((note, idx) => (
                        <Text key={idx} fontSize="xs">{note}</Text>
                      ))}
                    </VStack>
                  </Alert>
                )}
              </VStack>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}

