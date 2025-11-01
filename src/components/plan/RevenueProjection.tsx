import { VStack, HStack, Text, Box, Table } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { Chart, type ChartData } from '../charts/Chart';
import { StatCard } from '../data/StatCard';

export interface RevenueProjectionProps {
  harvestQuantity?: number; // kg
  pricePerKg?: number;
  operationalCosts?: number;
}

/**
 * Proyeksi Pendapatan per Panen
 * - Perhitungan pendapatan kotor
 * - Biaya operasional
 * - Pendapatan bersih
 * - Margin profit
 */
export function RevenueProjection({
  harvestQuantity = 1000, // default 1000 kg
  pricePerKg = 25000, // default Rp 25.000/kg
  operationalCosts = 5400000, // default 6 bulan x Rp 900.000
}: RevenueProjectionProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const grossRevenue = harvestQuantity * pricePerKg;
  const netRevenue = grossRevenue - operationalCosts;
  const margin = (netRevenue / grossRevenue) * 100;

  // Chart data untuk breakdown
  const revenueChartData: ChartData[] = [
    { label: 'Pendapatan Kotor', value: grossRevenue },
    { label: 'Biaya Operasional', value: operationalCosts },
    { label: 'Pendapatan Bersih', value: netRevenue },
  ];

  // Data untuk chart timeline (6 bulan)
  const monthlyData: ChartData[] = [
    { label: 'Bln 1', value: -(operationalCosts / 6) },
    { label: 'Bln 2', value: -(operationalCosts / 6) },
    { label: 'Bln 3', value: -(operationalCosts / 6) },
    { label: 'Bln 4', value: -(operationalCosts / 6) },
    { label: 'Bln 5', value: -(operationalCosts / 6) },
    { label: 'Panen', value: grossRevenue },
  ];

  return (
    <VStack align="stretch" gap={6}>
      {/* Summary Cards */}
      <HStack gap={4} wrap="wrap">
        <StatCard
          label="Pendapatan Kotor"
          value={`Rp ${grossRevenue.toLocaleString('id-ID')}`}
          trend="up"
          colorScheme="green"
        />
        <StatCard
          label="Biaya Operasional"
          value={`Rp ${operationalCosts.toLocaleString('id-ID')}`}
          trend="down"
          colorScheme="red"
        />
        <StatCard
          label="Pendapatan Bersih"
          value={`Rp ${netRevenue.toLocaleString('id-ID')}`}
          trend={netRevenue > 0 ? 'up' : 'down'}
          colorScheme={netRevenue > 0 ? 'green' : 'red'}
        />
        <StatCard
          label="Margin Profit"
          value={`${margin.toFixed(1)}%`}
          trend={margin > 0 ? 'up' : 'down'}
          colorScheme={margin > 30 ? 'green' : margin > 15 ? 'yellow' : 'red'}
        />
      </HStack>

      {/* Breakdown Table */}
      <Card variant="elevated">
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
            Breakdown Perhitungan
          </Text>
        </CardHeader>
        <CardBody>
          <Table.Root variant="simple" size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader color={textSecondary} borderColor={borderColor}>
                  Item
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end" color={textSecondary} borderColor={borderColor}>
                  Nilai
                </Table.ColumnHeader>
                <Table.ColumnHeader color={textSecondary} borderColor={borderColor}>
                  Keterangan
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell borderColor={borderColor} color={textPrimary} fontWeight="medium">
                  Jumlah Panen
                </Table.Cell>
                <Table.Cell textAlign="end" borderColor={borderColor} color={textPrimary}>
                  {harvestQuantity.toLocaleString('id-ID')} kg
                </Table.Cell>
                <Table.Cell borderColor={borderColor} color={textSecondary} fontSize="sm">
                  Estimasi hasil panen
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell borderColor={borderColor} color={textPrimary} fontWeight="medium">
                  Harga per Kg
                </Table.Cell>
                <Table.Cell textAlign="end" borderColor={borderColor} color={textPrimary}>
                  Rp {pricePerKg.toLocaleString('id-ID')}
                </Table.Cell>
                <Table.Cell borderColor={borderColor} color={textSecondary} fontSize="sm">
                  Harga pasar saat ini
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell borderColor={borderColor} color={textPrimary} fontWeight="semibold">
                  Pendapatan Kotor
                </Table.Cell>
                <Table.Cell textAlign="end" borderColor={borderColor} color={textPrimary} fontWeight="bold">
                  Rp {grossRevenue.toLocaleString('id-ID')}
                </Table.Cell>
                <Table.Cell borderColor={borderColor} color={textSecondary} fontSize="sm">
                  Jumlah × Harga
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell borderColor={borderColor} color={textPrimary} fontWeight="medium">
                  Biaya Operasional (6 bulan)
                </Table.Cell>
                <Table.Cell textAlign="end" borderColor={borderColor} color={textPrimary}>
                  Rp {operationalCosts.toLocaleString('id-ID')}
                </Table.Cell>
                <Table.Cell borderColor={borderColor} color={textSecondary} fontSize="sm">
                  Total biaya operasional
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell borderColor={borderColor} color={textPrimary} fontWeight="semibold">
                  Pendapatan Bersih
                </Table.Cell>
                <Table.Cell textAlign="end" borderColor={borderColor} color={textPrimary} fontWeight="bold">
                  Rp {netRevenue.toLocaleString('id-ID')}
                </Table.Cell>
                <Table.Cell borderColor={borderColor} color={textSecondary} fontSize="sm">
                  Kotor - Operasional
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </CardBody>
      </Card>

      {/* Charts */}
      <HStack gap={4} align="stretch" wrap="wrap">
        <Box flex={1} minW="300px">
          <Chart
            title="Breakdown Pendapatan"
            data={revenueChartData}
            type="bar"
            width={400}
            height={250}
            colorScheme="multi"
          />
        </Box>
        <Box flex={1} minW="300px">
          <Chart
            title="Cash Flow Timeline (6 Bulan)"
            data={monthlyData}
            type="line"
            width={400}
            height={250}
            colorScheme="brand"
          />
        </Box>
      </HStack>
    </VStack>
  );
}

