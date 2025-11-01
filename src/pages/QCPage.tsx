import { Container, VStack, HStack, Heading, Text, Box, Alert, SimpleGrid } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { Button } from '../components/button/Button';
import { useColorModeValue } from '../components/ui/color-mode';
import { QCForm, type QCFormData } from '../components/qc/QCForm';
import { Card, CardBody, CardHeader } from '../components/surfaces/Card';
import { FiArrowLeft, FiClock } from 'react-icons/fi';

/**
 * QC Page - Quality Check form
 */
export function QCPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const [qcData, setQcData] = useState<QCFormData>({
    itemType: 'bibit',
    orderId: orderId || '',
    orderValue: 1500000,
    totalQuantity: 5000,
    sampleSize: 100,
    expectedSize: 120,
    mortality: 0,
    weightActual: undefined,
    weightExpected: undefined,
    hasExpiryIssue: false,
    hasPackagingIssue: false,
  });

  const [qcWindowExpiresAt, setQcWindowExpiresAt] = useState<Date | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Set QC window: 24 hours from delivery
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    setQcWindowExpiresAt(expiresAt);

    // Check expiration
    const checkInterval = setInterval(() => {
      if (expiresAt <= new Date()) {
        setIsExpired(true);
        clearInterval(checkInterval);
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  const handleSubmit = (result: { pass: boolean; penalty?: number }) => {
    if (result.pass) {
      alert('QC PASS - Pembayaran akan diteruskan ke supplier');
    } else {
      alert(`QC FAIL/PARTIAL - Penalti Rp ${result.penalty?.toLocaleString('id-ID')} diterapkan`);
    }
    // Navigate to order details or dashboard
    navigate('/dashboard');
  };

  const getRemainingTime = (): string => {
    if (!qcWindowExpiresAt || isExpired) return 'Kedaluwarsa';
    const now = new Date();
    const diff = qcWindowExpiresAt.getTime() - now.getTime();
    if (diff <= 0) return 'Kedaluwarsa';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}j ${minutes}m`;
  };

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[{ label: 'Dashboard', href: '/dashboard' }]}
        cta={{ label: 'Dashboard', href: '/dashboard' }}
      />
      <Container maxW="4xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Header */}
          <HStack gap={4}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              leftIcon={<FiArrowLeft />}
            >
              Kembali
            </Button>
            <VStack align="start" gap={1} flex={1}>
              <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                Quality Check (QC)
              </Heading>
              <Text fontSize="md" color={textSecondary}>
                Lakukan pengecekan kualitas barang yang diterima
              </Text>
            </VStack>
          </HStack>

          {/* QC Window Warning */}
          <Card variant="elevated">
            <CardHeader>
              <HStack justify="space-between">
                <HStack gap={2}>
                  <FiClock size={16} />
                  <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                    QC Window
                  </Text>
                </HStack>
                <Text fontSize="sm" fontWeight="bold" color={isExpired ? 'red.600' : 'orange.600'}>
                  {getRemainingTime()} tersisa
                </Text>
              </HStack>
            </CardHeader>
            <CardBody>
              {isExpired ? (
                <Alert status="warning" variant="subtle">
                  <Text fontSize="sm">
                    ⚠️ QC window telah kedaluwarsa. Barang dianggap ACCEPTED secara otomatis.
                  </Text>
                </Alert>
              ) : (
                <Text fontSize="xs" color={textSecondary}>
                  QC harus diselesaikan dalam 24 jam setelah barang diterima. Setelah waktu habis, barang dianggap ACCEPTED secara otomatis.
                </Text>
              )}
            </CardBody>
          </Card>

          {/* Order Info */}
          <Card variant="elevated">
            <CardHeader>
              <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                Informasi Order
              </Text>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                <Box>
                  <Text fontSize="xs" color={textSecondary}>Order ID</Text>
                  <Text fontSize="sm" fontWeight="medium" color={textPrimary}>{qcData.orderId}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color={textSecondary}>Item Type</Text>
                  <Text fontSize="sm" fontWeight="medium" color={textPrimary}>{qcData.itemType}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color={textSecondary}>Total Quantity</Text>
                  <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                    {qcData.totalQuantity.toLocaleString('id-ID')} {qcData.itemType === 'bibit' ? 'ekor' : 'unit'}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color={textSecondary}>Nilai Order</Text>
                  <Text fontSize="sm" fontWeight="medium" color="brand.600">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(qcData.orderValue)}
                  </Text>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* QC Form */}
          <QCForm
            data={qcData}
            onChange={(data) => setQcData((prev) => ({ ...prev, ...data }))}
            onSubmit={handleSubmit}
          />
        </VStack>
      </Container>
    </>
  );
}

