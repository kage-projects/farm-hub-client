/**
 * Quick Plan Page - AI-driven plan generation from 4 simple inputs
 * Flow: Input → Generate 3 Plans → Select → Customize → View Full Plan
 */

import { useState } from 'react';
import { 
  Box, 
  Container, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  SimpleGrid,
} from '@chakra-ui/react';
import { useColorModeValue } from '../components/ui/color-mode';
import { Navbar } from '../components/navbar/Navbar';
import { Button } from '../components/button/Button';
import { Card, CardHeader, CardBody } from '../components/surfaces/Card';
import { FormInput } from '../components/forms/FormInput';
import { FormCurrencyInput } from '../components/forms/FormCurrencyInput';
import { Select } from '../components/forms/Select';
import { Alert } from '../components/feedback/Alert';
import { Tag } from '../components/badges/Tag';
import { generatePlans, type Plan, type PlanInput } from '../utils/ai/planGenerator';
import { useNavigate } from 'react-router-dom';

type Step = 'input' | 'plans' | 'customize';

export function QuickPlanPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('input');
  const [loading, setLoading] = useState(false);
  
  // Input data
  const [lokasi, setLokasi] = useState('');
  const [modal, setModal] = useState(0);
  const [luasLahan, setLuasLahan] = useState(0);
  const [jenisIkan, setJenisIkan] = useState<'lele' | 'nila' | 'gurame' | ''>('');
  
  // Generated plans
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const bgSubtle = useColorModeValue('gray.50', 'gray.800');

  const speciesOptions = [
    { value: 'lele', label: 'Lele' },
    { value: 'nila', label: 'Nila' },
    { value: 'gurame', label: 'Gurame' },
  ];

  const handleGenerate = async () => {
    if (!lokasi || !modal || !luasLahan || !jenisIkan) {
      console.warn('Missing required fields:', { lokasi, modal, luasLahan, jenisIkan });
      return;
    }

    setLoading(true);
    try {
      const input: PlanInput = {
        lokasi,
        modal,
        luas_lahan: luasLahan,
        jenis_ikan: jenisIkan as 'lele' | 'nila' | 'gurame',
      };

      console.log('Generating plans with input:', input);
      const result = generatePlans(input);
      console.log('Generated plans result:', result);
      
      if (!result || !result.plans || result.plans.length === 0) {
        console.error('No plans generated!');
        alert('Terjadi kesalahan saat menghasilkan rencana. Silakan coba lagi.');
        return;
      }

      setPlans(result.plans);
      setStep('plans');
      console.log('Plans set, step changed to:', 'plans');
    } catch (error) {
      console.error('Error generating plans:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Terjadi kesalahan saat menghasilkan rencana'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setStep('customize');
  };

  const handleCustomize = () => {
    // Navigate to full plan page with selected plan data
    navigate('/plan', { 
      state: { 
        plan: selectedPlan,
        input: { lokasi, modal, luas_lahan: luasLahan, jenis_ikan: jenisIkan },
      }
    });
  };

  const renderInputStep = () => (
    <Container maxW="2xl" py={8}>
      <VStack gap={6} align="stretch">
        <Box>
          <Heading fontSize="2xl" fontWeight="bold" color={textPrimary} mb={2}>
            Buat Rencana Budidaya
          </Heading>
          <Text color={textSecondary}>
            Masukkan 4 informasi dasar. AI akan menghasilkan 3 rencana (Utama, Aman, Agresif) dengan perhitungan lengkap.
          </Text>
        </Box>

        <Card variant="elevated">
          <CardHeader>
            <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
              Informasi Proyek
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack gap={4} align="stretch">
              <FormInput
                label="Lokasi (Kecamatan/Kota)"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Contoh: Padang, Padang Panjang, dll"
                required
              />

              <FormCurrencyInput
                label="Modal Tersedia (Rp)"
                value={modal}
                onChange={setModal}
                required
                helperText="Total modal yang tersedia untuk investasi"
              />

              <FormInput
                label="Luas Lahan (m²)"
                type="number"
                min="1"
                value={luasLahan || ''}
                onChange={(e) => setLuasLahan(parseFloat(e.target.value) || 0)}
                placeholder="Contoh: 100"
                required
                helperText="Luas total lahan yang akan digunakan untuk kolam"
              />

              <Select
                label="Jenis Ikan"
                value={jenisIkan}
                onChange={(e) => setJenisIkan(e.target.value as any)}
                items={speciesOptions}
                required
              />

              <Alert status="info">
                <Text fontSize="sm">
                  AI akan menghitung: layout kolam otomatis, kapasitas tebar, siklus panen, biaya, ROI, risiko, dan rekomendasi supplier.
                </Text>
              </Alert>

              {loading ? (
                <Box textAlign="center" py={4}>
                  <Text fontSize="md" color={textSecondary} mb={2}>
                    Sedang menghasilkan rencana...
                  </Text>
                  <Box
                    width="100%"
                    height="8px"
                    bg={useColorModeValue('gray.200', 'gray.700')}
                    borderRadius="md"
                    position="relative"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      height="100%"
                      width="30%"
                      bg="brand.500"
                      borderRadius="md"
                      animation="loading 1.5s ease-in-out infinite"
                      css={{
                        '@keyframes loading': {
                          '0%': { transform: 'translateX(-100%)' },
                          '100%': { transform: 'translateX(400%)' },
                        },
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Button
                  onClick={handleGenerate}
                  disabled={!lokasi || !modal || !luasLahan || !jenisIkan}
                  colorScheme="brand"
                  size="lg"
                  width="full"
                >
                  Generate Rencana
                </Button>
              )}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );

  const renderPlansStep = () => {
    const variantLabels = {
      utama: { label: 'Rencana Utama', color: 'brand' as const },
      aman: { label: 'Rencana Aman', color: 'secondary' as const },
      agresif: { label: 'Rencana Agresif', color: 'accent' as const },
    };

    if (plans.length === 0) {
      return (
        <Container maxW="6xl" py={8}>
          <Alert status="warning">
            <Text>Tidak ada rencana yang dihasilkan. Silakan coba lagi atau periksa input Anda.</Text>
          </Alert>
          <Button onClick={() => setStep('input')} mt={4}>
            Kembali ke Input
          </Button>
        </Container>
      );
    }

    return (
      <Container maxW="6xl" py={8}>
        <VStack gap={6} align="stretch">
          <Box>
            <Heading fontSize="2xl" fontWeight="bold" color={textPrimary} mb={2}>
              Tiga Rencana Budidaya
            </Heading>
            <Text color={textSecondary}>
              Pilih salah satu rencana yang sesuai dengan profil risiko Anda, atau klik untuk menyesuaikan detail.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            {plans.map((plan) => {
              const variant = variantLabels[plan.variant];
              const riskColor = plan.risiko.label === 'Rendah' ? 'green' : 
                               plan.risiko.label === 'Sedang' ? 'yellow' : 'red';

              return (
                <Card 
                  key={plan.variant} 
                  variant="elevated"
                  onClick={() => handleSelectPlan(plan)}
                  cursor="pointer"
                  _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  <CardHeader>
                    <HStack justify="space-between" mb={2}>
                      <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                        {variant.label}
                      </Heading>
                      <Tag colorScheme={variant.color}>{variant.label}</Tag>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack gap={4} align="stretch">
                      <Box>
                        <Text fontSize="xs" color={textSecondary} mb={1}>Kapasitas Tebar</Text>
                        <Text fontSize="lg" fontWeight="bold" color={textPrimary}>
                          {plan.kapasitas_tebar.toLocaleString('id-ID')} ekor
                        </Text>
                      </Box>

                      <Box>
                        <Text fontSize="xs" color={textSecondary} mb={1}>ROI</Text>
                        <Text fontSize="xl" fontWeight="bold" color={plan.hasil.ROI > 0 ? 'green.500' : 'red.500'}>
                          {plan.hasil.ROI > 0 ? '+' : ''}{plan.hasil.ROI.toFixed(1)}%
                        </Text>
                      </Box>

                      <Box>
                        <Text fontSize="xs" color={textSecondary} mb={1}>Siklus Panen</Text>
                        <Text fontSize="sm" color={textPrimary}>
                          {plan.siklus_panen.minggu} minggu ({plan.siklus_panen.hari} hari)
                        </Text>
                      </Box>

                      <Box>
                        <Text fontSize="xs" color={textSecondary} mb={1}>Risiko</Text>
                        <VStack align="stretch" gap={2}>
                          <HStack>
                            <Tag colorScheme={riskColor} size="sm">
                              {plan.risiko.label}
                            </Tag>
                            <Text fontSize="xs" color={textSecondary}>
                              ({plan.risiko.score_0_100}/100)
                            </Text>
                          </HStack>
                          <Box
                            width="100%"
                            height="6px"
                            bg={useColorModeValue('gray.200', 'gray.700')}
                            borderRadius="md"
                            position="relative"
                            overflow="hidden"
                          >
                            <Box
                              height="100%"
                              width={`${plan.risiko.score_0_100}%`}
                              bg={`${riskColor}.500`}
                              borderRadius="md"
                            />
                          </Box>
                        </VStack>
                      </Box>

                      <Box>
                        <Text fontSize="xs" color={textSecondary} mb={1}>Biaya Total</Text>
                        <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                          Rp {plan.biaya.total.toLocaleString('id-ID')}
                        </Text>
                      </Box>

                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan(plan);
                        }}
                        colorScheme={variant.color}
                        width="full"
                        mt={2}
                      >
                        Lihat Detail & Custom
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>

          <Button
            onClick={() => setStep('input')}
            variant="outline"
            width="full"
            maxW="md"
            mx="auto"
          >
            Kembali ke Input
          </Button>
        </VStack>
      </Container>
    );
  };

  const renderCustomizeStep = () => {
    if (!selectedPlan) return null;

    // Calculate risk components (we need to get this from planGenerator)
    // For now, we'll create a simplified version
    const riskColor = selectedPlan.risiko.label === 'Rendah' ? 'green' : 
                     selectedPlan.risiko.label === 'Sedang' ? 'yellow' : 'red';

    // Risk components breakdown
    const riskComponents = [
      { 
        name: 'Tight Cashflow', 
        value: selectedPlan.risiko.components?.tightCashflow || 0, 
        max: 30, 
        desc: 'Modal vs biaya total. Semakin tinggi berarti modal kurang mencukupi atau buffer terbatas.' 
      },
      { 
        name: 'Biaya Pakan & FCR', 
        value: selectedPlan.risiko.components?.biayaPakanFCR || 0, 
        max: 25, 
        desc: 'Proporsi biaya pakan dan efisiensi FCR. FCR tinggi = lebih boros pakan.' 
      },
      { 
        name: 'Kepadatan Tebar', 
        value: selectedPlan.risiko.components?.kepadatan || 0, 
        max: 15, 
        desc: 'Kepadatan vs rekomendasi maksimal. Terlalu padat = risiko kematian tinggi.' 
      },
      { 
        name: 'Akses Pasar', 
        value: selectedPlan.risiko.components?.aksesPasar || 0, 
        max: 15, 
        desc: 'Jarak pasar dan ongkir. Jarak jauh dan ongkir tinggi meningkatkan risiko distribusi.' 
      },
      { 
        name: 'Supplier QC', 
        value: selectedPlan.risiko.components?.supplierQC || 0, 
        max: 15, 
        desc: 'Kualitas dan track record supplier. Supplier kurang terpercaya = risiko kualitas rendah.' 
      },
    ];

    return (
      <Container maxW="6xl" py={8}>
        <VStack gap={6} align="stretch">
          <Box>
            <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
              <VStack align="start" gap={1}>
                <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                  Detail Rencana & Perhitungan Risiko
                </Heading>
                <Text color={textSecondary}>
                  Ulasan lengkap rencana yang dipilih dan breakdown perhitungan risiko. Anda bisa menyesuaikan parameter detail nantinya.
                </Text>
              </VStack>
              <Button
                onClick={() => setStep('plans')}
                variant="outline"
              >
                Kembali ke Pilihan
              </Button>
            </HStack>
          </Box>

          {/* Risk Breakdown Section */}
          <Card variant="elevated">
            <CardHeader>
              <HStack justify="space-between">
                <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                  Perhitungan Risiko Detail
                </Heading>
                <Tag colorScheme={riskColor} size="md">
                  {selectedPlan.risiko.label} ({selectedPlan.risiko.score_0_100}/100)
                </Tag>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack gap={4} align="stretch">
                {/* Overall Risk Score */}
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      Skor Risiko Total
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color={`${riskColor}.500`}>
                      {selectedPlan.risiko.score_0_100}/100
                    </Text>
                  </HStack>
                  <Progress 
                    value={selectedPlan.risiko.score_0_100} 
                    colorScheme={riskColor}
                    size="lg"
                    borderRadius="md"
                    bg={useColorModeValue(`${riskColor}.100`, `${riskColor}.900`)}
                  />
                </Box>

                {/* Top 3 Reasons */}
                <Box>
                  <Text fontSize="sm" fontWeight="semibold" color={textPrimary} mb={2}>
                    Top 3 Alasan Risiko
                  </Text>
                  <VStack align="stretch" gap={2}>
                    {selectedPlan.risiko.alasan_top3.map((alasan, idx) => (
                      <HStack key={idx} align="start" p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                        <Box
                          minW={6}
                          h={6}
                          borderRadius="full"
                          bg={`${riskColor}.500`}
                          color="white"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="xs"
                          fontWeight="bold"
                        >
                          {idx + 1}
                        </Box>
                        <Text fontSize="sm" color={textPrimary} flex={1}>
                          {alasan}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                {/* Risk Components Breakdown */}
                <Box>
                  <HStack justify="space-between" mb={3}>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      Breakdown Komponen Risiko
                    </Text>
                    <Text fontSize="xs" color={textSecondary}>
                      (Dapat disesuaikan detail nantinya)
                    </Text>
                  </HStack>
                  <VStack gap={3} align="stretch">
                    {riskComponents.map((component, idx) => {
                      const componentValue = component.value;
                      const componentPercentage = Math.round((componentValue / component.max) * 100);
                      return (
                        <Box key={idx}>
                          <HStack justify="space-between" mb={1}>
                            <VStack align="start" gap={0} flex={1}>
                              <HStack justify="space-between" width="100%">
                                <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                                  {component.name}
                                </Text>
                                <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                                  {componentValue}/{component.max} ({componentPercentage}%)
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color={textSecondary} mt={0.5}>
                                {component.desc}
                              </Text>
                            </VStack>
                          </HStack>
                          <Box
                            width="100%"
                            height="6px"
                            bg={useColorModeValue('gray.200', 'gray.700')}
                            borderRadius="md"
                            position="relative"
                            overflow="hidden"
                          >
                            <Box
                              height="100%"
                              width={`${Math.min(100, (componentValue / component.max) * 100)}%`}
                              bg={`${riskColor}.500`}
                              borderRadius="md"
                            />
                          </Box>
                        </Box>
                      );
                    })}
                  </VStack>
                </Box>

                {/* Placeholder for future customization */}
                <Alert status="info">
                  <VStack align="start" gap={1}>
                    <Text fontSize="sm" fontWeight="semibold">
                      Custom Detail Risiko (Coming Soon)
                    </Text>
                    <Text fontSize="xs">
                      Fitur untuk menyesuaikan parameter detail risiko (modal buffer, FCR target, kepadatan optimal, dll) akan tersedia di update berikutnya.
                    </Text>
                  </VStack>
                </Alert>
              </VStack>
            </CardBody>
          </Card>

          {/* Plan Summary */}
          <Card variant="elevated">
            <CardHeader>
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Ringkasan Rencana
              </Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
                <Box>
                  <Text fontSize="xs" color={textSecondary} mb={1}>Varian</Text>
                  <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                    {selectedPlan.variant === 'utama' ? 'Rencana Utama' :
                     selectedPlan.variant === 'aman' ? 'Rencana Aman' : 'Rencana Agresif'}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color={textSecondary} mb={1}>Kapasitas Tebar</Text>
                  <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                    {selectedPlan.kapasitas_tebar.toLocaleString('id-ID')} ekor
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color={textSecondary} mb={1}>ROI</Text>
                  <Text fontSize="md" fontWeight="semibold" color={selectedPlan.hasil.ROI > 0 ? 'green.500' : 'red.500'}>
                    {selectedPlan.hasil.ROI > 0 ? '+' : ''}{selectedPlan.hasil.ROI.toFixed(1)}%
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color={textSecondary} mb={1}>Biaya Total</Text>
                  <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                    Rp {selectedPlan.biaya.total.toLocaleString('id-ID')}
                  </Text>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <HStack gap={3} justify="center">
            <Button
              onClick={() => setStep('plans')}
              variant="outline"
            >
              Kembali ke Pilihan
            </Button>
            <Button
              onClick={handleCustomize}
              colorScheme="brand"
              size="lg"
            >
              Lihat Rencana Lengkap
            </Button>
          </HStack>
        </VStack>
      </Container>
    );
  };

  return (
    <>
      <Navbar />
      <Box minH="100vh" bg={bgSubtle} pt={20}>
        {loading && step === 'input' ? (
          <Container maxW="2xl" py={8}>
            <Card variant="elevated">
              <CardBody>
                <VStack gap={4}>
                  <Text fontSize="lg" color={textPrimary} fontWeight="semibold">
                    Sedang menghasilkan rencana...
                  </Text>
                  <Box
                    width="100%"
                    height="12px"
                    bg={useColorModeValue('gray.200', 'gray.700')}
                    borderRadius="md"
                    position="relative"
                    overflow="hidden"
                  >
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      height="100%"
                      width="30%"
                      bg="brand.500"
                      borderRadius="md"
                      animation="loading 1.5s ease-in-out infinite"
                      css={{
                        '@keyframes loading': {
                          '0%': { transform: 'translateX(-100%)' },
                          '100%': { transform: 'translateX(400%)' },
                        },
                      }}
                    />
                  </Box>
                  <Text fontSize="sm" color={textSecondary}>
                    Mohon tunggu sebentar
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </Container>
        ) : (
          <>
            {step === 'input' && renderInputStep()}
            {step === 'plans' && renderPlansStep()}
            {step === 'customize' && renderCustomizeStep()}
          </>
        )}
      </Box>
    </>
  );
}

