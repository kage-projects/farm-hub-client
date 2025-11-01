/**
 * Supplier Selection Review Page
 * Halaman untuk review dan finalisasi pemilihan multiple suppliers setelah RFQ
 */

import { Container, VStack, HStack, Heading, Text, Box, SimpleGrid, Button } from '@chakra-ui/react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { Card, CardHeader, CardBody, CardFooter } from '../components/surfaces/Card';
import { useColorModeValue } from '../components/ui/color-mode';
import { Button as CustomButton } from '../components/button/Button';
import { Alert } from '../components/feedback/Alert';
import { usePurchaseStore } from '../store/purchaseStore';
import type { Quotation } from '../data/mockQuotations';
import { FiArrowLeft, FiCheckCircle, FiShoppingCart, FiFileText, FiPackage } from 'react-icons/fi';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';
import { Badge } from '@chakra-ui/react';

export function SupplierSelectionReviewPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const location = useLocation();
  const { createOrder } = usePurchaseStore();

  const rfqId = params.id || '';
  
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Get selected quotations from location.state
  const stateData = location.state as {
    selectedQuotationIds?: string[];
    quotations?: Quotation[];
  } | null;

  const [selectedQuotations, setSelectedQuotations] = useState<Quotation[]>(
    stateData?.quotations || []
  );

  const [processingOrders, setProcessingOrders] = useState<string[]>([]);
  const [completedOrders, setCompletedOrders] = useState<string[]>([]);

  if (selectedQuotations.length === 0) {
    return (
      <>
        <Navbar
          brandName="FarmHub Analytics"
          links={[{ label: 'Dashboard', href: '/dashboard' }]}
          cta={{ label: 'Dashboard', href: '/dashboard' }}
        />
        <Container maxW="5xl" py={8}>
          <VStack gap={6} align="stretch">
            <Alert
              status="error"
              variant="subtle"
              title="Tidak ada supplier yang dipilih"
              description="Silakan kembali ke halaman quotation untuk memilih supplier."
            />
            <CustomButton
              variant="outline"
              onClick={() => navigate(`/rfq/${rfqId}/quotation`)}
            >
              Kembali ke Penawaran
            </CustomButton>
          </VStack>
        </Container>
      </>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalAmount = selectedQuotations.reduce((sum, q) => sum + q.totalPrice, 0);
  const totalShipping = selectedQuotations.reduce((sum, q) => sum + q.shippingCost, 0);
  const finalTotal = totalAmount + totalShipping;

  // Group by supplier category
  const groupedByCategory = selectedQuotations.reduce((acc, quotation) => {
    const category = quotation.item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(quotation);
    return acc;
  }, {} as Record<string, Quotation[]>);

  const handleCreateOrders = async () => {
    setProcessingOrders(selectedQuotations.map((q) => q.id));

    // Create orders for each selected quotation
    const orderIds: string[] = [];
    
    for (const quotation of selectedQuotations) {
      try {
        // Map quotation to supplier format
        const supplier = {
          id: quotation.supplierId,
          name: quotation.supplierName,
          type: quotation.item.category === 'bibit' ? 'benih' : 
                quotation.item.category === 'pakan' ? 'pakan' : 
                'peralatan' as const,
          rating: 4.5, // Default rating
          responseTime: `${quotation.sla.deliveryTime} jam`,
          priceRange: {
            min: quotation.unitPrice,
            max: quotation.unitPrice,
            unit: quotation.item.category === 'bibit' ? 'per ekor' : 'per kg',
          },
          location: 'Unknown', // Default location
          verified: true,
          sla: `${quotation.sla.deliveryTime} jam`,
        };

        const order = createOrder({
          orderType: 'rfq',
          items: [
            {
              supplierId: quotation.supplierId,
              supplierName: quotation.supplierName,
              itemType: supplier.type,
              quantity: quotation.quantity,
              unitPrice: quotation.unitPrice,
              totalPrice: quotation.totalPrice - quotation.shippingCost,
              unit: quotation.item.category === 'bibit' ? 'ekor' : 'kg',
            },
          ],
          totalAmount: quotation.totalPrice - quotation.shippingCost,
          shippingCost: quotation.shippingCost,
          supplier,
          rfqId: quotation.rfqId,
          contractId: quotation.id, // Use quotation ID as contract reference
        });

        orderIds.push(order.id);
      } catch (err) {
        console.error('Error creating order for quotation:', quotation.id, err);
      }
    }

    setCompletedOrders(orderIds);
    setProcessingOrders([]);

    // Navigate to first order tracking or show success
    if (orderIds.length > 0) {
      if (orderIds.length === 1) {
        navigate(`/order/${orderIds[0]}`);
      } else {
        // Multiple orders - navigate to dashboard or show summary
        navigate('/dashboard', {
          state: {
            message: `Berhasil membuat ${orderIds.length} pesanan dari ${selectedQuotations.length} supplier`,
            orderIds,
          },
        });
      }
    }
  };

  const handleRemoveSupplier = (quotationId: string) => {
    setSelectedQuotations((prev) => prev.filter((q) => q.id !== quotationId));
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Buat RFQ', href: '/rfq' },
    { label: 'Penawaran', href: `/rfq/${rfqId}/quotation` },
    { label: 'Review Pilihan', href: `/rfq/${rfqId}/quotation/review` },
  ];

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'RFQ', href: '/rfq' },
        ]}
        cta={{ label: 'Dashboard', href: '/dashboard' }}
      />
      <Container maxW="7xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Header */}
          <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
            <VStack align="start" gap={2} flex={1}>
              <HStack gap={3}>
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/rfq/${rfqId}/quotation`)}
                  leftIcon={<FiArrowLeft />}
                >
                  Kembali
                </CustomButton>
              </HStack>
              <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                Review Pilihan Supplier
              </Heading>
              <Text fontSize="md" color={textSecondary}>
                Review dan finalisasi pemilihan {selectedQuotations.length} supplier yang telah dipilih
              </Text>
            </VStack>
          </HStack>

          {/* Summary Card */}
          <Card variant="elevated">
            <CardHeader>
              <HStack gap={2}>
                <Box
                  p={2}
                  borderRadius="lg"
                  bg={useColorModeValue('brand.100', 'brand.900')}
                  color={useColorModeValue('brand.600', 'brand.400')}
                >
                  <FiShoppingCart size={18} />
                </Box>
                <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                  Ringkasan Pemesanan
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                <Box>
                  <Text fontSize="sm" color={textSecondary} mb={1}>
                    Total Supplier
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color={textPrimary}>
                    {selectedQuotations.length}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color={textSecondary} mb={1}>
                    Total Item
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color={textPrimary}>
                    {selectedQuotations.reduce((sum, q) => sum + q.quantity, 0).toLocaleString('id-ID')}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color={textSecondary} mb={1}>
                    Total Pembayaran
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color={useColorModeValue('brand.600', 'brand.400')}>
                    {formatCurrency(finalTotal)}
                  </Text>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Selected Suppliers by Category */}
          {Object.entries(groupedByCategory).map(([category, quotations]) => {
            const categoryLabels: Record<string, string> = {
              bibit: 'Benih Ikan',
              pakan: 'Pakan',
              obat: 'Obat',
              logistik: 'Peralatan',
            };

            return (
              <Card key={category} variant="elevated">
                <CardHeader>
                  <HStack gap={2}>
                    <Box
                      p={2}
                      borderRadius="lg"
                      bg={useColorModeValue(`${category === 'bibit' ? 'green' : category === 'pakan' ? 'blue' : 'orange'}.100`, `${category === 'bibit' ? 'green' : category === 'pakan' ? 'blue' : 'orange'}.900`)}
                      color={useColorModeValue(`${category === 'bibit' ? 'green' : category === 'pakan' ? 'blue' : 'orange'}.600`, `${category === 'bibit' ? 'green' : category === 'pakan' ? 'blue' : 'orange'}.300`)}
                    >
                      <FiPackage size={18} />
                    </Box>
                    <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                      {categoryLabels[category] || category}
                    </Heading>
                    <Badge colorScheme="brand" variant="subtle">
                      {quotations.length} Supplier
                    </Badge>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    {quotations.map((quotation) => (
                      <Card
                        key={quotation.id}
                        variant="subtle"
                        border="1px solid"
                        borderColor={borderColor}
                        p={4}
                      >
                        <VStack align="stretch" gap={3}>
                          <HStack justify="space-between" align="start">
                            <VStack align="start" gap={1} flex={1}>
                              <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                                {quotation.supplierName}
                              </Text>
                              <Text fontSize="sm" color={textSecondary}>
                                {quotation.item.name} - {quotation.item.specification || 'Standard'}
                              </Text>
                            </VStack>
                            <CustomButton
                              variant="ghost"
                              size="xs"
                              colorScheme="red"
                              onClick={() => handleRemoveSupplier(quotation.id)}
                            >
                              Hapus
                            </CustomButton>
                          </HStack>

                          <Box
                            p={3}
                            borderRadius="md"
                            bg={useColorModeValue('gray.50', 'gray.800')}
                          >
                            <SimpleGrid columns={2} gap={2}>
                              <Box>
                                <Text fontSize="xs" color={textSecondary}>Quantity</Text>
                                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                                  {quotation.quantity.toLocaleString('id-ID')} {quotation.item.category === 'bibit' ? 'ekor' : 'kg'}
                                </Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color={textSecondary}>Harga Unit</Text>
                                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                                  {formatCurrency(quotation.unitPrice)}
                                </Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color={textSecondary}>Ongkir</Text>
                                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                                  {formatCurrency(quotation.shippingCost)}
                                </Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color={textSecondary}>Total</Text>
                                <Text fontSize="sm" fontWeight="bold" color={useColorModeValue('brand.600', 'brand.400')}>
                                  {formatCurrency(quotation.totalPrice)}
                                </Text>
                              </Box>
                            </SimpleGrid>
                          </Box>

                          <Box>
                            <Text fontSize="xs" color={textSecondary} mb={1}>
                              Estimasi Pengiriman
                            </Text>
                            <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                              {quotation.sla.deliveryTime} jam ({quotation.sla.minDeliveryTime}-{quotation.sla.maxDeliveryTime} jam)
                            </Text>
                          </Box>
                        </VStack>
                      </Card>
                    ))}
                  </SimpleGrid>
                </CardBody>
              </Card>
            );
          })}

          {/* Payment Summary */}
          <Card variant="elevated">
            <CardHeader>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Ringkasan Pembayaran
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" gap={3}>
                {selectedQuotations.map((quotation) => (
                  <HStack key={quotation.id} justify="space-between">
                    <Text fontSize="sm" color={textSecondary}>
                      {quotation.supplierName}
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                      {formatCurrency(quotation.totalPrice)}
                    </Text>
                  </HStack>
                ))}
                <Box pt={3} borderTop="1px solid" borderColor={borderColor}>
                  <HStack justify="space-between">
                    <Text fontSize="md" fontWeight="bold" color={textPrimary}>
                      Total Pembayaran
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color={useColorModeValue('brand.600', 'brand.400')}>
                      {formatCurrency(finalTotal)}
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            </CardBody>
            <CardFooter>
              <VStack align="stretch" gap={3} w="full">
                <Box
                  p={3}
                  borderRadius="md"
                  bg={useColorModeValue('blue.50', 'blue.900')}
                  border="1px solid"
                  borderColor={useColorModeValue('blue.200', 'blue.700')}
                >
                  <HStack gap={2} mb={2}>
                    <FiFileText size={14} color={useColorModeValue('blue.600', 'blue.300')} />
                    <Text fontSize="xs" fontWeight="semibold" color={useColorModeValue('blue.700', 'blue.300')}>
                      Informasi Penting
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color={useColorModeValue('blue.700', 'blue.300')}>
                    • Setiap supplier akan memiliki kontrak terpisah
                    <br />
                    • Pembayaran akan dilakukan dengan escrow untuk setiap order
                    <br />
                    • Anda akan menerima {selectedQuotations.length} order terpisah yang dapat dilacak secara individual
                  </Text>
                </Box>

                <HStack gap={3} w="full">
                  <CustomButton
                    variant="outline"
                    flex={1}
                    onClick={() => navigate(`/rfq/${rfqId}/quotation`)}
                    disabled={processingOrders.length > 0}
                  >
                    Ubah Pilihan
                  </CustomButton>
                  <CustomButton
                    variant="solid"
                    colorScheme="brand"
                    flex={1}
                    onClick={handleCreateOrders}
                    disabled={processingOrders.length > 0 || selectedQuotations.length === 0}
                    leftIcon={processingOrders.length === 0 ? <FiCheckCircle /> : undefined}
                  >
                    {processingOrders.length > 0
                      ? `Memproses ${processingOrders.length} pesanan...`
                      : `Buat ${selectedQuotations.length} Pesanan`}
                  </CustomButton>
                </HStack>
              </VStack>
            </CardFooter>
          </Card>
        </VStack>
      </Container>
    </>
  );
}

