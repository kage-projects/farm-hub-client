/**
 * Plan Technical Information Component
 * Menampilkan informasi teknis dari data plan
 */

import { Box, VStack, HStack, Text, Heading, SimpleGrid, Badge } from '@chakra-ui/react';
import { Card, CardHeader, CardBody } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { FiDroplet, FiPackage, FiShield, FiSettings, FiThermometer } from 'react-icons/fi';

export interface PlanTechnicalInfoProps {
  data: any;
}

export function PlanTechnicalInfo({ data }: PlanTechnicalInfoProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!data) {
    return (
      <Card variant="elevated" p={6}>
        <Text color={textSecondary}>Data informasi teknis belum tersedia...</Text>
      </Card>
    );
  }

  return (
    <VStack align="stretch" gap={6}>
      {/* Spesifikasi Kolam */}
      {data.spesifikasi_kolam && (
        <Card variant="elevated">
          <CardHeader>
            <HStack gap={2}>
              <Box
                p={2}
                borderRadius="lg"
                bg={useColorModeValue('cyan.100', 'cyan.900')}
                color={useColorModeValue('cyan.600', 'cyan.300')}
              >
                <FiDroplet size={18} />
              </Box>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Spesifikasi Kolam
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <InfoItem label="Tipe Kolam" value={data.spesifikasi_kolam.tipe_kolam} />
              <InfoItem label="Jumlah Kolam" value={data.spesifikasi_kolam.jumlah_kolam} />
              <InfoItem label="Luas per Kolam" value={`${data.spesifikasi_kolam.luas_per_kolam_m2} m²`} />
              <InfoItem label="Total Luas" value={`${data.spesifikasi_kolam.total_luas_m2} m²`} />
              <InfoItem label="Kedalaman" value={`${data.spesifikasi_kolam.kedalaman_m} m`} />
              <InfoItem label="Sistem Sirkulasi" value={data.spesifikasi_kolam.sistem_sirkulasi} />
            </SimpleGrid>
            {data.spesifikasi_kolam.keterangan && (
              <Box mt={4} p={3} borderRadius="lg" bg={useColorModeValue('gray.50', 'gray.800')}>
                <Text fontSize="sm" color={textSecondary} lineHeight="relaxed">
                  {data.spesifikasi_kolam.keterangan}
                </Text>
              </Box>
            )}
          </CardBody>
        </Card>
      )}

      {/* Kualitas Air */}
      {data.kualitas_air && (
        <Card variant="elevated">
          <CardHeader>
            <HStack gap={2}>
              <Box
                p={2}
                borderRadius="lg"
                bg={useColorModeValue('blue.100', 'blue.900')}
                color={useColorModeValue('blue.600', 'blue.300')}
              >
                <FiThermometer size={18} />
              </Box>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Kualitas Air
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" gap={4}>
              {data.kualitas_air.suhu_optimal_c && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color={textPrimary} mb={2}>
                    Suhu Optimal (°C)
                  </Text>
                  <HStack gap={2}>
                    <Badge colorScheme="brand" variant="subtle">
                      Min: {data.kualitas_air.suhu_optimal_c.min}°C
                    </Badge>
                    <Badge colorScheme="brand" variant="subtle">
                      Optimal: {data.kualitas_air.suhu_optimal_c.optimal}°C
                    </Badge>
                    <Badge colorScheme="brand" variant="subtle">
                      Max: {data.kualitas_air.suhu_optimal_c.max}°C
                    </Badge>
                  </HStack>
                </Box>
              )}
              
              {data.kualitas_air.ph_optimal && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color={textPrimary} mb={2}>
                    pH Optimal
                  </Text>
                  <HStack gap={2}>
                    <Badge colorScheme="brand" variant="subtle">
                      Min: {data.kualitas_air.ph_optimal.min}
                    </Badge>
                    <Badge colorScheme="brand" variant="subtle">
                      Optimal: {data.kualitas_air.ph_optimal.optimal}
                    </Badge>
                    <Badge colorScheme="brand" variant="subtle">
                      Max: {data.kualitas_air.ph_optimal.max}
                    </Badge>
                  </HStack>
                </Box>
              )}

              {data.kualitas_air.oksigen_terlarut_mg_l && (
                <InfoItem 
                  label="Oksigen Terlarut (mg/L)" 
                  value={`${data.kualitas_air.oksigen_terlarut_mg_l.min}-${data.kualitas_air.oksigen_terlarut_mg_l.optimal}`}
                />
              )}

              {data.kualitas_air.rekomendasi_pemantauan && (
                <Box p={3} borderRadius="lg" bg={useColorModeValue('blue.50', 'blue.900')}>
                  <Text fontSize="sm" color={textSecondary} lineHeight="relaxed">
                    <strong>Rekomendasi Pemantauan:</strong> {data.kualitas_air.rekomendasi_pemantauan}
                  </Text>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Spesifikasi Benih */}
      {data.spesifikasi_benih && (
        <Card variant="elevated">
          <CardHeader>
            <HStack gap={2}>
              <Box
                p={2}
                borderRadius="lg"
                bg={useColorModeValue('green.100', 'green.900')}
                color={useColorModeValue('green.600', 'green.300')}
              >
                <FiPackage size={18} />
              </Box>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Spesifikasi Benih
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <InfoItem label="Jenis Benih" value={data.spesifikasi_benih.jenis_benih} />
              <InfoItem 
                label="Jumlah per m²" 
                value={data.spesifikasi_benih.jumlah_benih_per_m2}
              />
              {data.spesifikasi_benih.ukuran_awal_cm && (
                <>
                  <InfoItem 
                    label="Ukuran Awal (Panjang)" 
                    value={`${data.spesifikasi_benih.ukuran_awal_cm.panjang} cm`}
                  />
                  <InfoItem 
                    label="Ukuran Awal (Berat)" 
                    value={`${data.spesifikasi_benih.ukuran_awal_cm.berat_gram} gram`}
                  />
                </>
              )}
              <InfoItem label="Harga per Ekor" value={`Rp ${data.spesifikasi_benih.harga_per_ekor_rp?.toLocaleString('id-ID') || '-'}`} />
              {data.spesifikasi_benih.sumber_benih && (
                <Box gridColumn={{ base: '1', md: '1 / -1' }}>
                  <InfoItem label="Sumber Benih" value={data.spesifikasi_benih.sumber_benih} />
                </Box>
              )}
              {data.spesifikasi_benih.standar_kualitas && (
                <Box gridColumn={{ base: '1', md: '1 / -1' }}>
                  <Text fontSize="sm" fontWeight="medium" color={textPrimary} mb={1}>
                    Standar Kualitas
                  </Text>
                  <Text fontSize="sm" color={textSecondary}>
                    {data.spesifikasi_benih.standar_kualitas}
                  </Text>
                </Box>
              )}
            </SimpleGrid>
          </CardBody>
        </Card>
      )}

      {/* Spesifikasi Pakan */}
      {data.spesifikasi_pakan && (
        <Card variant="elevated">
          <CardHeader>
            <HStack gap={2}>
              <Box
                p={2}
                borderRadius="lg"
                bg={useColorModeValue('orange.100', 'orange.900')}
                color={useColorModeValue('orange.600', 'orange.300')}
              >
                <FiPackage size={18} />
              </Box>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Spesifikasi Pakan
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <InfoItem label="Jenis Pakan" value={data.spesifikasi_pakan.jenis_pakan} />
              <InfoItem 
                label="Kadar Protein" 
                value={`${data.spesifikasi_pakan.kadar_protein_persen}%`}
              />
              <InfoItem 
                label="Frekuensi Pemberian" 
                value={data.spesifikasi_pakan.frekuensi_pemberian}
              />
              <InfoItem 
                label="Jumlah per Minggu" 
                value={`${data.spesifikasi_pakan.jumlah_per_minggu_kg} kg`}
              />
              <InfoItem 
                label="Rasio Konversi (FCR)" 
                value={data.spesifikasi_pakan.rasio_konversi_pakan_fcr}
              />
              <InfoItem 
                label="Harga per Kg" 
                value={`Rp ${data.spesifikasi_pakan.harga_per_kg_rp?.toLocaleString('id-ID') || '-'}`}
              />
              {data.spesifikasi_pakan.supplier_rekomendasi && (
                <Box gridColumn={{ base: '1', md: '1 / -1' }}>
                  <InfoItem 
                    label="Supplier Rekomendasi" 
                    value={data.spesifikasi_pakan.supplier_rekomendasi}
                  />
                </Box>
              )}
            </SimpleGrid>
          </CardBody>
        </Card>
      )}

      {/* Manajemen Kesehatan */}
      {data.manajemen_kesehatan && (
        <Card variant="elevated">
          <CardHeader>
            <HStack gap={2}>
              <Box
                p={2}
                borderRadius="lg"
                bg={useColorModeValue('red.100', 'red.900')}
                color={useColorModeValue('red.600', 'red.300')}
              >
                <FiShield size={18} />
              </Box>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Manajemen Kesehatan
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" gap={4}>
              {data.manajemen_kesehatan.penyakit_umum && Array.isArray(data.manajemen_kesehatan.penyakit_umum) && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color={textPrimary} mb={2}>
                    Penyakit Umum
                  </Text>
                  <VStack align="start" gap={2}>
                    {data.manajemen_kesehatan.penyakit_umum.map((penyakit: string, idx: number) => (
                      <Badge key={idx} colorScheme="red" variant="subtle">
                        {penyakit}
                      </Badge>
                    ))}
                  </VStack>
                </Box>
              )}

              {data.manajemen_kesehatan.pencegahan && (
                <InfoBox label="Pencegahan" value={data.manajemen_kesehatan.pencegahan} />
              )}
              
              {data.manajemen_kesehatan.pengobatan && (
                <InfoBox label="Pengobatan" value={data.manajemen_kesehatan.pengobatan} />
              )}
              
              {data.manajemen_kesehatan.vaksinasi && (
                <InfoItem label="Vaksinasi" value={data.manajemen_kesehatan.vaksinasi} />
              )}
              
              {data.manajemen_kesehatan.jadwal_pemeriksaan && (
                <InfoBox label="Jadwal Pemeriksaan" value={data.manajemen_kesehatan.jadwal_pemeriksaan} />
              )}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Teknologi Pendukung */}
      {data.teknologi_pendukung && (
        <Card variant="elevated">
          <CardHeader>
            <HStack gap={2}>
              <Box
                p={2}
                borderRadius="lg"
                bg={useColorModeValue('purple.100', 'purple.900')}
                color={useColorModeValue('purple.600', 'purple.300')}
              >
                <FiSettings size={18} />
              </Box>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Teknologi Pendukung
              </Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" gap={4}>
              {data.teknologi_pendukung.aerator && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color={textPrimary} mb={2}>
                    Aerator
                  </Text>
                  <VStack align="start" gap={1}>
                    {data.teknologi_pendukung.aerator.jumlah_unit && (
                      <Text fontSize="sm" color={textSecondary}>
                        Jumlah: {data.teknologi_pendukung.aerator.jumlah_unit} unit
                      </Text>
                    )}
                    {data.teknologi_pendukung.aerator.tipe && (
                      <Text fontSize="sm" color={textSecondary}>
                        Tipe: {data.teknologi_pendukung.aerator.tipe}
                      </Text>
                    )}
                    {data.teknologi_pendukung.aerator.kapasitas && (
                      <Text fontSize="sm" color={textSecondary}>
                        Kapasitas: {data.teknologi_pendukung.aerator.kapasitas}
                      </Text>
                    )}
                  </VStack>
                </Box>
              )}

              {data.teknologi_pendukung.monitoring_sistem && (
                <InfoItem 
                  label="Monitoring Sistem" 
                  value={data.teknologi_pendukung.monitoring_sistem}
                />
              )}
              
              {data.teknologi_pendukung.otomasi && (
                <InfoItem label="Otomasi" value={data.teknologi_pendukung.otomasi} />
              )}
              
              {data.teknologi_pendukung.teknologi_lain && (
                <InfoBox label="Teknologi Lain" value={data.teknologi_pendukung.teknologi_lain} />
              )}
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box>
      <Text fontSize="xs" color={textSecondary} fontWeight="medium" mb={1}>
        {label}
      </Text>
      <Text fontSize="sm" color={textPrimary} fontWeight="semibold">
        {value}
      </Text>
    </Box>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box>
      <Text fontSize="sm" fontWeight="medium" color={textPrimary} mb={2}>
        {label}
      </Text>
      <Box p={3} borderRadius="lg" bg={useColorModeValue('gray.50', 'gray.800')}>
        <Text fontSize="sm" color={textSecondary} lineHeight="relaxed">
          {value}
        </Text>
      </Box>
    </Box>
  );
}


