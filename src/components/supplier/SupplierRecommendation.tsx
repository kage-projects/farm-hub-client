/**
 * Supplier Recommendation Component
 * Hybrid Marketplace + RFQ dengan smart CTA
 */

import { Box, VStack, HStack, Text, Heading, SimpleGrid, Button, Badge, Input, Select } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPackage, FiShoppingCart, FiFileText, FiCheckCircle, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import { usePurchaseStore } from '../../store/purchaseStore';
import type { Supplier, PurchaseSpec } from '../../store/purchaseStore';

interface SupplierRecommendationProps {
  technicalData?: any;
}

// Dummy supplier data berdasarkan rekomendasi dari technical data
const getDummySuppliers = (technicalData?: any): Supplier[] => {
  const suppliers: Supplier[] = [
    {
      id: 'supplier-1',
      name: 'Japfa Comfeed - Padang',
      type: 'pakan',
      rating: 4.8,
      responseTime: '< 24 jam',
      priceRange: {
        min: 13000,
        max: 15000,
        unit: 'per kg'
      },
      location: 'Kota Padang, Sumatera Barat',
      verified: true,
      sla: '7 hari kerja',
      qualityGuarantee: true
    },
    {
      id: 'supplier-2',
      name: 'Cargill Indonesia',
      type: 'pakan',
      rating: 4.9,
      responseTime: '< 48 jam',
      priceRange: {
        min: 13500,
        max: 16000,
        unit: 'per kg'
      },
      location: 'Jakarta',
      verified: true,
      sla: '14 hari kerja',
      qualityGuarantee: true
    },
    {
      id: 'supplier-3',
      name: 'Central Proteina Prima',
      type: 'pakan',
      rating: 4.7,
      responseTime: '< 24 jam',
      priceRange: {
        min: 12500,
        max: 14500,
        unit: 'per kg'
      },
      location: 'Kota Padang, Sumatera Barat',
      verified: true,
      sla: '7 hari kerja',
      qualityGuarantee: true
    },
    {
      id: 'supplier-4',
      name: 'Balai Benih Ikan (BBI) Sumatera Barat',
      type: 'benih',
      rating: 4.9,
      responseTime: '2-5 hari',
      priceRange: {
        min: 250,
        max: 350,
        unit: 'per ekor'
      },
      location: 'Sumatera Barat',
      verified: true,
      sla: 'Terlacak',
      qualityGuarantee: true
    }
  ];

  return suppliers;
};

