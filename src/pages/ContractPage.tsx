import { Container, VStack, HStack, Heading, Text, Box } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Button } from '../components/button/Button';
import { useColorModeValue } from '../components/ui/color-mode';
import { ContractMini, type ContractTerms } from '../components/contract/ContractMini';
import { calculateValidityPeriod } from '../utils/rfq/priceModel';
import { FiArrowLeft } from 'react-icons/fi';

/**
 * Contract Page - View contract details
 */
export function ContractPage() {
  const navigate = useNavigate();
  const { id: contractId } = useParams<{ id: string }>();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  // Mock contract data - in real app, fetch from API
  const contractData = {
    contractId: contractId || 'CTR-001',
    supplierName: 'Peternakan Ikan Lele Sumber Rezeki',
    buyerName: 'User Demo',
    item: {
      name: 'Bibit Lele',
      specification: 'Size 7-9',
    },
    quantity: 5000,
    unitPrice: 300,
    totalPrice: 5000 * 300 + 200000,
    shippingCost: 200000,
    terms: {
      priceModel: {
        model: 'spot' as const,
        basePrice: 300,
        validityDays: 5,
        ...calculateValidityPeriod('spot', 5),
      },
      volume: {
        min: 5000,
        max: 5000,
        unit: 'ekor',
      },
      sla: {
        deliveryTime: 36,
        tolerance: 12,
      },
      qualityTolerance: {
        mortalityMax: 3,
        sizeTolerance: 5,
      },
      penaltyRules: {
        lateDelivery: 2,
        qualityIssue: 5,
      },
      cancellationRules: {
        buyerCancellationFee: 10,
        supplierCancellationFee: 15,
      },
    },
    createdAt: new Date(),
  };

  const handleDownloadPDF = () => {
    // Mock PDF download - in real app, generate PDF
    console.log('Downloading contract PDF:', contractId);
    alert('Fitur download PDF akan tersedia setelah backend integration');
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
                Kontrak Mini
              </Heading>
              <Text fontSize="md" color={textSecondary}>
                Detail kontrak dan syarat kesepakatan
              </Text>
            </VStack>
          </HStack>

          {/* Contract */}
          <ContractMini
            {...contractData}
            onDownloadPDF={handleDownloadPDF}
          />

          {/* Actions */}
          <HStack justify="flex-end" gap={4}>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Tutup
            </Button>
            <Button
              variant="solid"
              colorScheme="brand"
              onClick={() => {
                // Navigate to order/escrow page
                navigate('/dashboard');
              }}
            >
              Lanjutkan ke Pembayaran
            </Button>
          </HStack>
        </VStack>
      </Container>
    </>
  );
}

