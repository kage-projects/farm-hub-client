import { Container, VStack, HStack, Heading, Text, Box, SimpleGrid } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Button } from '../components/button/Button';
import { ScoreCard } from '../components/data/ScoreCard';
import { StatCard } from '../components/data/StatCard';
import { Card, CardBody, CardHeader } from '../components/surfaces/Card';
import { useColorModeValue } from '../components/ui/color-mode';
import { FiArrowLeft, FiFileText, FiDownload } from 'react-icons/fi';

/**
 * Summary Page - Halaman hasil generate ringkasan awal
 * - Skor kelayakan
 * - Potensi pasar
 * - Estimasi modal
 * - Estimasi balik modal
 * - Kesimpulan ringkasan
 */
export function SummaryPage() {
  const navigate = useNavigate();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  // Sample data - dalam real app, ini dari API/state management
  const summaryData = {
    feasibilityScore: 78,
    breakdown: [
      { label: 'Lokasi', score: 85, maxScore: 100 },
      { label: 'Pasar', score: 72, maxScore: 100 },
      { label: 'Modal', score: 80, maxScore: 100 },
      { label: 'Risiko', score: 75, maxScore: 100 },
    ],
    marketPotential: {
      demand: 'high' as const,
      averagePrice: 35000,
      trend: 'growing' as const,
    },
    capitalEstimate: {
      initial: 50000000,
      operational: 5000000,
      total: 55000000,
    },
    roiEstimate: {
      paybackPeriod: 18, // months
      roi: 25, // percentage
    },
    conclusion:
      'Proyek ini layak untuk dilaksanakan dengan skor kelayakan 78/100. Potensi pasar tinggi dengan harga rata-rata Rp 35.000/kg. Estimasi modal awal Rp 50.000.000 dengan biaya operasional bulanan Rp 5.000.000. ROI diperkirakan 25% dengan payback period 18 bulan.',
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[{ label: 'Dashboard', href: '/dashboard' }]}
        cta={{ label: 'Dashboard', href: '/dashboard' }}
      />
      <Container maxW="7xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Header */}
          <HStack gap={4}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/input')}
              leftIcon={<FiArrowLeft />}
            >
              Kembali ke Inputan
            </Button>
            <VStack align="start" gap={1} flex={1}>
              <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                Ringkasan Awal
              </Heading>
              <Text fontSize="md" color={textSecondary}>
                Hasil analisis kelayakan proyek budidaya ikan
              </Text>
            </VStack>
          </HStack>

          {/* Skor Kelayakan */}
          <Card variant="elevated">
            <CardHeader>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Skor Kelayakan
              </Heading>
            </CardHeader>
            <CardBody>
              <ScoreCard
                score={summaryData.feasibilityScore}
                breakdown={summaryData.breakdown}
              />
            </CardBody>
          </Card>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
            <StatCard
              label="Estimasi Modal Awal"
              value={formatCurrency(summaryData.capitalEstimate.initial)}
            />
            <StatCard
              label="Operasional Bulanan"
              value={formatCurrency(summaryData.capitalEstimate.operational)}
            />
            <StatCard
              label="Payback Period"
              value={`${summaryData.roiEstimate.paybackPeriod} bulan`}
            />
            <StatCard
              label="ROI"
              value={`${summaryData.roiEstimate.roi}%`}
            />
          </SimpleGrid>

          {/* Potensi Pasar */}
          <Card variant="elevated">
            <CardHeader>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Potensi Pasar
              </Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" color={textSecondary}>
                    Tingkat Permintaan
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
                    {summaryData.marketPotential.demand === 'high' ? 'Tinggi' : 'Sedang'}
                  </Text>
                </VStack>
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" color={textSecondary}>
                    Harga Rata-rata
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
                    {formatCurrency(summaryData.marketPotential.averagePrice)}/kg
                  </Text>
                </VStack>
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" color={textSecondary}>
                    Tren Pasar
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
                    {summaryData.marketPotential.trend === 'growing' ? 'Meningkat' : 'Stabil'}
                  </Text>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Estimasi Modal */}
          <Card variant="elevated">
            <CardHeader>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Estimasi Modal
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" gap={3}>
                <HStack justify="space-between">
                  <Text color={textSecondary}>Modal Awal</Text>
                  <Text fontWeight="semibold" color={textPrimary}>
                    {formatCurrency(summaryData.capitalEstimate.initial)}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color={textSecondary}>Biaya Operasional Bulanan</Text>
                  <Text fontWeight="semibold" color={textPrimary}>
                    {formatCurrency(summaryData.capitalEstimate.operational)}
                  </Text>
                </HStack>
                <Box borderTop="1px solid" borderColor={useColorModeValue('gray.200', 'gray.700')} pt={3}>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color={textPrimary}>
                      Total Modal (6 bulan pertama)
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="brand.600">
                      {formatCurrency(
                        summaryData.capitalEstimate.initial +
                        summaryData.capitalEstimate.operational * 6
                      )}
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Estimasi Balik Modal */}
          <Card variant="elevated">
            <CardHeader>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Estimasi Balik Modal (ROI)
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" gap={4}>
                <HStack justify="space-between">
                  <Text color={textSecondary}>Payback Period</Text>
                  <Text fontSize="xl" fontWeight="bold" color={textPrimary}>
                    {summaryData.roiEstimate.paybackPeriod} bulan
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color={textSecondary}>Return on Investment (ROI)</Text>
                  <Text fontSize="xl" fontWeight="bold" color="green.600">
                    {summaryData.roiEstimate.roi}%
                  </Text>
                </HStack>
                <Box
                  p={4}
                  borderRadius="md"
                  bg={useColorModeValue('green.50', 'green.900')}
                  border="1px solid"
                  borderColor={useColorModeValue('green.200', 'green.700')}
                >
                  <Text fontSize="sm" color={textSecondary}>
                    Proyeksi: Modal akan kembali dalam{' '}
                    <Text as="span" fontWeight="bold" color="green.600">
                      {summaryData.roiEstimate.paybackPeriod} bulan
                    </Text>{' '}
                    dengan ROI{' '}
                    <Text as="span" fontWeight="bold" color="green.600">
                      {summaryData.roiEstimate.roi}%
                    </Text>
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Kesimpulan Ringkasan */}
          <Card variant="elevated">
            <CardHeader>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Kesimpulan Ringkasan
              </Heading>
            </CardHeader>
            <CardBody>
              <Text color={textPrimary} lineHeight="tall">
                {summaryData.conclusion}
              </Text>
            </CardBody>
          </Card>

          {/* Actions */}
          <HStack gap={4} justify="flex-end" flexWrap="wrap">
            <Button
              variant="outline"
              onClick={() => navigate('/input')}
              leftIcon={<FiArrowLeft />}
            >
              Kembali ke Inputan
            </Button>
            <Button
              variant="outline"
              leftIcon={<FiDownload />}
            >
              Download PDF
            </Button>
            <Button
              variant="solid"
              colorScheme="brand"
              onClick={() => navigate('/plan')}
            >
              Generate Rencana Lengkap
            </Button>
          </HStack>
        </VStack>
      </Container>
    </>
  );
}

