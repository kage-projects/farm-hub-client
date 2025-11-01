import { VStack, HStack, Text, Box, Table, Badge } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';

export interface TechnicalSpecItem {
  category: string;
  specification: string;
  value: string;
  unit?: string;
  notes?: string;
}

export interface TechnicalSpecsProps {
  specs?: TechnicalSpecItem[];
}

/**
 * Spesifikasi Teknis - Detail spesifikasi kolam, bibit, pakan, dan peralatan
 */
export function TechnicalSpecs({ specs }: TechnicalSpecsProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const defaultSpecs: TechnicalSpecItem[] = specs || [
    {
      category: 'Kolam',
      specification: 'Dimensi Kolam',
      value: '10',
      unit: 'm × 10m × 1.5m',
      notes: 'Kedalaman optimal untuk ikan lele',
    },
    {
      category: 'Kolam',
      specification: 'Volume Air',
      value: '150',
      unit: 'm³',
      notes: 'Kapasitas maksimal',
    },
    {
      category: 'Kolam',
      specification: 'Lapisan Dasar',
      value: 'Tanah liat + Terpal',
      notes: 'Kedap air',
    },
    {
      category: 'Bibit',
      specification: 'Jenis Ikan',
      value: 'Lele Sangkuriang',
      notes: 'Varietas unggul',
    },
    {
      category: 'Bibit',
      specification: 'Ukuran Bibit',
      value: '5-7',
      unit: 'cm',
      notes: 'Umur 2-3 minggu',
    },
    {
      category: 'Bibit',
      specification: 'Kepadatan',
      value: '50-100',
      unit: 'ekor/m²',
      notes: 'Optimal untuk pertumbuhan',
    },
    {
      category: 'Pakan',
      specification: 'Jenis Pakan',
      value: 'Pakan Pelet Komersial',
      notes: 'Protein minimal 30%',
    },
    {
      category: 'Pakan',
      specification: 'Frekuensi Pemberian',
      value: '2-3',
      unit: 'kali/hari',
      notes: 'Sesuai umur ikan',
    },
    {
      category: 'Pakan',
      specification: 'Dosis Pakan',
      value: '2-3',
      unit: '% dari berat ikan',
      notes: 'Perhitungan harian',
    },
    {
      category: 'Peralatan',
      specification: 'Aerator',
      value: '2',
      unit: 'unit',
      notes: 'Kapasitas 100W per unit',
    },
    {
      category: 'Peralatan',
      specification: 'Pompa Air',
      value: '1',
      unit: 'unit',
      notes: 'Kapasitas 500 L/menit',
    },
    {
      category: 'Peralatan',
      specification: 'Alat Ukur Kualitas Air',
      value: 'pH Meter, DO Meter',
      notes: 'Monitoring harian',
    },
  ];

  const groupedSpecs = defaultSpecs.reduce((acc, spec) => {
    if (!acc[spec.category]) {
      acc[spec.category] = [];
    }
    acc[spec.category].push(spec);
    return acc;
  }, {} as Record<string, TechnicalSpecItem[]>);

  return (
    <VStack align="stretch" gap={4}>
      {Object.entries(groupedSpecs).map(([category, categorySpecs]) => (
        <Card key={category} variant="elevated">
          <CardHeader>
            <HStack>
              <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
                {category}
              </Text>
              <Badge colorScheme="brand" variant="subtle">
                {categorySpecs.length} item
              </Badge>
            </HStack>
          </CardHeader>
          <CardBody>
            <Table.Root variant="simple" size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader color={textSecondary} borderColor={borderColor}>
                    Spesifikasi
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color={textSecondary} borderColor={borderColor}>
                    Nilai
                  </Table.ColumnHeader>
                  <Table.ColumnHeader color={textSecondary} borderColor={borderColor}>
                    Keterangan
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {categorySpecs.map((spec, idx) => (
                  <Table.Row key={idx}>
                    <Table.Cell borderColor={borderColor} color={textPrimary} fontWeight="medium">
                      {spec.specification}
                    </Table.Cell>
                    <Table.Cell borderColor={borderColor} color={textPrimary}>
                      <HStack>
                        <Text fontWeight="semibold">{spec.value}</Text>
                        {spec.unit && (
                          <Text fontSize="sm" color={textSecondary}>
                            {spec.unit}
                          </Text>
                        )}
                      </HStack>
                    </Table.Cell>
                    <Table.Cell borderColor={borderColor} color={textSecondary} fontSize="sm">
                      {spec.notes || '-'}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
}

