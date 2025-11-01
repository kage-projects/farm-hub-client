/**
 * Plan Roadmap Detail Component
 * Menampilkan roadmap dari data plan
 */

import { Box, VStack, HStack, Text, Heading, Badge, SimpleGrid } from '@chakra-ui/react';
import { Card, CardHeader, CardBody } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { FiTarget, FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export interface PlanRoadmapDetailProps {
  data: any;
}

export function PlanRoadmapDetail({ data }: PlanRoadmapDetailProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!data) {
    return (
      <Card variant="elevated" p={6}>
        <Text color={textSecondary}>Data roadmap belum tersedia...</Text>
      </Card>
    );
  }

  return (
    <VStack align="stretch" gap={6}>
      {/* Header Info */}
      <Card variant="elevated">
        <CardHeader>
          <HStack gap={3}>
            <Box
              p={2.5}
              borderRadius="lg"
              bg={useColorModeValue('brand.100', 'brand.900')}
              color={useColorModeValue('brand.600', 'brand.400')}
            >
              <FiTarget size={20} />
            </Box>
            <VStack align="start" gap={1} flex={1}>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                {data.judul || 'Roadmap'}
              </Heading>
              {data.tujuan && (
                <Text fontSize="sm" color={textSecondary}>
                  {data.tujuan}
                </Text>
              )}
            </VStack>
            {data.durasi_bulan && (
              <Badge colorScheme="brand" variant="subtle" fontSize="sm" px={3} py={1}>
                {data.durasi_bulan} Bulan
              </Badge>
            )}
          </HStack>
        </CardHeader>
        <CardBody>
          {data.step && (
            <HStack gap={2} mb={4}>
              <Text fontSize="xs" color={textSecondary} fontWeight="medium">
                Step {data.step}
              </Text>
            </HStack>
          )}
        </CardBody>
      </Card>

      {/* Tahapan */}
      {data.tahapan && Array.isArray(data.tahapan) && data.tahapan.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
              Tahapan Pelaksanaan
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" gap={4}>
              {data.tahapan.map((tahap: any, idx: number) => (
                <Box
                  key={idx}
                  p={4}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                  bg={useColorModeValue('white', 'gray.800')}
                >
                  <HStack justify="space-between" mb={3}>
                    <HStack gap={2}>
                      <Box
                        p={1.5}
                        borderRadius="md"
                        bg={useColorModeValue('brand.100', 'brand.900')}
                        color={useColorModeValue('brand.600', 'brand.400')}
                        fontWeight="bold"
                        fontSize="xs"
                        minW="24px"
                        textAlign="center"
                      >
                        {tahap.nomor || idx + 1}
                      </Box>
                      <Heading fontSize="md" fontWeight="semibold" color={textPrimary}>
                        {tahap.nama_tahap}
                      </Heading>
                    </HStack>
                    {tahap.durasi_minggu && (
                      <Badge colorScheme="brand" variant="subtle" fontSize="xs">
                        <HStack gap={1}>
                          <FiClock size={12} />
                          <Text>{tahap.durasi_minggu} minggu</Text>
                        </HStack>
                      </Badge>
                    )}
                  </HStack>

                  {tahap.deskripsi && (
                    <Text fontSize="sm" color={textSecondary} mb={3} lineHeight="relaxed">
                      {tahap.deskripsi}
                    </Text>
                  )}

                  {tahap.kegiatan && Array.isArray(tahap.kegiatan) && tahap.kegiatan.length > 0 && (
                    <Box>
                      <Text fontSize="xs" fontWeight="medium" color={textSecondary} mb={2}>
                        Kegiatan:
                      </Text>
                      <VStack align="start" gap={2}>
                        {tahap.kegiatan.map((kegiatan: string, kIdx: number) => (
                          <HStack key={kIdx} align="start" gap={2}>
                            <Box
                              mt={1}
                              w={1.5}
                              h={1.5}
                              borderRadius="full"
                              bg={useColorModeValue('brand.500', 'brand.400')}
                              flexShrink={0}
                            />
                            <Text fontSize="sm" color={textPrimary} lineHeight="relaxed">
                              {kegiatan}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {tahap.output && (
                    <Box
                      mt={3}
                      p={2.5}
                      borderRadius="md"
                      bg={useColorModeValue('green.50', 'green.900')}
                      border="1px solid"
                      borderColor={useColorModeValue('green.200', 'green.700')}
                    >
                      <HStack gap={2}>
                        <FiCheckCircle size={14} color={useColorModeValue('green.600', 'green.300')} />
                        <Text fontSize="xs" color={textSecondary} fontWeight="medium">
                          Output: {tahap.output}
                        </Text>
                      </HStack>
                    </Box>
                  )}
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Risiko dan Mitigasi */}
      {data.risiko_dan_mitigasi && Array.isArray(data.risiko_dan_mitigasi) && data.risiko_dan_mitigasi.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <HStack gap={2}>
              <FiAlertTriangle size={18} color={useColorModeValue('orange.600', 'orange.400')} />
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Risiko dan Mitigasi
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" gap={4}>
              {data.risiko_dan_mitigasi.map((risiko: any, idx: number) => (
                <Box
                  key={idx}
                  p={4}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={useColorModeValue('orange.200', 'orange.700')}
                  bg={useColorModeValue('orange.50', 'orange.900')}
                >
                  <VStack align="stretch" gap={2}>
                    <Text fontSize="sm" fontWeight="bold" color={textPrimary}>
                      {risiko.risiko}
                    </Text>
                    {risiko.dampak && (
                      <Box>
                        <Text fontSize="xs" fontWeight="medium" color={textSecondary} mb={1}>
                          Dampak:
                        </Text>
                        <Badge colorScheme="orange" variant="subtle" fontSize="xs">
                          {risiko.dampak}
                        </Badge>
                      </Box>
                    )}
                    {risiko.mitigasi && (
                      <Box mt={1}>
                        <Text fontSize="xs" fontWeight="medium" color={textSecondary} mb={1}>
                          Mitigasi:
                        </Text>
                        <Text fontSize="sm" color={textPrimary} lineHeight="relaxed">
                          {risiko.mitigasi}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Success Criteria */}
      {data.success_criteria && (
        <Card variant="elevated">
          <CardHeader>
            <HStack gap={2}>
              <FiCheckCircle size={18} color={useColorModeValue('green.600', 'green.400')} />
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Kriteria Keberhasilan
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <Box
              p={4}
              borderRadius="lg"
              bg={useColorModeValue('green.50', 'green.900')}
              border="1px solid"
              borderColor={useColorModeValue('green.200', 'green.700')}
            >
              <Text fontSize="sm" color={textPrimary} lineHeight="relaxed">
                {data.success_criteria}
              </Text>
            </Box>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
}


