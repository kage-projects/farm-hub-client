import { Container, VStack, HStack, Heading, Text, Box } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { Button as CustomButton } from '../components/button/Button';
import { Card, CardBody } from '../components/surfaces/Card';
import { useColorModeValue } from '../components/ui/color-mode';
import { RFQForm, type RFQFormData } from '../components/rfq/RFQForm';
import { SupplierRecommender } from '../components/ai/SupplierRecommender';
import { DealAdvisor } from '../components/ai/DealAdvisor';
import { FiArrowLeft, FiSend, FiInfo } from 'react-icons/fi';
import { usePurchaseStore } from '../store/purchaseStore';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';
import { Alert } from '../components/feedback/Alert';

/**
 * RFQ Page - Create Request for Quotation
 */
export function RFQPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { rfqPrefillData, clearRFQPrefillData } = usePurchaseStore();
  
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  // Get prefill data from location.state or store
  const statePrefill = (location.state as { prefillData?: any })?.prefillData;
  const prefillData = statePrefill || rfqPrefillData;

  // Map prefill data to RFQFormData format
  const getInitialFormData = (): RFQFormData => {
    if (!prefillData) {
      return {
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
      };
    }

    // Map category
    let itemCategory = '';
    if (prefillData.itemCategory === 'pakan') itemCategory = 'pakan';
    else if (prefillData.itemCategory === 'benih') itemCategory = 'bibit';
    else if (prefillData.itemCategory === 'peralatan') itemCategory = 'logistik';

    return {
      itemCategory: itemCategory || '',
      itemName: prefillData.itemCategory === 'pakan' ? 'Pakan Ikan' : 
                prefillData.itemCategory === 'benih' ? 'Benih Ikan' : 
                'Peralatan Budidaya',
      specification: prefillData.specification || '',
      size: '',
      quantity: prefillData.quantity || 0,
      unit: prefillData.itemCategory === 'pakan' ? 'kg' : 
            prefillData.itemCategory === 'benih' ? 'ekor' : 
            'unit',
      deliveryDate: prefillData.deliveryDate || '',
      deliveryAddress: '',
      minSLA: prefillData.itemCategory === 'benih' ? 72 : 48, // Default SLA based on item type
      allowedPriceModels: prefillData.spesifikasiKetat || prefillData.nilaiBesar 
        ? ['fixed', 'indexed'] 
        : ['spot', 'fixed'],
      requireEscrow: true,
      notes: prefillData.jadwalBertahap ? 'Perlu pengiriman bertahap (mingguan)' : '',
    };
  };

  const [formData, setFormData] = useState<RFQFormData>(getInitialFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when prefill data changes
  useEffect(() => {
    if (prefillData) {
      const initialData = getInitialFormData();
      setFormData(initialData);
    }
  }, [prefillData]);

  // Clear prefill data after form is submitted or page is left
  useEffect(() => {
    return () => {
      // Clear prefill data when leaving page (only if form was not submitted)
      // In real app, you might want to clear only on successful submission
    };
  }, []);

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

    // Clear prefill data after successful submission
    clearRFQPrefillData();

    // Simulate RFQ creation - in real app, send to backend
    const rfqId = `rfq-${Date.now()}`;
    localStorage.setItem('current_rfq', JSON.stringify({ id: rfqId, ...formData }));
    navigate(`/rfq/${rfqId}/quotation`);
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    prefillData?.projectId ? { label: 'Plan Detail', href: `/plan-detail/${prefillData.projectId}` } : null,
    { label: 'Buat RFQ', href: '/rfq' },
  ].filter(Boolean) as Array<{ label: string; href: string }>;

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
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Header */}
          <HStack gap={4}>
            <CustomButton
              variant="ghost"
              size="sm"
              onClick={() => {
                if (prefillData?.projectId) {
                  navigate(`/plan-detail/${prefillData.projectId}`);
                } else {
                  navigate('/suppliers');
                }
              }}
              leftIcon={<FiArrowLeft />}
            >
              Kembali
            </CustomButton>
            <VStack align="start" gap={1} flex={1}>
              <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                Buat Request for Quotation (RFQ)
              </Heading>
              <Text fontSize="md" color={textSecondary}>
                Minta penawaran harga dari supplier sesuai kebutuhan Anda
              </Text>
            </VStack>
          </HStack>

          {/* Prefill Info Alert */}
          {prefillData && (
            <Alert
              status="info"
              variant="subtle"
              title="Form sudah diisi otomatis"
              description="Data dari rekomendasi supplier telah diisi. Anda dapat mengubahnya sesuai kebutuhan."
              icon={<FiInfo />}
            />
          )}

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
                <CustomButton
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/suppliers')}
                >
                  Batal
                </CustomButton>
                <CustomButton
                  type="submit"
                  variant="solid"
                  colorScheme="brand"
                  leftIcon={<FiSend />}
                >
                  Kirim RFQ
                </CustomButton>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Container>
    </>
  );
}

