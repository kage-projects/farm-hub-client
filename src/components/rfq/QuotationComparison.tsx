import { VStack, HStack, Text, Box, SimpleGrid } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { Button } from '../button/Button';
import { useColorModeValue } from '../ui/color-mode';
import type { Quotation } from '../../data/mockQuotations';
import { formatPriceModel } from '../../utils/rfq/priceModel';
import { FiCheck } from 'react-icons/fi';

export interface QuotationComparisonProps {
  quotations: Quotation[];
  onSelect: (quotationId: string) => void;
}

/**
 * Quotation Comparison Component
 * - Side-by-side comparison table
 * - Highlight best value per metric
 */
export function QuotationComparison({ quotations, onSelect }: QuotationComparisonProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Find best values
  const lowestPrice = Math.min(...quotations.map((q) => q.totalPrice));
  const fastestSLA = Math.min(...quotations.map((q) => q.sla.deliveryTime));
  const highestRating = Math.max(...quotations.map((q) => {
    // Mock rating - in real app, get from supplier data
    return 4.5;
  }));

  const getBestIndicator = (value: number, isMin: boolean, bestValue: number) => {
    if (isMin ? value === bestValue : value === bestValue) {
      return (
        <Box as="span" color="green.600" fontWeight="semibold">
          ✓ Terbaik
        </Box>
      );
    }
    return null;
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
          Perbandingan Penawaran
        </Text>
      </CardHeader>
      <CardBody>
        <Box overflowX="auto">
          <SimpleGrid
            columns={{ base: 1, md: quotations.length }}
            gap={4}
            minW={`${quotations.length * 300}px`}
          >
            {quotations.map((quotation) => (
              <Box
                key={quotation.id}
                p={4}
                borderRadius="md"
                border="1px solid"
                borderColor={borderColor}
                position="relative"
              >
                <VStack align="stretch" gap={3}>
                  {/* Supplier Name */}
                  <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                    {quotation.supplierName}
                  </Text>

                  {/* Price Model */}
                  <Box>
                    <Text fontSize="xs" color={textSecondary} mb={1}>
                      Model Harga
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                      {formatPriceModel(quotation.priceModel)}
                    </Text>
                  </Box>

                  {/* Total Price */}
                  <Box>
                    <Text fontSize="xs" color={textSecondary} mb={1}>
                      Total Harga
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="brand.600">
                      {formatCurrency(quotation.totalPrice)}
                      {getBestIndicator(quotation.totalPrice, true, lowestPrice)}
                    </Text>
                    <Text fontSize="xs" color={textSecondary} mt={1}>
                      {formatCurrency(quotation.unitPrice)} / {quotation.item.category === 'bibit' ? 'ekor' : 'kg'}
                    </Text>
                  </Box>

                  {/* SLA */}
                  <Box>
                    <Text fontSize="xs" color={textSecondary} mb={1}>
                      Estimasi Pengiriman
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                      {quotation.sla.deliveryTime} jam
                      {getBestIndicator(quotation.sla.deliveryTime, true, fastestSLA)}
                    </Text>
                  </Box>

                  {/* Shipping Cost */}
                  <Box>
                    <Text fontSize="xs" color={textSecondary} mb={1}>
                      Ongkir
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                      {formatCurrency(quotation.shippingCost)}
                    </Text>
                  </Box>

                  {/* Action */}
                  <Button
                    variant="solid"
                    colorScheme="brand"
                    size="sm"
                    onClick={() => onSelect(quotation.id)}
                    leftIcon={<FiCheck />}
                  >
                    Pilih
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </CardBody>
    </Card>
  );
}

