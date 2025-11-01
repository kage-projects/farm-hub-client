import { Container, VStack, HStack, Heading, Text, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { Button } from '../components/button/Button';
import { Card, CardBody } from '../components/surfaces/Card';
import { useColorModeValue } from '../components/ui/color-mode';
import { RFQForm, type RFQFormData } from '../components/rfq/RFQForm';
import { SupplierRecommender } from '../components/ai/SupplierRecommender';
import { DealAdvisor } from '../components/ai/DealAdvisor';
import { FiArrowLeft, FiSend } from 'react-icons/fi';

/**
 * RFQ Page - Create Request for Quotation
 */
export function RFQPage() {
  const navigate = useNavigate();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const [formData, setFormData] = useState<RFQFormData>({
    itemCategory: '',
    itemName: '',
    specification: '',
    size: '',
    quantity: 0,
    unit: '',
    deliveryDate: '',
    deliveryAddress: '',
    minSLA: 0,
    allowedPriceModels: [],
    requireEscrow: true,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.itemCategory) {
      newErrors.itemCategory = 'Pilih kategori item';
    }
    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Masukkan nama item';
    }
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Jumlah harus lebih dari 0';
    }
    if (!formData.unit.trim()) {
      newErrors.unit = 'Masukkan unit';
    }
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Pilih tanggal butuh';
    }
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Masukkan alamat pengiriman';
    }
    if (formData.minSLA <= 0) {
      newErrors.minSLA = 'SLA minimum harus lebih dari 0';
    }
    if (!formData.allowedPriceModels || formData.allowedPriceModels.length === 0) {
      newErrors.allowedPriceModels = 'Pilih minimal satu model harga';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Simulate RFQ creation - in real app, send to backend
    const rfqId = `rfq-${Date.now()}`;
    localStorage.setItem('current_rfq', JSON.stringify({ id: rfqId, ...formData }));
    navigate(`/rfq/${rfqId}/quotation`);
  };

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
      <Container maxW="4xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Header */}
          <HStack gap={4}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/suppliers')}
              leftIcon={<FiArrowLeft />}
            >
              Kembali
            </Button>
            <VStack align="start" gap={1} flex={1}>
              <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                Buat Request for Quotation (RFQ)
              </Heading>
              <Text fontSize="md" color={textSecondary}>
                Minta penawaran harga dari supplier sesuai kebutuhan Anda
              </Text>
            </VStack>
          </HStack>

          {/* AI Supplier Recommendations */}
          {formData.itemCategory && (
            <Card variant="elevated">
              <CardBody>
                <SupplierRecommender
                  category={formData.itemCategory as any}
                  onSelectSupplier={(supplierId) => {
                    console.log('Selected supplier for RFQ:', supplierId);
                  }}
                />
              </CardBody>
            </Card>
          )}

          {/* Deal Advisor */}
          {formData.allowedPriceModels && formData.allowedPriceModels.length > 0 && (
            <Card variant="elevated">
              <CardBody>
                <DealAdvisor
                  item={formData.itemName || formData.itemCategory}
                  horizonWeeks={formData.itemCategory === 'pakan' ? 4 : 1}
                  volatility30d={0.12}
                  volume={formData.quantity}
                  riskAppetite="medium"
                />
              </CardBody>
            </Card>
          )}

          {/* RFQ Form */}
          <form onSubmit={handleSubmit}>
            <VStack gap={6} align="stretch">
              <RFQForm data={formData} onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))} errors={errors} />

              {/* Actions */}
              <HStack gap={4} justify="flex-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/suppliers')}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="solid"
                  colorScheme="brand"
                  leftIcon={<FiSend />}
                >
                  Kirim RFQ
                </Button>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Container>
    </>
  );
}

