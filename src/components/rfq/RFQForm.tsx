import { VStack, HStack, Box } from '@chakra-ui/react';
import { FormInput } from '../forms/FormInput';
import { FormCurrencyInput } from '../forms/FormCurrencyInput';
import { Select } from '../forms/Select';
import { Checkbox } from '../forms/Checkbox';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { FormTextarea } from '../forms/FormTextarea';

export interface RFQFormData {
  itemCategory: 'bibit' | 'pakan' | 'obat' | 'logistik' | '';
  itemName: string;
  specification?: string;
  size?: string;
  quantity: number;
  unit: string;
  deliveryDate: string;
  deliveryAddress: string;
  minSLA: number; // hours
  allowedPriceModels: ('spot' | 'fixed' | 'indexed')[];
  requireEscrow: boolean;
  notes?: string;
}

export interface RFQFormProps {
  data: RFQFormData;
  onChange: (data: Partial<RFQFormData>) => void;
  errors?: Record<string, string>;
}

const categoryOptions = [
  { value: 'bibit', label: 'Bibit Ikan' },
  { value: 'pakan', label: 'Pakan' },
  { value: 'obat', label: 'Obat' },
  { value: 'logistik', label: 'Peralatan' },
];

const priceModelOptions = [
  { value: 'spot', label: 'Spot (3-7 hari)' },
  { value: 'fixed', label: 'Fixed (4-8 minggu)' },
  { value: 'indexed', label: 'Indexed (mengikuti indeks)' },
];

/**
 * RFQ Form Component
 * - Create Request for Quotation
 * - Item specs, volume, delivery, SLA
 * - Price model preferences
 */
export function RFQForm({ data, onChange, errors }: RFQFormProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const handlePriceModelToggle = (model: 'spot' | 'fixed' | 'indexed') => {
    const current = data.allowedPriceModels || [];
    if (current.includes(model)) {
      onChange({ allowedPriceModels: current.filter((m) => m !== model) });
    } else {
      onChange({ allowedPriceModels: [...current, model] });
    }
  };

  return (
    <VStack gap={4} align="stretch">
      <Card variant="elevated">
        <CardHeader>
          <Box fontSize="md" fontWeight="semibold" color={textPrimary}>
            Informasi Item
          </Box>
        </CardHeader>
        <CardBody>
          <VStack gap={4} align="stretch">
            <Select
              label="Kategori Item"
              value={data.itemCategory}
              onChange={(e) => onChange({ itemCategory: e.target.value as any })}
              required
              items={categoryOptions}
              invalid={!!errors?.itemCategory}
            />
            {errors?.itemCategory && <Box fontSize="xs" color="red.500">{errors.itemCategory}</Box>}

            <FormInput
              label="Nama Item"
              value={data.itemName}
              onChange={(e) => onChange({ itemName: e.target.value })}
              placeholder="Contoh: Bibit Lele, Pakan Pellet 32%"
              required
              invalid={!!errors?.itemName}
              error={errors?.itemName}
            />

            <FormInput
              label="Spesifikasi"
              value={data.specification || ''}
              onChange={(e) => onChange({ specification: e.target.value })}
              placeholder="Contoh: Size 7-9, Protein 32%"
            />

            <HStack gap={4}>
              <Box flex={1}>
                <FormInput
                  label="Jumlah"
                  type="number"
                  min="1"
                  value={data.quantity || ''}
                  onChange={(e) => onChange({ quantity: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  required
                  invalid={!!errors?.quantity}
                  error={errors?.quantity}
                />
              </Box>
              <Box flex={1}>
                <FormInput
                  label="Unit"
                  value={data.unit}
                  onChange={(e) => onChange({ unit: e.target.value })}
                  placeholder="ekor, kg, paket"
                  required
                  invalid={!!errors?.unit}
                  error={errors?.unit}
                />
              </Box>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <Box fontSize="md" fontWeight="semibold" color={textPrimary}>
            Pengiriman & SLA
          </Box>
        </CardHeader>
        <CardBody>
          <VStack gap={4} align="stretch">
            <FormInput
              label="Tanggal Butuh"
              type="date"
              value={data.deliveryDate}
              onChange={(e) => onChange({ deliveryDate: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]}
              invalid={!!errors?.deliveryDate}
              error={errors?.deliveryDate}
            />

            <FormTextarea
              label="Alamat Pengiriman"
              value={data.deliveryAddress}
              onChange={(e) => onChange({ deliveryAddress: e.target.value })}
              placeholder="Masukkan alamat lengkap untuk pengiriman"
              rows={3}
              required
              invalid={!!errors?.deliveryAddress}
              error={errors?.deliveryAddress}
            />

            <FormInput
              label="SLA Minimum (jam)"
              type="number"
              min="1"
              value={data.minSLA || ''}
              onChange={(e) => onChange({ minSLA: parseFloat(e.target.value) || 0 })}
              placeholder="Contoh: 24"
              helperText="Maksimum waktu pengiriman yang diizinkan"
              required
              invalid={!!errors?.minSLA}
              error={errors?.minSLA}
            />
          </VStack>
        </CardBody>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <Box fontSize="md" fontWeight="semibold" color={textPrimary}>
            Model Harga yang Diizinkan
          </Box>
        </CardHeader>
        <CardBody>
          <VStack gap={3} align="stretch">
            {priceModelOptions.map((option) => (
              <Checkbox
                key={option.value}
                checked={data.allowedPriceModels?.includes(option.value as any) || false}
                onChange={() => handlePriceModelToggle(option.value as any)}
              >
                <Box>
                  <Box fontSize="sm" fontWeight="medium" color={textPrimary}>
                    {option.label}
                  </Box>
                  <Box fontSize="xs" color={textSecondary}>
                    {option.value === 'spot' && 'Harga berlaku singkat (3-7 hari)'}
                    {option.value === 'fixed' && 'Harga tetap untuk periode tertentu (4-8 minggu)'}
                    {option.value === 'indexed' && 'Harga mengikuti indeks pasar dengan floor/ceiling'}
                  </Box>
                </Box>
              </Checkbox>
            ))}
            {data.allowedPriceModels?.length === 0 && (
              <Box fontSize="xs" color="red.500">
                Pilih minimal satu model harga
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <Box fontSize="md" fontWeight="semibold" color={textPrimary}>
            Opsi Tambahan
          </Box>
        </CardHeader>
        <CardBody>
          <VStack gap={3} align="stretch">
            <Checkbox
              checked={data.requireEscrow || false}
              onChange={() => onChange({ requireEscrow: !data.requireEscrow })}
            >
              <Box>
                <Box fontSize="sm" fontWeight="medium" color={textPrimary}>
                  Wajibkan Escrow
                </Box>
                <Box fontSize="xs" color={textSecondary}>
                  Pembayaran akan ditahan di escrow sampai barang diterima dan QC lulus
                </Box>
              </Box>
            </Checkbox>

            <FormTextarea
              label="Catatan Tambahan (Opsional)"
              value={data.notes || ''}
              onChange={(e) => onChange({ notes: e.target.value })}
              placeholder="Tambahkan catatan atau spesifikasi khusus"
              rows={3}
            />
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}

