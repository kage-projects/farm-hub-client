import { VStack, Box } from '@chakra-ui/react';
import { FormInput } from '../../forms/FormInput';
import { Select } from '../../forms/Select';
import { WizardStep } from '../WizardStep';
import { useColorModeValue } from '../../ui/color-mode';

export interface LocationData {
  province: string;
  city: string;
  address: string;
  waterSource: 'sumur' | 'sungai' | 'pam' | '';
  coordinates?: { lat: number; lng: number };
}

export interface LocationStepProps {
  data: LocationData;
  onChange: (data: Partial<LocationData>) => void;
  errors?: Record<string, string>;
}

const cities = [
  { value: 'padang', label: 'Padang' },
  { value: 'bukittinggi', label: 'Bukittinggi' },
  { value: 'solok', label: 'Solok' },
  { value: 'payakumbuh', label: 'Payakumbuh' },
  { value: 'padang-panjang', label: 'Padang Panjang' },
  { value: 'sawahlunto', label: 'Sawahlunto' },
  { value: 'pariaman', label: 'Pariaman' },
  { value: 'agam', label: 'Agam' },
];

const waterSources = [
  { value: 'sumur', label: 'Sumur' },
  { value: 'sungai', label: 'Sungai' },
  { value: 'pam', label: 'PAM' },
];

/**
 * Location Step - Input lokasi, sumber air
 */
export function LocationStep({ data, onChange, errors }: LocationStepProps) {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  return (
    <WizardStep
      title="Lokasi & Sumber Air"
      description="Tentukan lokasi proyek dan sumber air yang akan digunakan"
    >
      <VStack gap={4} align="stretch">
        <FormInput
          label="Provinsi"
          value={data.province}
          onChange={(e) => onChange({ province: e.target.value })}
          disabled
          helperText="Lokasi proyek harus berada di Sumatra Barat"
        />

        <Select
          label="Kota/Kabupaten"
          value={data.city}
          onChange={(e) => onChange({ city: e.target.value })}
          required
          items={cities}
          invalid={!!errors?.city}
        />
        {errors?.city && <Box fontSize="xs" color="red.500">{errors.city}</Box>}

        <FormInput
          label="Alamat Detail"
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="Masukkan alamat lengkap lokasi proyek"
          required
          invalid={!!errors?.address}
          error={errors?.address}
        />

        <Select
          label="Sumber Air"
          value={data.waterSource}
          onChange={(e) => onChange({ waterSource: e.target.value as any })}
          required
          items={waterSources}
          invalid={!!errors?.waterSource}
        />
        {errors?.waterSource && <Box fontSize="xs" color="red.500">{errors.waterSource}</Box>}

        <Box fontSize="xs" color={textSecondary} mt={-2}>
          💡 Sumber air mempengaruhi kualitas dan biaya operasional. Sumur biasanya paling stabil, sungai perlu treatment lebih intensif.
        </Box>
      </VStack>
    </WizardStep>
  );
}

