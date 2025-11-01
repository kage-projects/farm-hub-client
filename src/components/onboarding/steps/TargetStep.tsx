import { VStack, Box } from '@chakra-ui/react';
import { FormInput } from '../../forms/FormInput';
import { FormCurrencyInput } from '../../forms/FormCurrencyInput';
import { WizardStep } from '../WizardStep';
import { useColorModeValue } from '../../ui/color-mode';

export interface TargetData {
  targetHarvestWeight: number; // grams
  targetHarvestDate: string; // ISO date string
  budget: number;
}

export interface TargetStepProps {
  data: TargetData;
  onChange: (data: Partial<TargetData>) => void;
  errors?: Record<string, string>;
}

/**
 * Target Step - Input target panen, tanggal, budget
 */
export function TargetStep({ data, onChange, errors }: TargetStepProps) {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  return (
    <WizardStep
      title="Target Panen & Budget"
      description="Tentukan target ukuran panen, tanggal panen, dan budget yang tersedia"
    >
      <VStack gap={4} align="stretch">
        <FormInput
          label="Target Berat Panen (gram per ekor)"
          type="number"
          min="50"
          step="10"
          value={data.targetHarvestWeight || ''}
          onChange={(e) => onChange({ targetHarvestWeight: parseFloat(e.target.value) || 0 })}
          placeholder="Contoh: 120"
          required
          invalid={!!errors?.targetHarvestWeight}
          error={errors?.targetHarvestWeight}
          helperText="Ukuran standar pasar biasanya 100-150g untuk lele"
        />

        <FormInput
          label="Tanggal Target Panen"
          type="date"
          value={data.targetHarvestDate}
          onChange={(e) => onChange({ targetHarvestDate: e.target.value })}
          required
          invalid={!!errors?.targetHarvestDate}
          error={errors?.targetHarvestDate}
          min={new Date().toISOString().split('T')[0]}
          helperText="Pilih tanggal target panen yang realistis"
        />

        <FormCurrencyInput
          label="Budget Tersedia"
          value={data.budget}
          onChange={(value) => onChange({ budget: value })}
          required
          helperText="Total modal yang tersedia untuk investasi (termasuk benih, pakan, operasional)"
        />
        {errors?.budget && <Box fontSize="xs" color="red.500" mt={-2}>{errors.budget}</Box>}

        <Box fontSize="xs" color={textSecondary} mt={-2}>
          💡 Budget akan digunakan untuk menghitung kelayakan finansial. Pastikan sudah memperhitungkan modal awal dan biaya operasional bulanan.
        </Box>
      </VStack>
    </WizardStep>
  );
}

