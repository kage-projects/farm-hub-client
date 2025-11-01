import { VStack, HStack, Text, Box, Table } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';

export interface OperationalCostItem {
  category: string;
  description: string;
  monthlyCost: number;
  notes?: string;
}

export interface MonthlyOperationalCostsProps {
  items?: OperationalCostItem[];
  totalMonthly?: number;
}

/**
 * Biaya Operasional Bulanan - Breakdown biaya operasional rutin
 * - Listrik
 * - Air
 * - Tenaga kerja
 * - Pakan bulanan
 * - Obat & vitamin
 * - Maintenance
 */
export function MonthlyOperationalCosts({
  items,
  totalMonthly,
}: MonthlyOperationalCostsProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const defaultItems: OperationalCostItem[] = items || [
    {
      category: 'Utilitas',
      description: 'Listrik (Aerator, Pompa, Penerangan)',
      monthlyCost: 500000,
      notes: 'Estimasi 8 jam/hari',
    },
    {
      category: 'Utilitas',
      description: 'Air (Penggantian & Tambahan)',
      monthlyCost: 200000,
      notes: '10% volume kolam per bulan',
    },
    {
      category: 'Tenaga Kerja',
      description: 'Upah Karyawan (1 orang)',
      monthlyCost: 2000000,
      notes: 'Full-time maintenance',
    },
    {
      category: 'Pakan',
      description: 'Pakan Ikan (Pertumbuhan)',
      monthlyCost: 1500000,
      notes: '2-3% dari berat ikan/hari',
    },
    {
      category: 'Obat & Vitamin',
      description: 'Obat & Vitamin Ikan',
      monthlyCost: 300000,
      notes: 'Preventif & pengobatan',
    },
    {
      category: 'Maintenance',
      description: 'Perawatan Kolam & Alat',
      monthlyCost: 200000,
      notes: 'Pembersihan rutin',
    },
    {
      category: 'Lain-lain',
      description: 'Transportasi & Administrasi',
      monthlyCost: 300000,
      notes: 'Biaya tak terduga',
    },
  ];

  const calculatedTotal = defaultItems.reduce((sum, item) => sum + item.monthlyCost, 0);
  const finalTotal = totalMonthly || calculatedTotal;

  return (
    <VStack align="stretch" gap={4}>
      <Card variant="elevated">
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
            Breakdown Biaya Operasional Bulanan
          </Text>
        </CardHeader>
        <CardBody>
          <VStack align="stretch" gap={4}>
            <Table.Root variant="simple" size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader color={textSecondary} borderColor={borderColor}>
                    Kategori
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color={textSecondary} borderColor={borderColor}>
                    Deskripsi
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end" color={textSecondary} borderColor={borderColor}>
                    Biaya/Bulan
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color={textSecondary} borderColor={borderColor}>
                    Keterangan
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {defaultItems.map((item, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell borderColor={borderColor} color={textPrimary} fontWeight="medium">
                      {item.category}
                    </Table.Cell>
                    <Table.Cell borderColor={borderColor} color={textPrimary}>
                      {item.description}
                    </Table.Cell>
                    <Table.Cell textAlign="end" borderColor={borderColor} color={textPrimary} fontWeight="semibold">
                      Rp {item.monthlyCost.toLocaleString('id-ID')}
                    </Table.Cell>
                    <Table.Cell borderColor={borderColor} color={textSecondary} fontSize="sm">
                      {item.notes || '-'}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>

            <Box
              pt={4}
              mt={2}
              borderTop="2px solid"
              borderColor={borderColor}
            >
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold" color={textPrimary}>
                  Total Biaya Operasional/Bulan
                </Text>
                <Text fontSize="lg" fontWeight="bold" color={textPrimary}>
                  Rp {finalTotal.toLocaleString('id-ID')}
                </Text>
              </HStack>
              <HStack justify="space-between" mt={2}>
                <Text fontSize="sm" color={textSecondary}>
                  Total per 6 Bulan (1 Siklus Panen)
                </Text>
                <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                  Rp {(finalTotal * 6).toLocaleString('id-ID')}
                </Text>
              </HStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}

