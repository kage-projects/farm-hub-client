import { VStack, HStack, Text, Box, Badge, SimpleGrid } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { Button } from '../button/Button';
import { useColorModeValue } from '../ui/color-mode';
import { matchHarvestToDemand, type DemandPosting } from '../../data/mockDemand';
import { FiMapPin, FiDollarSign, FiCalendar, FiCheckCircle } from 'react-icons/fi';

export interface DemandMatcherProps {
  harvestDate: Date;
  species: string;
  quantity: number; // kg
  onSelectDemand?: (demandId: string) => void;
}

/**
 * Demand Matcher Component
 * - Match harvest date dengan demand postings
 * - Show matching buyers dengan price & location
 */
export function DemandMatcher({ harvestDate, species, quantity, onSelectDemand }: DemandMatcherProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const matches = matchHarvestToDemand(harvestDate, species, quantity);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const buyerTypeLabels = {
    penadah: 'Penadah',
    umkm: 'UMKM',
    restoran: 'Restoran',
    distributor: 'Distributor',
  };

  if (matches.length === 0) {
    return (
      <Card variant="elevated">
        <CardBody>
          <Box textAlign="center" py={4}>
            <Text fontSize="sm" color={textSecondary}>
              Tidak ada permintaan yang cocok dengan jadwal panen Anda.
            </Text>
            <Text fontSize="xs" color={textSecondary} mt={2}>
              Coba ubah tanggal panen atau periksa kembali nanti.
            </Text>
          </Box>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
          Permintaan Pasar yang Cocok
        </Text>
      </CardHeader>
      <CardBody>
        <VStack align="stretch" gap={4}>
          {matches.map((demand) => {
            const dateDiff = Math.abs(
              (harvestDate.getTime() - demand.preferredDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            const isPerfectMatch = dateDiff <= 3; // Within 3 days

            return (
              <Box
                key={demand.id}
                p={4}
                borderRadius="md"
                border="1px solid"
                borderColor={isPerfectMatch ? 'brand.300' : borderColor}
                bg={isPerfectMatch ? useColorModeValue('brand.50', 'brand.900') : undefined}
              >
                <VStack align="stretch" gap={3}>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" gap={1} flex={1}>
                      <HStack gap={2}>
                        <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                          {demand.buyerName}
                        </Text>
                        <Badge colorScheme="secondary" variant="subtle" fontSize="xs">
                          {buyerTypeLabels[demand.buyerType]}
                        </Badge>
                        {isPerfectMatch && (
                          <Badge colorScheme="green" variant="solid" fontSize="xs">
                            <FiCheckCircle size={10} style={{ display: 'inline', marginRight: '4px' }} />
                            Match Sempurna
                          </Badge>
                        )}
                      </HStack>
                      <HStack gap={1}>
                        <FiMapPin size={14} color={useColorModeValue('#718096', '#A0AEC0')} />
                        <Text fontSize="xs" color={textSecondary}>
                          {demand.location.address}
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                    <Box>
                      <HStack gap={1} mb={1}>
                        <FiDollarSign size={12} />
                        <Text fontSize="xs" color={textSecondary}>Harga Maks</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="bold" color="brand.600">
                        {formatCurrency(demand.maxPrice)}/kg
                      </Text>
                      <Text fontSize="xs" color={textSecondary}>
                        Volume: {demand.item.quantity} kg
                      </Text>
                    </Box>
                    <Box>
                      <HStack gap={1} mb={1}>
                        <FiCalendar size={12} />
                        <Text fontSize="xs" color={textSecondary}>Tanggal Butuh</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                        {demand.preferredDate.toLocaleDateString('id-ID')}
                      </Text>
                      <Text fontSize="xs" color={textSecondary}>
                        Flexibel: ±{demand.flexibleWindow} hari
                      </Text>
                      {dateDiff <= demand.flexibleWindow && (
                        <Text fontSize="xs" color="green.600" mt={1}>
                          ✓ Cocok dengan panen Anda ({dateDiff.toFixed(0)} hari selisih)
                        </Text>
                      )}
                    </Box>
                  </SimpleGrid>

                  <Box
                    p={2}
                    borderRadius="md"
                    bg={useColorModeValue('gray.50', 'gray.800')}
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Text fontSize="xs" color={textSecondary} mb={1}>
                      Spesifikasi
                    </Text>
                    <Text fontSize="xs" color={textPrimary}>
                      {demand.item.species} • {demand.item.minWeight}g
                      {demand.item.maxWeight && ` - ${demand.item.maxWeight}g`}
                    </Text>
                  </Box>

                  {onSelectDemand && (
                    <Button
                      variant="solid"
                      colorScheme={isPerfectMatch ? 'brand' : 'secondary'}
                      size="sm"
                      onClick={() => onSelectDemand(demand.id)}
                    >
                      Pilih Permintaan Ini
                    </Button>
                  )}
                </VStack>
              </Box>
            );
          })}
        </VStack>
      </CardBody>
    </Card>
  );
}

