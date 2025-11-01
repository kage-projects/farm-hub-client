import { Container, VStack, HStack, Heading, Text, Box, SimpleGrid } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { Button } from '../components/button/Button';
import { useColorModeValue } from '../components/ui/color-mode';
import { QuotationCard } from '../components/rfq/QuotationCard';
import { QuotationComparison } from '../components/rfq/QuotationComparison';
import { mockQuotations } from '../data/mockQuotations';
import type { Quotation } from '../data/mockQuotations';
import { FiArrowLeft, FiFileText } from 'react-icons/fi';

/**
 * Quotation Page - View & compare quotations
 */
export function QuotationPage() {
  const navigate = useNavigate();
  const { id: rfqId } = useParams<{ id: string }>();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [selectedQuotation, setSelectedQuotation] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    // Load quotations for this RFQ
    const rfqQuotations = mockQuotations.filter((q) => q.rfqId === rfqId || q.rfqId === 'rfq1');
    setQuotations(rfqQuotations);
  }, [rfqId]);

  const handleSelect = (quotationId: string) => {
    setSelectedQuotation(quotationId);
    setShowComparison(false);
  };

  const handlePriceLock = (quotationId: string) => {
    // Simulate price-lock
    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, priceLocked: true } : q))
    );
    setSelectedQuotation(quotationId);
  };

  const handleContinueToContract = () => {
    if (selectedQuotation) {
      navigate(`/contract/${selectedQuotation}`);
    }
  };

  if (quotations.length === 0) {
    return (
      <>
        <Navbar
          brandName="FarmHub Analytics"
          links={[{ label: 'Dashboard', href: '/dashboard' }]}
          cta={{ label: 'Dashboard', href: '/dashboard' }}
        />
        <Container maxW="4xl" py={8}>
          <VStack gap={4} align="stretch">
            <Box textAlign="center" py={12}>
              <Text fontSize="lg" color={textSecondary} mb={4}>
                Belum ada penawaran yang diterima
              </Text>
              <Button
                variant="outline"
                onClick={() => navigate('/rfq')}
              >
                Buat RFQ Baru
              </Button>
            </Box>
          </VStack>
        </Container>
      </>
    );
  }

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
          <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
            <VStack align="start" gap={1} flex={1}>
              <HStack gap={2}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/rfq')}
                  leftIcon={<FiArrowLeft />}
                >
                  Kembali
                </Button>
              </HStack>
              <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                Penawaran Harga
              </Heading>
              <Text fontSize="md" color={textSecondary}>
                {quotations.length} penawaran diterima untuk RFQ Anda
              </Text>
            </VStack>
            {quotations.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparison(!showComparison)}
                leftIcon={<FiFileText />}
              >
                {showComparison ? 'Sembunyikan' : 'Bandingkan'} Penawaran
              </Button>
            )}
          </HStack>

          {/* Comparison View */}
          {showComparison && quotations.length > 1 && (
            <QuotationComparison quotations={quotations} onSelect={handleSelect} />
          )}

          {/* Individual Cards */}
          {!showComparison && (
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
              {quotations.map((quotation) => (
                <QuotationCard
                  key={quotation.id}
                  quotation={quotation}
                  isSelected={selectedQuotation === quotation.id}
                  onSelect={handleSelect}
                  onPriceLock={handlePriceLock}
                />
              ))}
            </SimpleGrid>
          )}

          {/* Continue Button */}
          {selectedQuotation && (
            <HStack justify="flex-end">
              <Button
                variant="solid"
                colorScheme="brand"
                size="lg"
                onClick={handleContinueToContract}
              >
                Lanjutkan ke Kontrak
              </Button>
            </HStack>
          )}
        </VStack>
      </Container>
    </>
  );
}

