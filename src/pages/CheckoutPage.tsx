/**
 * Checkout Page - Halaman checkout untuk marketplace purchase
 * Flow: Review order → Escrow info → Payment → Create order
 */

import { Container, VStack, HStack, Heading, Text, Box, SimpleGrid, Button, Input, Textarea } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { Card, CardHeader, CardBody, CardFooter } from '../components/surfaces/Card';
import { useColorModeValue } from '../components/ui/color-mode';
import { Button as CustomButton } from '../components/button/Button';
import { Alert } from '../components/feedback/Alert';
import { usePurchaseStore } from '../store/purchaseStore';
import { FiArrowLeft, FiShoppingCart, FiCheckCircle, FiLock, FiTruck, FiShield } from 'react-icons/fi';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';

export function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createOrder, currentPurchase, setCurrentPurchase } = usePurchaseStore();
  
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Get data from location.state or currentPurchase store
  const stateData = location.state as {
    supplier?: any;
    purchaseSpec?: any;
    projectId?: string;
  } | null;

  const supplier = stateData?.supplier || currentPurchase?.supplier;
  const purchaseSpec = stateData?.purchaseSpec || currentPurchase?.purchaseSpec;
  const projectId = stateData?.projectId || currentPurchase?.projectId;

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no supplier or purchaseSpec, redirect back
    if (!supplier || !purchaseSpec) {
      navigate('/dashboard');
      return;
    }

    // Save to store if coming from location.state
    if (stateData) {
      setCurrentPurchase({
        supplier,
        purchaseSpec,
        projectId,
        source: 'plan-detail',
      });
    }
  }, [supplier, purchaseSpec, stateData, navigate, setCurrentPurchase, projectId]);

  if (!supplier || !purchaseSpec) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Calculate prices
  const unitPrice = supplier.priceRange.min; // Use min price for estimate
  const subtotal = purchaseSpec.quantity * unitPrice;
  const shippingCost = 200000; // Fixed shipping cost (dummy)
  const finalTotal = subtotal + shippingCost;

  const handleCheckout = async () => {
    if (!deliveryAddress.trim()) {
      setError('Alamat pengiriman wajib diisi');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create order
      const order = createOrder({
        orderType: 'marketplace',
        items: [
          {
            supplierId: supplier.id,
            supplierName: supplier.name,
            itemType: supplier.type,
            quantity: purchaseSpec.quantity,
            unitPrice,
            totalPrice: subtotal,
            unit: supplier.priceRange.unit,
          },
        ],
        totalAmount: subtotal,
        shippingCost,
        purchaseSpec,
        supplier,
        projectId,
      });

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to order tracking
      navigate(`/order/${order.id}`, {
        state: {
          orderId: order.id,
          justCreated: true,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat proses checkout');
      setIsProcessing(false);
    }
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Plan Detail', href: projectId ? `/plan-detail/${projectId}` : '/dashboard' },
    { label: 'Checkout', href: '/checkout' },
  ];

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Supplier', href: '/suppliers' },
        ]}
        cta={{ label: 'Dashboard', href: '/dashboard' }}
      />
      <Container maxW="5xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Header */}
          <HStack gap={4}>
            <CustomButton
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              leftIcon={<FiArrowLeft />}
            >
              Kembali
            </CustomButton>
            <VStack align="start" gap={1} flex={1}>
              <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                Checkout
              </Heading>
              <Text fontSize="md" color={textSecondary}>
                Review pesanan Anda sebelum melanjutkan pembayaran
              </Text>
            </VStack>
          </HStack>

          {/* Error Alert */}
          {error && (
            <Alert
              status="error"
              variant="subtle"
              title={error}
            />
          )}

          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
            {/* Order Summary */}
            <Box gridColumn={{ base: '1', lg: '1 / 3' }}>
              <VStack align="stretch" gap={6}>
                {/* Supplier Info */}
                <Card variant="elevated">
                  <CardHeader>
                    <HStack gap={2}>
                      <Box
                        p={2}
                        borderRadius="lg"
                        bg={useColorModeValue('brand.100', 'brand.900')}
                        color={useColorModeValue('brand.600', 'brand.300')}
                      >
                        <FiShoppingCart size={18} />
                      </Box>
                      <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                        Detail Pesanan
                      </Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" gap={4}>
                      <Box>
                        <Text fontSize="sm" color={textSecondary} mb={1}>
                          Supplier
                        </Text>
                        <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                          {supplier.name}
                        </Text>
                        <Text fontSize="xs" color={textSecondary}>
                          {supplier.location}
                        </Text>
                      </Box>

                      <Box>
                        <Text fontSize="sm" color={textSecondary} mb={1}>
                          Item
                        </Text>
                        <Text fontSize="md" fontWeight="medium" color={textPrimary}>
                          {supplier.type === 'pakan' ? 'Pakan' : supplier.type === 'benih' ? 'Benih Ikan' : 'Peralatan'}
                        </Text>
                      </Box>

                      <Box>
                        <Text fontSize="sm" color={textSecondary} mb={1}>
                          Quantity
                        </Text>
                        <Text fontSize="md" fontWeight="medium" color={textPrimary}>
                          {purchaseSpec.quantity.toLocaleString('id-ID')} {supplier.priceRange.unit}
                        </Text>
                      </Box>

                      <Box>
                        <Text fontSize="sm" color={textSecondary} mb={1}>
                          Harga per Unit
                        </Text>
                        <Text fontSize="md" fontWeight="medium" color={textPrimary}>
                          {formatCurrency(unitPrice)} / {supplier.priceRange.unit}
                        </Text>
                      </Box>

                      {purchaseSpec.tanggalButuh && (
                        <Box>
                          <Text fontSize="sm" color={textSecondary} mb={1}>
                            Tanggal Butuh
                          </Text>
                          <Text fontSize="md" fontWeight="medium" color={textPrimary}>
                            {new Date(purchaseSpec.tanggalButuh).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  </CardBody>
                </Card>

                {/* Delivery Address */}
                <Card variant="elevated">
                  <CardHeader>
                    <HStack gap={2}>
                      <FiTruck size={18} color={useColorModeValue('brand.600', 'brand.400')} />
                      <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                        Alamat Pengiriman
                      </Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" gap={3}>
                      <Textarea
                        placeholder="Masukkan alamat lengkap pengiriman"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        rows={4}
                        required
                      />
                      {!deliveryAddress.trim() && (
                        <Text fontSize="xs" color="red.500">
                          Alamat pengiriman wajib diisi
                        </Text>
                      )}
                    </VStack>
                  </CardBody>
                </Card>

                {/* Notes */}
                <Card variant="elevated">
                  <CardHeader>
                    <Heading fontSize="md" fontWeight="semibold" color={textPrimary}>
                      Catatan (Opsional)
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <Textarea
                      placeholder="Tambahkan catatan untuk supplier jika diperlukan"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </CardBody>
                </Card>
              </VStack>
            </Box>

            {/* Payment Summary */}
            <Box>
              <Card variant="elevated" position="sticky" top={4}>
                <CardHeader>
                  <HStack gap={2}>
                    <FiLock size={18} color={useColorModeValue('brand.600', 'brand.400')} />
                    <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                      Ringkasan Pembayaran
                    </Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" gap={3}>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color={textSecondary}>
                        Subtotal
                      </Text>
                      <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                        {formatCurrency(subtotal)}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color={textSecondary}>
                        Biaya Pengiriman
                      </Text>
                      <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                        {formatCurrency(shippingCost)}
                      </Text>
                    </HStack>
                    <Box
                      pt={3}
                      borderTop="1px solid"
                      borderColor={borderColor}
                    >
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
                    {/* Escrow Info */}
                    <Box
                      p={3}
                      borderRadius="md"
                      bg={useColorModeValue('blue.50', 'blue.900')}
                      border="1px solid"
                      borderColor={useColorModeValue('blue.200', 'blue.700')}
                    >
                      <HStack gap={2} mb={2}>
                        <FiShield size={14} color={useColorModeValue('blue.600', 'blue.300')} />
                        <Text fontSize="xs" fontWeight="semibold" color={useColorModeValue('blue.700', 'blue.300')}>
                          Pembayaran Aman dengan Escrow
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color={useColorModeValue('blue.700', 'blue.300')}>
                        Uang Anda akan ditahan sampai barang diterima dan lulus QC. Jika ada masalah, uang akan dikembalikan.
                      </Text>
                    </Box>

                    <CustomButton
                      variant="solid"
                      colorScheme="brand"
                      size="lg"
                      w="full"
                      onClick={handleCheckout}
                      loading={isProcessing}
                      loadingText="Memproses..."
                      disabled={!deliveryAddress.trim() || isProcessing}
                      leftIcon={<FiCheckCircle />}
                    >
                      Bayar dengan Escrow
                    </CustomButton>

                    <Text fontSize="xs" color={textSecondary} textAlign="center">
                      Dengan melanjutkan, Anda menyetujui syarat dan ketentuan pembayaran
                    </Text>
                  </VStack>
                </CardFooter>
              </Card>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </>
  );
}


