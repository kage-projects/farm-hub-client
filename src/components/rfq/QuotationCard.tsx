import { VStack, HStack, Text, Box, Badge, SimpleGrid } from '@chakra-ui/react';
import { Card, CardBody, CardHeader, CardFooter } from '../surfaces/Card';
import { Button } from '../button/Button';
import { useColorModeValue } from '../ui/color-mode';
import { PriceLockTimer } from './PriceLockTimer';
import { formatPriceModel, getRemainingValidityHours, isPriceModelValid } from '../../utils/rfq/priceModel';
import type { Quotation } from '../../data/mockQuotations';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export interface QuotationCardProps {
  quotation: Quotation;
  isSelected?: boolean;
  onSelect?: (quotationId: string) => void;
  onPriceLock?: (quotationId: string) => void;
}

/**
 * Quotation Card Component
 * - Display quotation details
 * - Price model info
 * - Price-lock timer
 * - Select action
 */
export function QuotationCard({ quotation, isSelected, onSelect, onPriceLock }: QuotationCardProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const selectedBorderColor = useColorModeValue('brand.500', 'brand.400');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const isValid = isPriceModelValid(quotation.priceModel);
  const remainingHours = getRemainingValidityHours(quotation.priceModel);

  return (
    <Card
      variant="elevated"
      border={isSelected ? '2px solid' : '1px solid'}
      borderColor={isSelected ? selectedBorderColor : borderColor}
      bg={isSelected ? useColorModeValue('brand.50', 'brand.900') : undefined}
    >
      <CardHeader>
        <VStack align="stretch" gap={3}>
          <HStack justify="space-between" align="start">
            <VStack align="start" gap={1} flex={1}>
              <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                {quotation.supplierName}
              </Text>
              <Text fontSize="xs" color={textSecondary}>
                {quotation.item.name} - {quotation.item.specification || 'Standard'}
              </Text>
            </VStack>
            {isSelected && (
              <Badge colorScheme="brand" variant="solid">
                <HStack gap={1}>
                  <FiCheckCircle size={12} />
                  <Text>Dipilih</Text>
                </HStack>
              </Badge>
            )}
          </HStack>

          {/* Price Model Badge */}
          <Badge colorScheme={quotation.priceModel.model === 'spot' ? 'accent' : quotation.priceModel.model === 'fixed' ? 'brand' : 'secondary'} variant="subtle">
            {formatPriceModel(quotation.priceModel)}
          </Badge>

          {/* Validity Status */}
          {!isValid && (
            <HStack gap={1} color="red.600">
              <FiAlertCircle size={14} />
              <Text fontSize="xs">Harga sudah tidak berlaku</Text>
            </HStack>
          )}
        </VStack>
      </CardHeader>

      <CardBody>
        <VStack align="stretch" gap={4}>
          {/* Price Breakdown */}
          <SimpleGrid columns={2} gap={3}>
            <Box>
              <Text fontSize="xs" color={textSecondary} mb={1}>
                Harga Unit
              </Text>
              <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                {formatCurrency(quotation.unitPrice)} / {quotation.item.category === 'bibit' ? 'ekor' : 'kg'}
              </Text>
            </Box>
            <Box>
              <Text fontSize="xs" color={textSecondary} mb={1}>
                Ongkir
              </Text>
              <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                {formatCurrency(quotation.shippingCost)}
              </Text>
            </Box>
            <Box gridColumn="span 2">
              <Text fontSize="xs" color={textSecondary} mb={1}>
                Total Harga
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="brand.600">
                {formatCurrency(quotation.totalPrice)}
              </Text>
            </Box>
          </SimpleGrid>

          {/* SLA */}
          <Box
            p={2}
            borderRadius="md"
            border="1px solid"
            borderColor={borderColor}
            bg={useColorModeValue('gray.50', 'gray.800')}
          >
            <Text fontSize="xs" color={textSecondary} mb={1}>
              Estimasi Pengiriman
            </Text>
            <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
              {quotation.sla.deliveryTime} jam ({quotation.sla.minDeliveryTime}-{quotation.sla.maxDeliveryTime} jam)
            </Text>
          </Box>

          {/* Terms */}
          {quotation.terms.length > 0 && (
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color={textSecondary} mb={2}>
                Syarat & Ketentuan:
              </Text>
              <VStack align="start" gap={1}>
                {quotation.terms.map((term, idx) => (
                  <HStack key={idx} gap={1}>
                    <Text fontSize="xs" color={textSecondary}>•</Text>
                    <Text fontSize="xs" color={textPrimary}>{term}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          )}

          {/* Price Lock Timer */}
          {!quotation.priceLocked && isValid && (
            <Box
              p={2}
              borderRadius="md"
              bg={useColorModeValue('orange.50', 'orange.900')}
              border="1px solid"
              borderColor={useColorModeValue('orange.200', 'orange.700')}
            >
              <Text fontSize="xs" fontWeight="semibold" color="orange.700" mb={1}>
                Price-Lock Timer
              </Text>
              <PriceLockTimer deadline={quotation.priceLockDeadline} />
            </Box>
          )}
        </VStack>
      </CardBody>

      <CardFooter>
        <HStack gap={2} w="full">
          {!isSelected ? (
            <>
              <Button
                variant="outline"
                colorScheme="brand"
                size="sm"
                flex={1}
                onClick={() => onSelect?.(quotation.id)}
                disabled={!isValid}
              >
                Pilih Penawaran
              </Button>
              <Button
                variant="solid"
                colorScheme="brand"
                size="sm"
                flex={1}
                onClick={() => onPriceLock?.(quotation.id)}
                disabled={!isValid || remainingHours < 1}
              >
                Price-Lock
              </Button>
            </>
          ) : (
            <Button
              variant="solid"
              colorScheme="accent"
              size="sm"
              flex={1}
              onClick={() => onSelect?.(quotation.id)}
            >
              Lanjutkan ke Kontrak
            </Button>
          )}
        </HStack>
      </CardFooter>
    </Card>
  );
}

