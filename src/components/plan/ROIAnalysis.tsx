import { VStack, HStack, Text, Box } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { Chart, type ChartData } from '../charts/Chart';
import { StatCard } from '../data/StatCard';

export interface ROIAnalysisProps {
  initialCapital?: number;
  monthlyOperational?: number;
  netRevenuePerHarvest?: number;
  harvestCycleMonths?: number;
  numberOfHarvests?: number;
}

/**
 * ROI Analysis dengan Grafik
 * - Grafik cash flow timeline
 * - Perhitungan ROI
 * - Break-even analysis
 * - Payback period
 */
export function ROIAnalysis({
  initialCapital = 12200000,
  monthlyOperational = 900000,
  netRevenuePerHarvest = 25000000 - 5400000, // default from RevenueProjection
  harvestCycleMonths = 6,
  numberOfHarvests = 2,
}: ROIAnalysisProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  // Calculate cash flow over time
  const totalMonths = harvestCycleMonths * numberOfHarvests;
  const cashFlow: number[] = [];
  let cumulative = -initialCapital;

  for (let month = 0; month < totalMonths; month++) {
    if (month % harvestCycleMonths === 0 && month > 0) {
      // Harvest time
      cumulative += netRevenuePerHarvest;
    } else if (month > 0) {
      // Operational costs
      cumulative -= monthlyOperational;
    }
    cashFlow.push(cumulative);
  }

  // Calculate ROI
  const totalRevenue = netRevenuePerHarvest * numberOfHarvests;
  const totalOperational = monthlyOperational * (totalMonths - numberOfHarvests);
  const totalInvestment = initialCapital + totalOperational;
  const totalProfit = totalRevenue - totalInvestment;
  const roi = (totalProfit / totalInvestment) * 100;

  // Calculate payback period
  let paybackMonth = -1;
  for (let i = 0; i < cashFlow.length; i++) {
    if (cashFlow[i] >= 0) {
      paybackMonth = i;
      break;
    }
  }
  const paybackPeriod = paybackMonth >= 0 ? paybackMonth : null;

  // Chart data
  const cashFlowChartData: ChartData[] = cashFlow.map((value, index) => ({
    label: `Bln ${index + 1}`,
    value: value,
  }));

  const profitBreakdownData: ChartData[] = [
    { label: 'Total Investasi', value: totalInvestment },
    { label: 'Total Pendapatan', value: totalRevenue },
    { label: 'Total Profit', value: totalProfit },
  ];

  return (
    <VStack align="stretch" gap={6}>
      {/* Key Metrics */}
      <HStack gap={4} wrap="wrap">
        <StatCard
          label="Total Investasi"
          value={`Rp ${totalInvestment.toLocaleString('id-ID')}`}
          trend="neutral"
          colorScheme="secondary"
        />
        <StatCard
          label="Total Profit"
          value={`Rp ${totalProfit.toLocaleString('id-ID')}`}
          trend={totalProfit > 0 ? 'up' : 'down'}
          colorScheme={totalProfit > 0 ? 'green' : 'red'}
        />
        <StatCard
          label="ROI"
          value={`${roi.toFixed(1)}%`}
          trend={roi > 0 ? 'up' : 'down'}
          colorScheme={roi > 50 ? 'green' : roi > 20 ? 'yellow' : 'red'}
        />
        <StatCard
          label="Payback Period"
          value={paybackPeriod ? `${paybackPeriod} bulan` : '> 2 tahun'}
          trend="neutral"
          colorScheme={paybackPeriod && paybackPeriod <= 12 ? 'green' : 'yellow'}
        />
      </HStack>

      {/* Charts */}
      <HStack gap={4} align="stretch" wrap="wrap">
        <Box flex={1} minW="400px">
          <Chart
            title="Cash Flow Timeline"
            data={cashFlowChartData}
            type="area"
            width={500}
            height={300}
            colorScheme="brand"
          />
        </Box>
        <Box flex={1} minW="300px">
          <Chart
            title="Breakdown Profit"
            data={profitBreakdownData}
            type="bar"
            width={400}
            height={300}
            colorScheme="multi"
          />
        </Box>
      </HStack>

      {/* Analysis Details */}
      <Card variant="elevated">
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
            Analisis ROI
          </Text>
        </CardHeader>
        <CardBody>
          <VStack align="stretch" gap={4}>
            <Box>
              <Text fontSize="sm" color={textSecondary} mb={2}>
                Total Investasi Awal
              </Text>
              <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Rp {initialCapital.toLocaleString('id-ID')}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color={textSecondary} mb={2}>
                Total Biaya Operasional ({totalMonths} bulan)
              </Text>
              <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Rp {totalOperational.toLocaleString('id-ID')}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color={textSecondary} mb={2}>
                Total Pendapatan ({numberOfHarvests} kali panen)
              </Text>
              <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Rp {totalRevenue.toLocaleString('id-ID')}
              </Text>
            </Box>
            <Box
              pt={4}
              borderTop="2px solid"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold" color={textPrimary}>
                  ROI
                </Text>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={
                    roi > 50
                      ? useColorModeValue('green.600', 'green.400')
                      : roi > 20
                      ? useColorModeValue('yellow.600', 'yellow.400')
                      : useColorModeValue('red.600', 'red.400')
                  }
                >
                  {roi > 0 ? '+' : ''}
                  {roi.toFixed(2)}%
                </Text>
              </HStack>
              {paybackPeriod && (
                <HStack justify="space-between" mt={2}>
                  <Text fontSize="sm" color={textSecondary}>
                    Payback Period
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                    {paybackPeriod} bulan ({Math.round(paybackPeriod / 12 * 10) / 10} tahun)
                  </Text>
                </HStack>
              )}
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}

