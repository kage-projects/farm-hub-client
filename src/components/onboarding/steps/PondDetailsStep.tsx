import { VStack, Alert, Box } from '@chakra-ui/react';
import { FormInput } from '../../forms/FormInput';
import { Select } from '../../forms/Select';
import { WizardStep } from '../WizardStep';
import { useColorModeValue } from '../../ui/color-mode';
import { validatePondInput, type PondInput as ValidationInput } from '../../../utils/onboarding/validation';
import { useState, useEffect } from 'react';

export interface PondDetailsData {
  pondType: 'terpal' | 'beton' | '';
  length: number;
  width: number;
  depth: number;
  stockingDensity: number;
  species: string;
}

export interface PondDetailsStepProps {
  data: PondDetailsData;
  onChange: (data: Partial<PondDetailsData>) => void;
  errors?: Record<string, string>;
  onValidationChange?: (result: { isValid: boolean; warnings: string[]; errors: string[] }) => void;
}

const pondTypes = [
  { value: 'terpal', label: 'Terpal' },
  { value: 'beton', label: 'Beton' },
];

const species = [
  { value: 'lele', label: 'Lele' },
  { value: 'nila', label: 'Nila' },
  { value: 'patin', label: 'Patin' },
  { value: 'gurame', label: 'Gurame' },
  { value: 'mas', label: 'Mas' },
];

/**
 * Pond Details Step - Input tipe kolam, ukuran, padat tebar
 */
export function PondDetailsStep({ data, onChange, errors, onValidationChange }: PondDetailsStepProps) {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; warnings: string[]; errors: string[] } | null>(null);

  useEffect(() => {
    if (data.pondType && data.length > 0 && data.width > 0 && data.depth > 0 && data.species) {
      const validationInput: ValidationInput = {
        pondType: data.pondType as 'terpal' | 'beton',
        length: data.length,
        width: data.width,
        depth: data.depth,
        stockingDensity: data.stockingDensity,
        species: data.species,
      };
      const result = validatePondInput(validationInput);
      setValidationResult(result);
      onValidationChange?.(result);
    }
  }, [data, onValidationChange]);

  return (
    <WizardStep
      title="Detail Kolam"
      description="Tentukan jenis kolam, ukuran, dan padat tebar ikan"
    >
      <VStack gap={4} align="stretch">
        <Select
          label="Tipe Kolam"
          value={data.pondType}
          onChange={(e) => onChange({ pondType: e.target.value as any })}
          required
          items={pondTypes}
          invalid={!!errors?.pondType}
        />
        {errors?.pondType && <Box fontSize="xs" color="red.500">{errors.pondType}</Box>}

        <VStack gap={2} align="stretch">
          <Box fontSize="sm" fontWeight="medium" color={textSecondary}>
            Ukuran Kolam (meter)
          </Box>
          <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
            <FormInput
              label="Panjang"
              type="number"
              min="1"
              step="0.1"
              value={data.length || ''}
              onChange={(e) => onChange({ length: parseFloat(e.target.value) || 0 })}
              placeholder="m"
              required
              invalid={!!errors?.length}
              error={errors?.length}
            />
            <FormInput
              label="Lebar"
              type="number"
              min="1"
              step="0.1"
              value={data.width || ''}
              onChange={(e) => onChange({ width: parseFloat(e.target.value) || 0 })}
              placeholder="m"
              required
              invalid={!!errors?.width}
              error={errors?.width}
            />
            <FormInput
              label="Kedalaman"
              type="number"
              min="0.5"
              max="3"
              step="0.1"
              value={data.depth || ''}
              onChange={(e) => onChange({ depth: parseFloat(e.target.value) || 0 })}
              placeholder="m"
              required
              invalid={!!errors?.depth}
              error={errors?.depth}
            />
          </Box>
        </VStack>

        <Select
          label="Jenis Ikan"
          value={data.species}
          onChange={(e) => onChange({ species: e.target.value })}
          required
          items={species}
          invalid={!!errors?.species}
        />
        {errors?.species && <Box fontSize="xs" color="red.500">{errors.species}</Box>}

        <FormInput
          label="Padat Tebar (ekor per m²)"
          type="number"
          min="1"
          step="1"
          value={data.stockingDensity || ''}
          onChange={(e) => onChange({ stockingDensity: parseFloat(e.target.value) || 0 })}
          placeholder="Contoh: 50"
          required
          invalid={!!errors?.stockingDensity || !!validationResult?.errors.length}
          error={errors?.stockingDensity || validationResult?.errors[0]}
          helperText={data.species && data.pondType ? `Rekomendasi untuk ${data.species}: 20-100 ekor/m²` : undefined}
        />

        {validationResult && (
          <>
            {validationResult.errors.length > 0 && (
              <Alert status="error" variant="subtle">
                <VStack align="start" gap={1}>
                  {validationResult.errors.map((error, idx) => (
                    <Box key={idx} fontSize="sm">{error}</Box>
                  ))}
                </VStack>
              </Alert>
            )}
            {validationResult.warnings.length > 0 && validationResult.errors.length === 0 && (
              <Alert status="warning" variant="subtle">
                <VStack align="start" gap={1}>
                  {validationResult.warnings.map((warning, idx) => (
                    <Box key={idx} fontSize="sm">{warning}</Box>
                  ))}
                </VStack>
              </Alert>
            )}
          </>
        )}

        <Box fontSize="xs" color={textSecondary} mt={-2}>
          💡 Padat tebar yang terlalu tinggi dapat menyebabkan stres, penyakit, dan kematian. Ikuti rekomendasi berdasarkan jenis ikan.
        </Box>
      </VStack>
    </WizardStep>
  );
}

