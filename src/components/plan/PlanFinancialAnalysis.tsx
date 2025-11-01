/**
 * Plan Financial Analysis Component
 * Menampilkan analisis finansial dari data plan
 */

import { Box, VStack, HStack, Text, Heading, SimpleGrid, Badge } from '@chakra-ui/react';
import { Card, CardHeader, CardBody } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { FiDollarSign, FiTrendingUp, FiBarChart2, FiPackage } from 'react-icons/fi';

export interface PlanFinancialAnalysisProps {
  data: any;
}

export function PlanFinancialAnalysis({ data }: PlanFinancialAnalysisProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!data) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <VStack align="stretch" gap={6}>
      <Card variant="elevated">
        <CardHeader>
          <HStack gap={2}>
            <Box
              p={2}
              borderRadius="lg"
              bg={useColorModeValue('green.100', 'green.900')}
              color={useColorModeValue('green.600', 'green.300')}
            >
              <FiDollarSign size={18} />
            </Box>
            <Heading fontSize="xl" fontWeight="semibold" color={textPrimary}>
              Analisis Finansial
            </Heading>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack align="stretch" gap={6}>
            {/* Rincian Modal Awal */}
            {data.rincian_modal_awal && (
              <Box>
                <Heading fontSize="md" fontWeight="semibold" color={textPrimary} mb={4}>
                  Rincian Modal Awal
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  {data.rincian_modal_awal.infrastruktur && (
                    <Box
                      p={4}
                      borderRadius="lg"
                      bg={useColorModeValue('blue.50', 'blue.900')}
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <Text fontSize="sm" fontWeight="semibold" color={textPrimary} mb={2}>
                        Infrastruktur
                      </Text>
                      <VStack align="start" gap={1}>
                        {Object.entries(data.rincian_modal_awal.infrastruktur)
                          .filter(([key]) => key !== 'subtotal')
                          .map(([key, value]: [string, any]) => (
                            <HStack key={key} justify="space-between" w="full">
                              <Text fontSize="xs" color={textSecondary} textTransform="capitalize">
                                {key.replace(/_/g, ' ')}:
                              </Text>
                              <Text fontSize="xs" fontWeight="medium" color={textPrimary}>
                                {formatCurrency(value)}
                              </Text>
                            </HStack>
                          ))}
                        <Box
                          pt={2}
                          mt={2}
                          borderTop="1px solid"
                          borderColor={borderColor}
                          w="full"
                        >
                          <HStack justify="space-between">
                            <Text fontSize="sm" fontWeight="bold" color={textPrimary}>
                              Subtotal:
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color={textPrimary}>
                              {formatCurrency(data.rincian_modal_awal.infrastruktur.subtotal)}
                            </Text>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                  )}

                  {data.rincian_modal_awal.benih && (
                    <Box
                      p={4}
                      borderRadius="lg"
                      bg={useColorModeValue('cyan.50', 'cyan.900')}
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <Text fontSize="sm" fontWeight="semibold" color={textPrimary} mb={2}>
                        Benih
                      </Text>
                      <VStack align="start" gap={1}>
                        {Object.entries(data.rincian_modal_awal.benih)
                          .filter(([key]) => key !== 'subtotal')
                          .map(([key, value]: [string, any]) => (
                            <HStack key={key} justify="space-between" w="full">
                              <Text fontSize="xs" color={textSecondary} textTransform="capitalize">
                                {key.replace(/_/g, ' ')}:
                              </Text>
                              <Text fontSize="xs" fontWeight="medium" color={textPrimary}>
                                {formatCurrency(value)}
                              </Text>
                            </HStack>
                          ))}
                        <Box
                          pt={2}
                          mt={2}
                          borderTop="1px solid"
                          borderColor={borderColor}
                          w="full"
                        >
                          <HStack justify="space-between">
                            <Text fontSize="sm" fontWeight="bold" color={textPrimary}>
                              Subtotal:
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color={textPrimary}>
                              {formatCurrency(data.rincian_modal_awal.benih.subtotal)}
                            </Text>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                  )}

                  {data.rincian_modal_awal.pakan && (
                    <Box
                      p={4}
                      borderRadius="lg"
                      bg={useColorModeValue('orange.50', 'orange.900')}
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <Text fontSize="sm" fontWeight="semibold" color={textPrimary} mb={2}>
                        Pakan
                      </Text>
                      <VStack align="start" gap={1}>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="xs" color={textSecondary}>
                            Stok Awal:
                          </Text>
                          <Text fontSize="xs" fontWeight="medium" color={textPrimary}>
                            {formatCurrency(data.rincian_modal_awal.pakan.stok_awal)}
                          </Text>
                        </HStack>
                        <Box
                          pt={2}
                          mt={2}
                          borderTop="1px solid"
                          borderColor={borderColor}
                          w="full"
                        >
                          <HStack justify="space-between">
                            <Text fontSize="sm" fontWeight="bold" color={textPrimary}>
                              Subtotal:
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color={textPrimary}>
                              {formatCurrency(data.rincian_modal_awal.pakan.subtotal)}
                            </Text>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                  )}

                  {data.rincian_modal_awal.operasional_awal && (
                    <Box
                      p={4}
                      borderRadius="lg"
                      bg={useColorModeValue('purple.50', 'purple.900')}
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <Text fontSize="sm" fontWeight="semibold" color={textPrimary} mb={2}>
                        Operasional Awal
                      </Text>
                      <VStack align="start" gap={1}>
                        {Object.entries(data.rincian_modal_awal.operasional_awal)
                          .filter(([key]) => key !== 'subtotal')
                          .map(([key, value]: [string, any]) => (
                            <HStack key={key} justify="space-between" w="full">
                              <Text fontSize="xs" color={textSecondary} textTransform="capitalize">
                                {key.replace(/_/g, ' ')}:
                              </Text>
                              <Text fontSize="xs" fontWeight="medium" color={textPrimary}>
                                {formatCurrency(value)}
                              </Text>
                            </HStack>
                          ))}
                        <Box
                          pt={2}
                          mt={2}
                          borderTop="1px solid"
                          borderColor={borderColor}
                          w="full"
                        >
                          <HStack justify="space-between">
                            <Text fontSize="sm" fontWeight="bold" color={textPrimary}>
                              Subtotal:
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" color={textPrimary}>
                              {formatCurrency(data.rincian_modal_awal.operasional_awal.subtotal)}
                            </Text>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                  )}
                </SimpleGrid>

                {data.rincian_modal_awal.total_modal_awal && (
                  <Box
                    p={4}
                    mt={4}
                    borderRadius="lg"
                    bg={useColorModeValue('green.50', 'green.900')}
                    border="2px solid"
                    borderColor={useColorModeValue('green.300', 'green.700')}
                  >
                    <HStack justify="space-between">
                      <Text fontSize="lg" fontWeight="bold" color={textPrimary}>
                        Total Modal Awal:
                      </Text>
                      <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('green.700', 'green.300')}>
                        {formatCurrency(data.rincian_modal_awal.total_modal_awal)}
                      </Text>
                    </HStack>
                    {data.rincian_modal_awal.catatan && (
                      <Text fontSize="xs" color={textSecondary} mt={2}>
                        {data.rincian_modal_awal.catatan}
                      </Text>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {/* Analisis ROI */}
            {data.analisis_roi && (
              <Box>
                <Heading fontSize="md" fontWeight="semibold" color={textPrimary} mb={4}>
                  Analisis ROI
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                  <Box
                    p={4}
                    borderRadius="lg"
                    bg={useColorModeValue('blue.50', 'blue.900')}
                    border="1px solid"
                    borderColor={borderColor}
                    textAlign="center"
                  >
                    <HStack justify="center" mb={2}>
                      <FiTrendingUp size={20} color={useColorModeValue('blue.600', 'blue.300')} />
                    </HStack>
                    <Text fontSize="xs" color={textSecondary} mb={1}>
                      ROI
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color={textPrimary}>
                      {data.analisis_roi.roi_persen?.toFixed(2)}%
                    </Text>
                    <Text fontSize="xs" color={textSecondary} mt={1}>
                      {data.analisis_roi.roi_bulan?.toFixed(1)} bulan
                    </Text>
                  </Box>

                  <Box
                    p={4}
                    borderRadius="lg"
                    bg={useColorModeValue('green.50', 'green.900')}
                    border="1px solid"
                    borderColor={borderColor}
                    textAlign="center"
                  >
                    <HStack justify="center" mb={2}>
                      <FiDollarSign size={20} color={useColorModeValue('green.600', 'green.300')} />
                    </HStack>
                    <Text fontSize="xs" color={textSecondary} mb={1}>
                      Laba Bersih
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color={textPrimary}>
                      {formatCurrency(data.analisis_roi.laba_bersih)}
                    </Text>
                    <Text fontSize="xs" color={textSecondary} mt={1}>
                      {data.analisis_roi.periode_analisis_bulan} bulan
                    </Text>
                  </Box>

                  <Box
                    p={4}
                    borderRadius="lg"
                    bg={useColorModeValue('orange.50', 'orange.900')}
                    border="1px solid"
                    borderColor={borderColor}
                    textAlign="center"
                  >
                    <HStack justify="center" mb={2}>
                      <FiBarChart2 size={20} color={useColorModeValue('orange.600', 'orange.300')} />
                    </HStack>
                    <Text fontSize="xs" color={textSecondary} mb={1}>
                      Break Even Point
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color={textPrimary}>
                      {data.analisis_roi.break_even_point_bulan?.toFixed(1)} bulan
                    </Text>
                    <Text fontSize="xs" color={textSecondary} mt={1}>
                      Periode analisis
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>
            )}

            {/* Analisis BEP */}
            {data.analisis_bep && (
              <Box>
                <Heading fontSize="md" fontWeight="semibold" color={textPrimary} mb={4}>
                  Analisis Break Even Point (BEP)
                </Heading>
                <Box
                  p={4}
                  borderRadius="lg"
                  bg={useColorModeValue('gray.50', 'gray.800')}
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <VStack align="start" gap={2}>
                      <InfoRow label="BEP Unit" value={`${data.analisis_bep.bep_unit?.toFixed(1)} kg`} />
                      <InfoRow label="BEP Rupiah" value={formatCurrency(data.analisis_bep.bep_rupiah)} />
                      <InfoRow
                        label="Margin of Safety"
                        value={`${data.analisis_bep.margin_of_safety_persen?.toFixed(1)}%`}
                      />
                    </VStack>
                    <Box>
                      <Text fontSize="xs" color={textSecondary} mb={2}>
                        Penjelasan:
                      </Text>
                      <Text fontSize="sm" color={textPrimary}>
                        {data.analisis_bep.penjelasan}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Box>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');

  return (
    <HStack justify="space-between" w="full">
      <Text fontSize="sm" color={textSecondary}>
        {label}:
      </Text>
      <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
        {value}
      </Text>
    </HStack>
  );
}


