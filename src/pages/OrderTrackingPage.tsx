/**
 * Order Tracking Page - Halaman tracking status order
 * Menampilkan status order dari pembayaran hingga QC dan complete
 */

import { Container, VStack, HStack, Heading, Text, Box, SimpleGrid, Button, Badge } from '@chakra-ui/react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { Card, CardHeader, CardBody } from '../components/surfaces/Card';
import { useColorModeValue } from '../components/ui/color-mode';
import { Button as CustomButton } from '../components/button/Button';
import { Alert } from '../components/feedback/Alert';
import { usePurchaseStore } from '../store/purchaseStore';
import { FiArrowLeft, FiPackage, FiCheckCircle, FiClock, FiTruck, FiShield, FiFileText, FiRefreshCw } from 'react-icons/fi';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';

interface OrderStatusStep {
  status: string;
  label: string;
  icon: any;
  completed: boolean;
  current: boolean;
  description?: string;
}

export function OrderTrackingPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const location = useLocation();
  const { getOrder, updateOrderStatus } = usePurchaseStore();

  // All hooks must be called at top level
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const green500 = useColorModeValue('green.500', 'green.400');
  const brand500 = useColorModeValue('brand.500', 'brand.400');
  const gray300 = useColorModeValue('gray.300', 'gray.600');
  const green100 = useColorModeValue('green.100', 'green.900');
  const brand100 = useColorModeValue('brand.100', 'brand.900');
  const gray100 = useColorModeValue('gray.100', 'gray.800');
  const green50 = useColorModeValue('green.50', 'green.900');
  const green200 = useColorModeValue('green.200', 'green.700');
  const green600 = useColorModeValue('green.600', 'green.300');
  const green700 = useColorModeValue('green.700', 'green.300');
  const gray50 = useColorModeValue('gray.50', 'gray.800');
  const brand600 = useColorModeValue('brand.600', 'brand.400');
  const blue50 = useColorModeValue('blue.50', 'blue.900');
  const blue200 = useColorModeValue('blue.200', 'blue.700');
  const blue600 = useColorModeValue('blue.600', 'blue.300');
  const blue700 = useColorModeValue('blue.700', 'blue.300');

  const orderId = params.id;
  const order = orderId ? getOrder(orderId) : undefined;

  const [justCreated] = useState(
    (location.state as { justCreated?: boolean })?.justCreated || false
  );

  useEffect(() => {
    if (justCreated && order) {
      // Auto-update status to 'paid' after checkout
      updateOrderStatus(orderId!, 'paid');
    }
  }, [justCreated, order, orderId, updateOrderStatus]);

  if (!orderId || !order) {
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
              title="Order tidak ditemukan"
              description="Order dengan ID tersebut tidak ditemukan."
            />
            <CustomButton
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Kembali ke Dashboard
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

  // Define order status steps
  const statusSteps: OrderStatusStep[] = [
    {
      status: 'pending',
      label: 'Menunggu Pembayaran',
      icon: FiClock,
      completed: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'qc_pending', 'completed'].includes(order.status),
      current: order.status === 'pending',
    },
    {
      status: 'paid',
      label: 'Pembayaran Diterima',
      icon: FiCheckCircle,
      completed: ['paid', 'processing', 'shipped', 'delivered', 'qc_pending', 'completed'].includes(order.status),
      current: order.status === 'paid',
      description: 'Pembayaran sudah diterima dan masuk ke escrow',
    },
    {
      status: 'processing',
      label: 'Sedang Diproses',
      icon: FiPackage,
      completed: ['processing', 'shipped', 'delivered', 'qc_pending', 'completed'].includes(order.status),
      current: order.status === 'processing',
      description: 'Supplier sedang menyiapkan pesanan',
    },
    {
      status: 'shipped',
      label: 'Sedang Dikirim',
      icon: FiTruck,
      completed: ['shipped', 'delivered', 'qc_pending', 'completed'].includes(order.status),
      current: order.status === 'shipped',
      description: order.trackingNumber ? `No. Resi: ${order.trackingNumber}` : 'Pesanan sedang dalam perjalanan',
    },
    {
      status: 'delivered',
      label: 'Barang Diterima',
      icon: FiPackage,
      completed: ['delivered', 'qc_pending', 'completed'].includes(order.status),
      current: order.status === 'delivered',
      description: 'Barang sudah sampai. Lakukan QC dalam 24 jam',
    },
    {
      status: 'qc_pending',
      label: 'Menunggu QC',
      icon: FiShield,
      completed: ['qc_pending', 'completed'].includes(order.status),
      current: order.status === 'qc_pending',
      description: 'Tunggu hasil quality check',
    },
    {
      status: 'completed',
      label: 'Selesai',
      icon: FiCheckCircle,
      completed: order.status === 'completed',
      current: order.status === 'completed',
      description: 'Order selesai, pembayaran sudah diteruskan ke supplier',
    },
  ];

  const getStatusColor = (step: OrderStatusStep) => {
    if (step.completed) {
      return green500;
    }
    if (step.current) {
      return brand500;
    }
    return gray300;
  };

  const getStatusBadgeColor = (status: string): 'green' | 'blue' | 'orange' | 'gray' | 'red' => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'paid':
      case 'processing':
      case 'shipped':
        return 'blue';
      case 'delivered':
      case 'qc_pending':
        return 'orange';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleGoToQC = () => {
    if (order.status === 'delivered' || order.status === 'qc_pending') {
      navigate(`/qc/${orderId}`);
    }
  };

  const handleUpdateStatus = (newStatus: typeof order.status) => {
    updateOrderStatus(orderId, newStatus);
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Order Tracking', href: `/order/${orderId}` },
  ];

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Orders', href: '/dashboard' },
        ]}
        cta={{ label: 'Dashboard', href: '/dashboard' }}
      />
      <Container maxW="5xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Header */}
          <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
            <VStack align="start" gap={1} flex={1}>
              <HStack gap={3}>
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  leftIcon={<FiArrowLeft />}
                >
                  Kembali
                </CustomButton>
              </HStack>
              <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                Order #{orderId.slice(-8).toUpperCase()}
              </Heading>
              <HStack gap={2}>
                <Badge colorPalette={getStatusBadgeColor(order.status)} variant="subtle" px={3} py={1}>
                  {statusSteps.find((s) => s.status === order.status)?.label || order.status}
                </Badge>
                <Text fontSize="sm" color={textSecondary}>
                  Dibuat: {new Date(order.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          {/* Success Alert */}
          {justCreated && (
            <Alert
              status="success"
              variant="subtle"
              title="Order berhasil dibuat!"
              description="Pembayaran Anda sudah masuk ke escrow. Supplier akan memproses pesanan setelah konfirmasi."
            />
          )}

          {/* Order Status Timeline */}
          <Card variant="elevated">
            <CardHeader>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Status Order
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" gap={4}>
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = step.completed;
                  const isCurrent = step.current;

                  return (
                    <HStack key={step.status} align="start" gap={4}>
                      {/* Icon */}
                      <Box
                        w={10}
                        h={10}
                        borderRadius="full"
                        bg={
                          isCompleted
                            ? green100
                            : isCurrent
                            ? brand100
                            : gray100
                        }
                        color={getStatusColor(step)}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border={isCurrent ? '2px solid' : 'none'}
                        borderColor={brand500}
                      >
                        <Icon size={18} />
                      </Box>

                      {/* Content */}
                      <VStack align="start" gap={1} flex={1}>
                        <HStack justify="space-between" w="full">
                          <Text
                            fontSize="md"
                            fontWeight={isCurrent ? 'semibold' : 'medium'}
                            color={isCompleted || isCurrent ? textPrimary : textSecondary}
                          >
                            {step.label}
                          </Text>
                          {isCurrent && (
                            <Badge colorPalette="brand" variant="subtle" fontSize="xs">
                              Saat Ini
                            </Badge>
                          )}
                        </HStack>
                        {step.description && (
                          <Text fontSize="sm" color={textSecondary}>
                            {step.description}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  );
                })}
              </VStack>
            </CardBody>
          </Card>

          {/* Order Details */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {/* Order Items */}
            <Card variant="elevated">
              <CardHeader>
                <Heading fontSize="md" fontWeight="semibold" color={textPrimary}>
                  Detail Pesanan
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" gap={4}>
                  <Box>
                    <Text fontSize="sm" color={textSecondary} mb={1}>
                      Supplier
                    </Text>
                    <Text fontSize="md" fontWeight="medium" color={textPrimary}>
                      {order.supplier.name}
                    </Text>
                  </Box>
                  {order.items.map((item, index) => (
                    <Box key={index} p={3} borderRadius="md" bg={gray50}>
                      <VStack align="stretch" gap={2}>
                        <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                          {item.itemType === 'pakan' ? 'Pakan' : item.itemType === 'benih' ? 'Benih Ikan' : 'Peralatan'}
                        </Text>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color={textSecondary}>
                            {item.quantity.toLocaleString('id-ID')} {item.unit}
                          </Text>
                          <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                            {formatCurrency(item.totalPrice)}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* Payment Summary */}
            <Card variant="elevated">
              <CardHeader>
                <Heading fontSize="md" fontWeight="semibold" color={textPrimary}>
                  Ringkasan Pembayaran
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" gap={3}>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={textSecondary}>
                      Subtotal
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                      {formatCurrency(order.totalAmount)}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={textSecondary}>
                      Biaya Pengiriman
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                      {formatCurrency(order.shippingCost)}
                    </Text>
                  </HStack>
                  <Box pt={3} borderTop="1px solid" borderColor={borderColor}>
                    <HStack justify="space-between">
                      <Text fontSize="md" fontWeight="bold" color={textPrimary}>
                        Total
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color={brand600}>
                        {formatCurrency(order.finalTotal)}
                      </Text>
                    </HStack>
                  </Box>
                  <Box
                    p={3}
                    borderRadius="md"
                    bg={blue50}
                    border="1px solid"
                    borderColor={blue200}
                    mt={2}
                  >
                    <HStack gap={2} mb={1}>
                      <FiShield size={14} color={blue600} />
                      <Text fontSize="xs" fontWeight="semibold" color={blue700}>
                        Status Escrow
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color={blue700}>
                      {order.status === 'completed'
                        ? 'Pembayaran sudah diteruskan ke supplier'
                        : 'Pembayaran ditahan sampai QC selesai'}
                    </Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Actions */}
          {order.status === 'delivered' || order.status === 'qc_pending' ? (
            <Card variant="elevated">
              <CardBody>
                <VStack gap={3}>
                  <Text fontSize="md" fontWeight="semibold" color={textPrimary} textAlign="center">
                    Barang sudah diterima. Lakukan Quality Check sekarang.
                  </Text>
                  {order.qcWindowExpiresAt && (
                    <Text fontSize="sm" color={textSecondary} textAlign="center">
                      QC Window: {new Date(order.qcWindowExpiresAt).toLocaleString('id-ID')}
                    </Text>
                  )}
                  <CustomButton
                    variant="solid"
                    colorScheme="brand"
                    size="lg"
                    onClick={handleGoToQC}
                    leftIcon={<FiFileText />}
                  >
                    Lakukan Quality Check
                  </CustomButton>
                </VStack>
              </CardBody>
            </Card>
          ) : null}

          {/* Navigate to Roadmap after payment paid */}
          {order.status === 'paid' && order.projectId && (
            <Card variant="elevated">
              <CardBody>
                <VStack gap={3}>
                  <Box
                    p={3}
                    borderRadius="md"
                    bg={green50}
                    border="1px solid"
                    borderColor={green200}
                    w="full"
                  >
                    <HStack gap={2} mb={2}>
                      <FiCheckCircle size={18} color={green600} />
                      <Text fontSize="sm" fontWeight="semibold" color={green700}>
                        Pembayaran Diterima
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color={green700}>
                      Pembayaran Anda sudah masuk ke escrow. Sekarang Anda bisa mulai menjalankan roadmap proyek dengan monitoring AI step-by-step.
                    </Text>
                  </Box>
                  <CustomButton
                    variant="solid"
                    colorScheme="brand"
                    size="lg"
                    onClick={() => navigate(`/roadmap/${order.projectId}/execute`)}
                    w="full"
                    leftIcon={<FiFileText />}
                  >
                    Mulai Roadmap dengan AI Monitoring
                  </CustomButton>
                  <Text fontSize="xs" color={textSecondary} textAlign="center">
                    AI akan memonitoring setiap step dan membantu Anda sesuai dengan rencana. Anda bisa bertanya atau melaporkan kendala di setiap step.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Completed Order Info */}
          {order.status === 'completed' && order.projectId && (
            <Card variant="elevated">
              <CardBody>
                <VStack gap={3}>
                  <Text fontSize="md" fontWeight="semibold" color={textPrimary} textAlign="center">
                    Pesanan selesai dan pembayaran sudah diteruskan ke supplier.
                  </Text>
                  <CustomButton
                    variant="outline"
                    colorScheme="brand"
                    onClick={() => navigate(`/roadmap/${order.projectId}/execute`)}
                    w="full"
                  >
                    Lanjutkan Roadmap Proyek
                  </CustomButton>
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Debug: Quick Status Update (for demo only) */}
          {process.env.NODE_ENV === 'development' && (
            <Card variant="subtle" p={3}>
              <VStack align="stretch" gap={2}>
                <Text fontSize="xs" fontWeight="semibold" color={textSecondary}>
                  Debug: Quick Status Update
                </Text>
                <HStack gap={2} flexWrap="wrap">
                  {['paid', 'processing', 'shipped', 'delivered', 'qc_pending', 'completed'].map((status) => (
                    <CustomButton
                      key={status}
                      size="xs"
                      variant="outline"
                      onClick={() => handleUpdateStatus(status as any)}
                      disabled={order.status === status}
                    >
                      {status}
                    </CustomButton>
                  ))}
                </HStack>
              </VStack>
            </Card>
          )}
        </VStack>
      </Container>
    </>
  );
}