export function SupplierRecommendation({ technicalData }: SupplierRecommendationProps) {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.id;
  
  const { setCurrentPurchase, setRFQPrefillData } = usePurchaseStore();
  
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [purchaseSpec, setPurchaseSpec] = useState<PurchaseSpec>({
    quantity: 1000,
    tanggalButuh: '',
    tanggalFleksibel: true,
    spesifikasiKetat: false,
    nilaiBesar: false,
    jadwalBertahap: false,
  });

  const suppliers = getDummySuppliers(technicalData);

  // Smart CTA logic: menentukan "Beli Sekarang" atau "Minta Penawaran (RFQ)"
  const shouldUseRFQ = (supplier: Supplier): boolean => {
    // RFQ jika:
    // 1. Spesifikasi ketat
    // 2. Tanggal tidak fleksibel (fix)
    // 3. Nilai besar (> 10 juta untuk pakan, > 5 juta untuk benih)
    // 4. Perlu jadwal bertahap
    // 5. Supplier type benih (umumnya butuh RFQ)
    
    const totalValue = purchaseSpec.quantity * (supplier.priceRange.min + supplier.priceRange.max) / 2;
    const threshold = supplier.type === 'benih' ? 5000000 : 10000000;

    return (
      purchaseSpec.spesifikasiKetat ||
      !purchaseSpec.tanggalFleksibel ||
      totalValue >= threshold ||
      purchaseSpec.jadwalBertahap ||
      supplier.type === 'benih'
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleBuyNow = (supplier: Supplier) => {
    // Simpan data pembelian ke store
    setCurrentPurchase({
      supplier,
      purchaseSpec,
      projectId: projectId || undefined,
      source: 'plan-detail',
    });

    // Navigate ke checkout page
    navigate('/checkout', {
      state: {
        supplier,
        purchaseSpec,
        projectId: projectId || undefined,
      },
    });
  };

  const handleRequestRFQ = (supplier: Supplier) => {
    // Set RFQ prefill data
    const rfqPrefillData = {
      supplierId: supplier.id,
      itemCategory: supplier.type,
      quantity: purchaseSpec.quantity,
      deliveryDate: purchaseSpec.tanggalButuh || undefined,
      specification: purchaseSpec.spesifikasiKetat ? 'ketat' : 'standar',
      spesifikasiKetat: purchaseSpec.spesifikasiKetat,
      nilaiBesar: purchaseSpec.nilaiBesar,
      jadwalBertahap: purchaseSpec.jadwalBertahap,
      projectId: projectId || undefined,
    };

    setRFQPrefillData(rfqPrefillData);

    // Navigate ke RFQ page dengan pre-filled data
    navigate('/rfq', {
      state: {
        prefillData: rfqPrefillData,
        source: 'plan-detail',
        projectId: projectId || undefined,
      },
    });
  };

  return (
    <VStack align="stretch" gap={6}>
      <Card variant="elevated">
        <CardHeader>
          <VStack align="start" gap={2}>
            <HStack gap={2}>
              <Box
                p={2}
                borderRadius="lg"
                bg={useColorModeValue('blue.100', 'blue.900')}
                color={useColorModeValue('blue.600', 'blue.300')}
              >
                <FiShoppingCart size={18} />
              </Box>
              <Heading fontSize="xl" fontWeight="semibold" color={textPrimary}>
                Rekomendasi Supplier
              </Heading>
            </HStack>
            <Text fontSize="sm" color={textSecondary}>
              Sistem hybrid marketplace + RFQ yang memilih metode pembelian terbaik untuk kebutuhan Anda
            </Text>
          </VStack>
        </CardHeader>
        <CardBody>
          <VStack align="stretch" gap={6}>
            {/* Purchase Specification Form */}
            <Box
              p={4}
              borderRadius="lg"
              bg={useColorModeValue('gray.50', 'gray.800')}
              border="1px solid"
              borderColor={borderColor}
            >
              <Heading fontSize="md" fontWeight="semibold" color={textPrimary} mb={4}>
                Spesifikasi Pembelian
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                    Quantity
                  </Text>
                  <Input
                    type="number"
                    value={purchaseSpec.quantity}
                    onChange={(e) => setPurchaseSpec({ ...purchaseSpec, quantity: parseInt(e.target.value) || 0 })}
                    placeholder="Jumlah"
                  />
                </VStack>
                <VStack align="start" gap={2}>
                  <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                    Tanggal Butuh
                  </Text>
                  <Input
                    type="date"
                    value={purchaseSpec.tanggalButuh}
                    onChange={(e) => setPurchaseSpec({ ...purchaseSpec, tanggalButuh: e.target.value })}
                  />
                </VStack>
                <VStack align="start" gap={2}>
                  <HStack gap={2}>
                    <input
                      type="checkbox"
                      checked={purchaseSpec.tanggalFleksibel}
                      onChange={(e) => setPurchaseSpec({ ...purchaseSpec, tanggalFleksibel: e.target.checked })}
                    />
                    <Text fontSize="sm" color={textPrimary}>
                      Tanggal fleksibel
                    </Text>
                  </HStack>
                </VStack>
                <VStack align="start" gap={2}>
                  <HStack gap={2}>
                    <input
                      type="checkbox"
                      checked={purchaseSpec.spesifikasiKetat}
                      onChange={(e) => setPurchaseSpec({ ...purchaseSpec, spesifikasiKetat: e.target.checked })}
                    />
                    <Text fontSize="sm" color={textPrimary}>
                      Spesifikasi ketat (ukuran/jumlah/tanggal spesifik)
                    </Text>
                  </HStack>
                </VStack>
                <VStack align="start" gap={2}>
                  <HStack gap={2}>
                    <input
                      type="checkbox"
                      checked={purchaseSpec.nilaiBesar}
                      onChange={(e) => setPurchaseSpec({ ...purchaseSpec, nilaiBesar: e.target.checked })}
                    />
                    <Text fontSize="sm" color={textPrimary}>
                      Nilai transaksi besar (&gt; 10 juta)
                    </Text>
                  </HStack>
                </VStack>
                <VStack align="start" gap={2}>
                  <HStack gap={2}>
                    <input
                      type="checkbox"
                      checked={purchaseSpec.jadwalBertahap}
                      onChange={(e) => setPurchaseSpec({ ...purchaseSpec, jadwalBertahap: e.target.checked })}
                    />
                    <Text fontSize="sm" color={textPrimary}>
                      Perlu jadwal bertahap (kirim mingguan)
                    </Text>
                  </HStack>
                </VStack>
              </SimpleGrid>
            </Box>

            {/* Supplier Cards */}
            <VStack align="stretch" gap={4}>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Supplier Tersedia
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                {suppliers.map((supplier) => {
                  const useRFQ = shouldUseRFQ(supplier);
                  const estimatedTotal = purchaseSpec.quantity * supplier.priceRange.min;

                  return (
                    <Card
                      key={supplier.id}
                      variant="elevated"
                      cursor="pointer"
                      onClick={() => setSelectedSupplier(supplier.id)}
                      border={selectedSupplier === supplier.id ? '2px solid' : '1px solid'}
                      borderColor={selectedSupplier === supplier.id ? 'brand.500' : borderColor}
                    >
                      <CardHeader>
                        <VStack align="start" gap={2}>
                          <HStack justify="space-between" w="full">
                            <HStack gap={2}>
                              <Box
                                p={1.5}
                                borderRadius="md"
                                bg={useColorModeValue(`${supplier.type === 'pakan' ? 'blue' : 'green'}.100`, `${supplier.type === 'pakan' ? 'blue' : 'green'}.900`)}
                                color={useColorModeValue(`${supplier.type === 'pakan' ? 'blue' : 'green'}.600`, `${supplier.type === 'pakan' ? 'blue' : 'green'}.300`)}
                              >
                                <FiPackage size={14} />
                              </Box>
                              <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                                {supplier.name}
                              </Text>
                            </HStack>
                            {supplier.verified && (
                              <Badge colorScheme="success" px={2} py={1} borderRadius="md">
                                <HStack gap={1}>
                                  <FiCheckCircle size={10} />
                                  <Text fontSize="xs">Verified</Text>
                                </HStack>
                              </Badge>
                            )}
                          </HStack>
                          
                          <HStack gap={3} flexWrap="wrap">
                            <HStack gap={1}>
                              <Text fontSize="xs" color={textSecondary}>
                                Rating:
                              </Text>
                              <Text fontSize="xs" fontWeight="bold" color={textPrimary}>
                                {supplier.rating} ⭐
                              </Text>
                            </HStack>
                            <HStack gap={1}>
                              <Text fontSize="xs" color={textSecondary}>
                                Response:
                              </Text>
                              <Text fontSize="xs" fontWeight="medium" color={textPrimary}>
                                {supplier.responseTime}
                              </Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </CardHeader>
                      
                      <CardBody>
                        <VStack align="stretch" gap={3}>
                          <Box>
                            <Text fontSize="xs" color={textSecondary} mb={1}>
                              Harga
                            </Text>
                            <Text fontSize="lg" fontWeight="bold" color={textPrimary}>
                              {formatCurrency(supplier.priceRange.min)} - {formatCurrency(supplier.priceRange.max)}
                            </Text>
                            <Text fontSize="xs" color={textSecondary}>
                              {supplier.priceRange.unit}
                            </Text>
                          </Box>

                          <Box>
                            <Text fontSize="xs" color={textSecondary} mb={1}>
                              Lokasi
                            </Text>
                            <Text fontSize="sm" color={textPrimary}>
                              {supplier.location}
                            </Text>
                          </Box>

                          {supplier.sla && (
                            <Box>
                              <Text fontSize="xs" color={textSecondary} mb={1}>
                                SLA
                              </Text>
                              <Text fontSize="sm" color={textPrimary}>
                                {supplier.sla}
                              </Text>
                            </Box>
                          )}

                          {supplier.qualityGuarantee && (
                            <HStack gap={2}>
                              <FiCheckCircle size={14} color={useColorModeValue('green.600', 'green.400')} />
                              <Text fontSize="xs" color={useColorModeValue('green.600', 'green.400')}>
                                Quality Guarantee + QC
                              </Text>
                            </HStack>
                          )}

                          {useRFQ && (
                            <Box
                              p={2}
                              borderRadius="md"
                              bg={useColorModeValue('orange.50', 'orange.900')}
                              border="1px solid"
                              borderColor={useColorModeValue('orange.200', 'orange.700')}
                            >
                              <HStack gap={2}>
                                <FiAlertCircle size={14} color={useColorModeValue('orange.600', 'orange.400')} />
                                <Text fontSize="xs" color={useColorModeValue('orange.700', 'orange.300')}>
                                  Direkomendasikan: RFQ untuk spesifikasi ketat/tanggal fix/nilai besar
                                </Text>
                              </HStack>
                            </Box>
                          )}
                        </VStack>
                      </CardBody>

                      <CardFooter>
                        <Button
                          w="full"
                          variant={useRFQ ? 'outline' : 'solid'}
                          colorScheme={useRFQ ? 'accent' : 'brand'}
                          onClick={() => {
                            if (useRFQ) {
                              handleRequestRFQ(supplier);
                            } else {
                              handleBuyNow(supplier);
                            }
                          }}
                          leftIcon={useRFQ ? <FiFileText /> : <FiShoppingCart />}
                        >
                          {useRFQ ? 'Minta Penawaran (RFQ)' : 'Beli Sekarang'}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </SimpleGrid>
            </VStack>

            {/* Info Box: Hybrid System */}
            <Box
              p={4}
              borderRadius="lg"
              bg={useColorModeValue('blue.50', 'blue.900')}
              border="1px solid"
              borderColor={useColorModeValue('blue.200', 'blue.700')}
            >
              <HStack gap={2} mb={3}>
                <FiTrendingUp size={16} color={useColorModeValue('blue.600', 'blue.300')} />
                <Heading fontSize="sm" fontWeight="semibold" color={useColorModeValue('blue.700', 'blue.300')}>
                  Hybrid Marketplace + RFQ
                </Heading>
              </HStack>
              <VStack align="start" gap={2}>
                <Text fontSize="xs" color={useColorModeValue('blue.700', 'blue.300')}>
                  <strong>Beli Sekarang:</strong> Untuk kebutuhan standar dengan tanggal fleksibel dan nilai kecil. Proses: Escrow → Lacak → QC 1 menit → Release.
                </Text>
                <Text fontSize="xs" color={useColorModeValue('blue.700', 'blue.300')}>
                  <strong>Minta Penawaran (RFQ):</strong> Untuk benih/panen dengan spesifikasi ketat, kontrak berulang, atau nilai besar. Sistem akan pre-fill dari pilihan Anda, kemudian: Price-Lock → Kontrak Mini → Escrow → QC.
                </Text>
              </VStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}

