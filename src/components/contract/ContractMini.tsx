import { VStack, HStack, Text, Box, SimpleGrid, Separator } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { Button } from '../button/Button';
import { useColorModeValue } from '../ui/color-mode';
import { formatPriceModel, type PriceModelData } from '../../utils/rfq/priceModel';
import { FiFileText, FiDownload } from 'react-icons/fi';

export interface ContractTerms {
  priceModel: PriceModelData;
  volume: {
    min: number;
    max: number;
    unit: string;
  };
  shipmentSchedule?: string;
  sla: {
    deliveryTime: number; // hours
    tolerance: number; // hours
  };
  qualityTolerance: {
    mortalityMax?: number; // percentage
    sizeTolerance?: number; // percentage
  };
  repricingWindow?: number; // days
  penaltyRules: {
    lateDelivery: number; // percentage of order value
    qualityIssue: number; // percentage
  };
  cancellationRules: {
    buyerCancellationFee: number; // percentage
    supplierCancellationFee: number; // percentage
  };
}

export interface ContractMiniProps {
  contractId: string;
  supplierName: string;
  buyerName: string;
  item: {
    name: string;
    specification?: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  shippingCost: number;
  terms: ContractTerms;
  createdAt: Date;
  onDownloadPDF?: () => void;
}

/**
 * Contract Mini Component
 * - Display contract summary
 * - Terms breakdown
 * - PDF export button
 */
export function ContractMini({
  contractId,
  supplierName,
  buyerName,
  item,
  quantity,
  unitPrice,
  totalPrice,
  shippingCost,
  terms,
  createdAt,
  onDownloadPDF,
}: ContractMiniProps) {
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

  return (
    <Card variant="elevated">
      <CardHeader>
        <HStack justify="space-between" align="start">
          <VStack align="start" gap={1}>
            <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
              Kontrak Mini
            </Text>
            <Text fontSize="xs" color={textSecondary}>
              ID: {contractId}
            </Text>
          </VStack>
          {onDownloadPDF && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadPDF}
              leftIcon={<FiDownload />}
            >
              Download PDF
            </Button>
          )}
        </HStack>
      </CardHeader>

      <CardBody>
        <VStack align="stretch" gap={6}>
          {/* Parties */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textPrimary} mb={3}>
              Pihak-Pihak
            </Text>
            <SimpleGrid columns={2} gap={3}>
              <Box>
                <Text fontSize="xs" color={textSecondary} mb={1}>
                  Supplier
                </Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                  {supplierName}
                </Text>
              </Box>
              <Box>
                <Text fontSize="xs" color={textSecondary} mb={1}>
                  Pembeli
                </Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                  {buyerName}
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          <Separator />

          {/* Item & Price */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textPrimary} mb={3}>
              Item & Harga
            </Text>
            <VStack align="stretch" gap={2}>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Item</Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                  {item.name} {item.specification ? `(${item.specification})` : ''}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Jumlah</Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                  {quantity} {terms.volume.unit}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Harga Unit</Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                  {formatCurrency(unitPrice)}
                </Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color={textSecondary}>Ongkir</Text>
                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                  {formatCurrency(shippingCost)}
                </Text>
              </HStack>
              <Separator />
              <HStack justify="space-between">
                <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                  Total
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="brand.600">
                  {formatCurrency(totalPrice)}
                </Text>
              </HStack>
            </VStack>
          </Box>

          <Separator />

          {/* Price Model */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textPrimary} mb={3}>
              Model Harga
            </Text>
            <Box
              p={3}
              borderRadius="md"
              border="1px solid"
              borderColor={borderColor}
              bg={useColorModeValue('gray.50', 'gray.800')}
            >
              <Text fontSize="sm" fontWeight="medium" color={textPrimary} mb={2}>
                {formatPriceModel(terms.priceModel)}
              </Text>
              <Text fontSize="xs" color={textSecondary}>
                Berlaku: {new Date(terms.priceModel.validFrom).toLocaleDateString('id-ID')} - {new Date(terms.priceModel.validTo).toLocaleDateString('id-ID')}
              </Text>
              {terms.priceModel.model === 'indexed' && (
                <VStack align="start" gap={1} mt={2}>
                  <Text fontSize="xs" color={textSecondary}>
                    Floor: {formatCurrency(terms.priceModel.floor)} | Ceiling: {formatCurrency(terms.priceModel.ceiling)}
                  </Text>
                  <Text fontSize="xs" color={textSecondary}>
                    Repricing window: Setiap {terms.repricingWindow} hari
                  </Text>
                </VStack>
              )}
            </Box>
          </Box>

          <Separator />

          {/* Terms */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textPrimary} mb={3}>
              Syarat & Ketentuan
            </Text>
            <VStack align="stretch" gap={3}>
              {/* SLA */}
              <Box>
                <Text fontSize="xs" color={textSecondary} mb={1}>
                  SLA Pengiriman
                </Text>
                <Text fontSize="sm" color={textPrimary}>
                  {terms.sla.deliveryTime} jam (toleransi ±{terms.sla.tolerance} jam)
                </Text>
              </Box>

              {/* Quality Tolerance */}
              {(terms.qualityTolerance.mortalityMax || terms.qualityTolerance.sizeTolerance) && (
                <Box>
                  <Text fontSize="xs" color={textSecondary} mb={1}>
                    Toleransi Mutu
                  </Text>
                  <Text fontSize="sm" color={textPrimary}>
                    {terms.qualityTolerance.mortalityMax && `Mortalitas maks: ${terms.qualityTolerance.mortalityMax}%`}
                    {terms.qualityTolerance.mortalityMax && terms.qualityTolerance.sizeTolerance && ' | '}
                    {terms.qualityTolerance.sizeTolerance && `Toleransi ukuran: ±${terms.qualityTolerance.sizeTolerance}%`}
                  </Text>
                </Box>
              )}

              {/* Penalties */}
              <Box>
                <Text fontSize="xs" color={textSecondary} mb={1}>
                  Denda
                </Text>
                <Text fontSize="sm" color={textPrimary}>
                  Keterlambatan: {terms.penaltyRules.lateDelivery}% dari nilai order
                  {' | '}
                  Masalah mutu: {terms.penaltyRules.qualityIssue}% dari nilai order
                </Text>
              </Box>

              {/* Cancellation */}
              <Box>
                <Text fontSize="xs" color={textSecondary} mb={1}>
                  Pembatalan
                </Text>
                <Text fontSize="sm" color={textPrimary}>
                  Biaya pembatalan pembeli: {terms.cancellationRules.buyerCancellationFee}%
                  {' | '}
                  Supplier: {terms.cancellationRules.supplierCancellationFee}%
                </Text>
              </Box>
            </VStack>
          </Box>

          {/* Created Date */}
          <Box>
            <Text fontSize="xs" color={textSecondary}>
              Dibuat: {createdAt.toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
}


