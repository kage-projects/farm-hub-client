import { VStack, Box } from '@chakra-ui/react';
import { Select } from '../../../components/forms/Select';
import { Field } from '@chakra-ui/react';
import { WizardStep } from '../../../components/onboarding/WizardStep';
import { useColorModeValue } from '../../../components/ui/color-mode';
import { GoogleMapPicker } from './GoogleMapPicker';
import { getCityCoordinates } from '../utils/cityCoordinates';
import { useEffect, useState } from 'react';

export interface LocationFormData {
  kabupaten_id: string;
  lang?: number;
  lat?: number;
}

export interface LocationStepProps {
  data: LocationFormData;
  onChange: (data: Partial<LocationFormData>) => void;
  errors?: Record<string, string>;
}

const kabupatenOptions = [
  { value: 'Padang', label: 'Padang' },
  { value: 'Bukittinggi', label: 'Bukittinggi' },
  { value: 'Solok', label: 'Solok' },
  { value: 'Payakumbuh', label: 'Payakumbuh' },
  { value: 'Padang Panjang', label: 'Padang Panjang' },
  { value: 'Sawahlunto', label: 'Sawahlunto' },
  { value: 'Pariaman', label: 'Pariaman' },
  { value: 'Agam', label: 'Agam' },
  { value: 'Pesisir Selatan', label: 'Pesisir Selatan' },
  { value: 'Sijunjung', label: 'Sijunjung' },
  { value: 'Tanah Datar', label: 'Tanah Datar' },
  { value: 'Padang Pariaman', label: 'Padang Pariaman' },
  { value: 'Pasaman', label: 'Pasaman' },
  { value: 'Pasaman Barat', label: 'Pasaman Barat' },
  { value: 'Mentawai', label: 'Mentawai' },
  { value: 'Dharmasraya', label: 'Dharmasraya' },
  { value: 'Solok Selatan', label: 'Solok Selatan' },
  { value: 'Kepulauan Mentawai', label: 'Kepulauan Mentawai' },
];

/**
 * Location Step - Select city and pick coordinates from Google Maps
 */
export function LocationStep({ data, onChange, errors }: LocationStepProps) {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const [centerCity, setCenterCity] = useState<{ lat: number; lng: number } | undefined>();

  // Update center city when kabupaten_id changes
  useEffect(() => {
    if (data.kabupaten_id) {
      const cityCoords = getCityCoordinates(data.kabupaten_id);
      if (cityCoords) {
        setCenterCity({ lat: cityCoords.lat, lng: cityCoords.lng });
      }
    } else {
      setCenterCity(undefined);
    }
  }, [data.kabupaten_id]);

  const handleMapClick = (lat: number, lng: number) => {
    onChange({ lat, lang: lng });
  };

  const handleCityChange = (city: string) => {
    onChange({ kabupaten_id: city });
    // Clear coordinates when city changes (user needs to pick new location)
    onChange({ lat: undefined, lang: undefined });
  };

  return (
    <WizardStep
      title="Lokasi Proyek"
      description="Pilih kota dan tentukan koordinat lokasi proyek di peta"
    >
      <VStack gap={4} align="stretch">
        <Field.Root>
          <Field.Label>Kabupaten/Kota *</Field.Label>
          <Select
            value={data.kabupaten_id}
            onChange={(e) => handleCityChange(e.target.value)}
            items={kabupatenOptions}
            required
            invalid={!!errors?.kabupaten_id}
          />
          {errors?.kabupaten_id && <Box fontSize="xs" color="red.500" mt={1}>{errors.kabupaten_id}</Box>}
        </Field.Root>

        <Box fontSize="xs" color={textSecondary} mt={-2}>
          💡 Pilih kabupaten/kota tempat proyek budidaya ikan akan dibangun
        </Box>

        <VStack gap={2} align="stretch" mt={4}>
          <Box fontSize="sm" fontWeight="medium" color={textSecondary}>
            Koordinat Lokasi (Pilih di peta)
          </Box>
          
          <GoogleMapPicker
            lat={data.lat}
            lng={data.lang}
            onMapClick={handleMapClick}
            centerCity={centerCity}
          />

          {data.lat !== undefined && data.lang !== undefined && (
            <Box fontSize="xs" color={textSecondary} mt={-2}>
              ✅ Koordinat dipilih: {data.lat.toFixed(4)}, {data.lang.toFixed(4)}
            </Box>
          )}

          {(errors?.lat || errors?.lang) && (
            <Box fontSize="xs" color="red.500">
              {errors.lat || errors.lang}
            </Box>
          )}
        </VStack>
      </VStack>
    </WizardStep>
  );
}

