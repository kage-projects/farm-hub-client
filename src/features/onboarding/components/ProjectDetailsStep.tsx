import { VStack, Box, HStack, Text } from '@chakra-ui/react';
import { Slider } from '../../../components/forms/Slider';
import { Select } from '../../../components/forms/Select';
import { Field } from '@chakra-ui/react';
import { WizardStep } from '../../../components/onboarding/WizardStep';

export interface ProjectDetailsFormData {
  jenis_ikan: '' | 'NILA' | 'LELE' | 'GURAME';
  modal: number;
}

export interface ProjectDetailsStepProps {
  data: ProjectDetailsFormData;
  onChange: (data: Partial<ProjectDetailsFormData>) => void;
  errors?: Record<string, string>;
}

const jenisIkanOptions = [
  { value: 'NILA', label: 'Nila' },
  { value: 'LELE', label: 'Lele' },
  { value: 'GURAME', label: 'Gurame' },
];

const MODAL_MIN = 10_000_000; // 10 juta
const MODAL_MAX = 1_000_000_000; // 1 miliar
const MODAL_STEP = 1_000_000; // 1 juta

/**
 * Project Details Step - Input jenis ikan, modal, and risk level
 */
export function ProjectDetailsStep({ data, onChange, errors }: ProjectDetailsStepProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Ensure modal is within valid range
  const modalValue = Math.max(MODAL_MIN, Math.min(MODAL_MAX, data.modal || MODAL_MIN));

  return (
    <WizardStep
      title="Detail Proyek"
      description="Masukkan jenis ikan dan modal yang tersedia"
    >
      <VStack gap={4} align="stretch">
        <Field.Root>
          <Field.Label>Jenis Ikan *</Field.Label>
          <Select
            value={data.jenis_ikan}
            onChange={(e) => onChange({ jenis_ikan: e.target.value as any })}
            items={jenisIkanOptions}
            invalid={!!errors?.jenis_ikan}
          />
          {errors?.jenis_ikan && <Box fontSize="xs" color="red.500" mt={1}>{errors.jenis_ikan}</Box>}
        </Field.Root>

        <Field.Root>
          <Field.Label>Modal (Rp) *</Field.Label>
          <Box>
            <HStack justify="space-between" mb={3}>
              <Text fontSize="sm" fontWeight="semibold">
                {formatCurrency(modalValue)}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Min: {formatCurrency(MODAL_MIN)} | Max: {formatCurrency(MODAL_MAX)}
              </Text>
            </HStack>
            <Slider
              value={modalValue}
              min={MODAL_MIN}
              max={MODAL_MAX}
              step={MODAL_STEP}
              onChange={(e) => onChange({ modal: parseFloat(e.target.value) })}
              colorScheme="brand"
            />
            <Text fontSize="xs" color="gray.500" mt={2}>
              Total modal yang tersedia untuk investasi
            </Text>
            {errors?.modal && <Box fontSize="xs" color="red.500" mt={2}>{errors.modal}</Box>}
          </Box>
        </Field.Root>
      </VStack>
    </WizardStep>
  );
}

