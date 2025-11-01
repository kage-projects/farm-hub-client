import { VStack, HStack, Text, Box, Table } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';

export interface InitialCapitalItem {
  category: string;
  item: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface InitialCapitalSimulationProps {
  items?: InitialCapitalItem[];
  total?: number;
}

/**
 * Simulasi Modal Awal - Breakdown modal awal untuk budidaya
 * - Pembuatan kolam
 * - Pembelian bibit
 * - Pakan
 * - Peralatan & perlengkapan
 */
export function InitialCapitalSimulation({
  items,
  total,
}: InitialCapitalSimulationProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const defaultItems: InitialCapitalItem[] = items || [
    {
      category: 'Infrastruktur',
      item: 'Pembuatan Kolam (10m x 10m x 1.5m)',
      quantity: 1,
      unit: 'unit',
      unitPrice: 5000000,
      total: 5000000,
    },
    {
      category: 'Infrastruktur',
      item: 'Saluran Air & Pompa',
      quantity: 1,
      unit: 'set',
      unitPrice: 2000000,
      total: 2000000,
    },
    {
      category: 'Bibit',
      item: 'Bibit Ikan Lele (ukuran 5-7cm)',
      quantity: 5000,
      unit: 'ekor',
      unitPrice: 500,
      total: 2500000,
    },
    {
      category: 'Pakan',
      item: 'Pakan Starter (2 bulan pertama)',
      quantity: 100,
      unit: 'kg',
      unitPrice: 12000,
      total: 1200000,
    },
    {
      category: 'Peralatan',
      item: 'Aerator & Oksigenator',
      quantity: 2,
      unit: 'unit',
      unitPrice: 500000,
      total: 1000000,
    },
    {
      category: 'Peralatan',
      item: 'Jaring, Ember, Timbangan',
      quantity: 1,
      unit: 'set',
      unitPrice: 300000,
      total: 300000,
    },
    {
      category: 'Peralatan',
      item: 'Wadah Pakan & Alat Kebersihan',
      quantity: 1,
      unit: 'set',
      unitPrice: 200000,
      total: 200000,
    },
  ];

  const calculatedTotal = defaultItems.reduce((sum, item) => sum + item.total, 0);
  const finalTotal = total || calculatedTotal;

  const groupedItems = defaultItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, InitialCapitalItem[]>);

  return (
    <VStack align="stretch" gap={4}>
      <Card variant="elevated">
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
            Breakdown Modal Awal
          </Text>
        </CardHeader>
        <CardBody>
          <VStack align="stretch" gap={6}>
            {Object.entries(groupedItems).map(([category, categoryItems]) => {
              const categoryTotal = categoryItems.reduce((sum, item) => sum + item.total, 0);
              return (
                <Box key={category}>
                  <Text fontSize="md" fontWeight="semibold" color={textPrimary} mb={3}>
                    {category}
                  </Text>
                  <Table.Root variant="simple" size="sm">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader color={textSecondary} borderColor={borderColor}>
                          Item
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end" color={textSecondary} borderColor={borderColor}>
                          Qty
                        </Table.ColumnHeader>
                        <Table.ColumnHeader color={textSecondary} borderColor={borderColor}>
                          Unit
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end" color={textSecondary} borderColor={borderColor}>
                          Harga/Unit
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end" color={textSecondary} borderColor={borderColor}>
                          Total
                        </Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {categoryItems.map((item, idx) => (
                        <Table.Row key={idx}>
                          <Table.Cell borderColor={borderColor} color={textPrimary}>
                            {item.item}
                          </Table.Cell>
                          <Table.Cell textAlign="end" borderColor={borderColor} color={textPrimary}>
                            {item.quantity.toLocaleString('id-ID')}
                          </Table.Cell>
                          <Table.Cell borderColor={borderColor} color={textSecondary}>
                            {item.unit}
                          </Table.Cell>
                          <Table.Cell textAlign="end" borderColor={borderColor} color={textPrimary}>
                            Rp {item.unitPrice.toLocaleString('id-ID')}
                          </Table.Cell>
                          <Table.Cell textAlign="end" borderColor={borderColor} color={textPrimary} fontWeight="semibold">
                            Rp {item.total.toLocaleString('id-ID')}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                  <HStack justify="flex-end" mt={2}>
                    <Text fontSize="sm" color={textSecondary}>
                      Subtotal {category}:
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      Rp {categoryTotal.toLocaleString('id-ID')}
                    </Text>
                  </HStack>
                </Box>
              );
            })}

            <Box
              pt={4}
              mt={4}
              borderTop="2px solid"
              borderColor={borderColor}
            >
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold" color={textPrimary}>
                  Total Modal Awal
                </Text>
                <Text fontSize="lg" fontWeight="bold" color={textPrimary}>
                  Rp {finalTotal.toLocaleString('id-ID')}
                </Text>
              </HStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}

