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
import { FiArrowLeft, FiFileText, FiCheck } from 'react-icons/fi';

/**
 * Quotation Page - View & compare quotations
 */
export function QuotationPage() {
  // All hooks must be called before conditional returns
  const navigate = useNavigate();
  const { id: rfqId } = useParams<{ id: string }>();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const brand600 = useColorModeValue('brand.600', 'brand.400');
  const blue50 = useColorModeValue('blue.50', 'blue.900');
  const blue200 = useColorModeValue('blue.200', 'blue.700');
  const blue700 = useColorModeValue('blue.700', 'blue.300');

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [selectedQuotations, setSelectedQuotations] = useState<string[]>([]); // Multi-select
  const [showComparison, setShowComparison] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'single' | 'multi'>('multi'); // Default multi-select

  useEffect(() => {
    // Load quotations for this RFQ
    const rfqQuotations = mockQuotations.filter((q) => q.rfqId === rfqId || q.rfqId === 'rfq1');
    setQuotations(rfqQuotations);
  }, [rfqId]);

  const handleSelect = (quotationId: string) => {
    if (selectionMode === 'single') {
      // Single select mode (legacy)
      setSelectedQuotations([quotationId]);
      setShowComparison(false);
    } else {
      // Multi-select mode
      setSelectedQuotations((prev) => {
        if (prev.includes(quotationId)) {
          return prev.filter((id) => id !== quotationId);
        } else {
          return [...prev, quotationId];
        }
      });
    }
  };

  const handlePriceLock = (quotationId: string) => {
    // Simulate price-lock
    setQuotations((prev) =>
      prev.map((q) => (q.id === quotationId ? { ...q, priceLocked: true } : q))
    );
    // Add to selection if not already selected
    if (!selectedQuotations.includes(quotationId)) {
      setSelectedQuotations((prev) => [...prev, quotationId]);
    }
  };

  const handleContinueToReview = () => {
    if (selectedQuotations.length > 0) {
      navigate(`/rfq/${rfqId}/quotation/review`, {
        state: {
          selectedQuotationIds: selectedQuotations,
          quotations: quotations.filter((q) => selectedQuotations.includes(q.id)),
        },
      });
    }
  };

  const handleContinueToContract = () => {
    // Legacy: single select to contract
    if (selectedQuotations.length === 1) {
      navigate(`/contract/${selectedQuotations[0]}`);
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
                {selectedQuotations.length > 0 && (
                  <Text as="span" fontWeight="semibold" color={brand600}>
                    {' '}• {selectedQuotations.length} dipilih
                  </Text>
                )}
              </Text>
            </VStack>
            <HStack gap={2}>
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
              <Button
                variant={selectionMode === 'multi' ? 'solid' : 'outline'}
                size="sm"
                colorScheme="brand"
                onClick={() => setSelectionMode(selectionMode === 'multi' ? 'single' : 'multi')}
              >
                {selectionMode === 'multi' ? 'Multi-Select' : 'Single Select'}
              </Button>
            </HStack>
          </HStack>

          {/* Comparison View */}
          {showComparison && quotations.length > 1 && (
            <QuotationComparison quotations={quotations} onSelect={handleSelect} />
          )}

          {/* Info Box for Multi-Select */}
          {selectionMode === 'multi' && (
            <Box
              p={3}
              borderRadius="lg"
              bg={blue50}
              border="1px solid"
              borderColor={blue200}
            >
              <Text fontSize="sm" color={blue700}>
                💡 <strong>Mode Multi-Select:</strong> Pilih beberapa supplier untuk membandingkan atau membeli dari beberapa sumber sekaligus. Setelah memilih, klik "Review Pilihan" untuk melanjutkan.
              </Text>
            </Box>
          )}

          {/* Individual Cards */}
          {!showComparison && (
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
              {quotations.map((quotation) => (
                <QuotationCard
                  key={quotation.id}
                  quotation={quotation}
                  isSelected={selectedQuotations.includes(quotation.id)}
                  onSelect={handleSelect}
                  onPriceLock={handlePriceLock}
                  selectionMode={selectionMode}
                />
              ))}
            </SimpleGrid>
          )}

          {/* Continue Button */}
          {selectedQuotations.length > 0 && (
            <HStack justify="flex-end" gap={3}>
              {selectionMode === 'multi' && selectedQuotations.length > 1 ? (
                <Button
                  variant="solid"
                  colorScheme="brand"
                  size="lg"
                  onClick={handleContinueToReview}
                >
                  Review Pilihan ({selectedQuotations.length} supplier)
                </Button>
              ) : selectedQuotations.length === 1 ? (
                <Button
                  variant="solid"
                  colorScheme="brand"
                  size="lg"
                  onClick={handleContinueToContract}
                >
                  Lanjutkan ke Kontrak
                </Button>
              ) : null}
            </HStack>
          )}
        </VStack>
      </Container>
    </>
  );
}

