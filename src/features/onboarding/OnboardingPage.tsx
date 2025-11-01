import { Container, VStack, HStack, Heading, Text, Box } from '@chakra-ui/react';
import { Alert } from '../../components/feedback/Alert';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '../../components/navbar/Navbar';
import { Card, CardBody } from '../../components/surfaces/Card';
import { Button } from '../../components/button/Button';
import { useColorModeValue } from '../../components/ui/color-mode';
import { LocationStep, type LocationFormData } from './components/LocationStep';
import { ProjectDetailsStep, type ProjectDetailsFormData } from './components/ProjectDetailsStep';
import { RiskLevelStep, type RiskLevelFormData } from './components/RiskLevelStep';
import { saveDraft, loadDraft } from '../../utils/storage';
import { createProject } from './services/projectApi';
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';

const TOTAL_STEPS = 3;
const DRAFT_KEY = 'onboarding-project';

export interface OnboardingFormData extends LocationFormData, ProjectDetailsFormData, RiskLevelFormData {}

/**
 * Onboarding Wizard Page - Multi-step form untuk membuat rencana budidaya
 */
export function OnboardingPage() {
  const navigate = useNavigate();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    kabupaten_id: '',
    lang: undefined,
    lat: undefined,
    jenis_ikan: '',
    modal: 10_000_000, // Default to minimum
    resiko: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft<OnboardingFormData>(DRAFT_KEY);
    if (draft) {
      setFormData(draft);
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(DRAFT_KEY, formData);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData]);


  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.kabupaten_id) {
        errors.kabupaten_id = 'Kabupaten/Kota harus dipilih';
      }
    } else if (currentStep === 2) {
      if (!formData.jenis_ikan) {
        errors.jenis_ikan = 'Jenis ikan harus dipilih';
      }

      if (!formData.modal || formData.modal < 10_000_000) {
        errors.modal = 'Modal minimal Rp 10.000.000';
      }
    } else if (currentStep === 3) {
      if (!formData.resiko) {
        errors.resiko = 'Tingkat risiko harus dipilih';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const projectData = {
        jenis_ikan: formData.jenis_ikan as 'NILA' | 'LELE' | 'GURAME',
        modal: formData.modal,
        kabupaten_id: formData.kabupaten_id,
        resiko: formData.resiko as 'KONSERVATIF' | 'MODERAT' | 'AGRESIF',
        ...(formData.lang !== undefined && { lang: formData.lang }),
        ...(formData.lat !== undefined && { lat: formData.lat }),
      };

      const response = await createProject(projectData);
      
      // Navigate to project result page with response data
      // Navigate using project ID so it can be accessed via URL
      navigate(`/onboarding/result/${response.data.id}`, { state: { projectResult: response } });
    } catch (err: any) {
      const errorMessage = err.message || 'Terjadi kesalahan saat membuat proyek';
      setError(errorMessage);
      
      // Handle validation errors from API
      if (err.errors) {
        setFormErrors(err.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = (): boolean => {
    if (currentStep === 1) {
      return !!formData.kabupaten_id && Object.keys(formErrors).length === 0;
    } else if (currentStep === 2) {
      return !!(
        formData.jenis_ikan &&
        formData.modal >= 10_000_000 &&
        Object.keys(formErrors).length === 0
      );
    } else if (currentStep === 3) {
      return !!(
        formData.resiko &&
        Object.keys(formErrors).length === 0
      );
    }
    return false;
  };

  const stepLabels = ['Lokasi Proyek', 'Detail Proyek', 'Tingkat Risiko'];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <LocationStep
            data={{
              kabupaten_id: formData.kabupaten_id,
              lang: formData.lang,
              lat: formData.lat,
            }}
            onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
            errors={formErrors}
          />
        );
      case 2:
        return (
          <ProjectDetailsStep
            data={{
              jenis_ikan: formData.jenis_ikan,
              modal: formData.modal,
            }}
            onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
            errors={formErrors}
          />
        );
      case 3:
        return (
          <RiskLevelStep
            data={{
              resiko: formData.resiko,
            }}
            onChange={(data) => setFormData((prev) => ({ ...prev, ...data }))}
            errors={formErrors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[{ label: 'Dashboard', href: '/dashboard' }]}
        cta={{ label: 'Dashboard', href: '/dashboard' }}
      />
      <Container maxW="4xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Header */}
          <VStack align="start" gap={2}>
            <HStack gap={2}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <HStack gap={2}>
                  <FiArrowLeft />
                  <Text>Kembali</Text>
                </HStack>
              </Button>
            </HStack>
            <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
              Onboarding - Rencana Budidaya Ikan
            </Heading>
            <Text fontSize="md" color={textSecondary}>
              Masukkan informasi proyek budidaya ikan Anda untuk membuat analisis kelayakan
            </Text>
          </VStack>

          {/* Progress Indicator */}
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
                Langkah {currentStep} dari {TOTAL_STEPS}
              </Text>
              <Text fontSize="sm" color={textSecondary}>
                {stepLabels[currentStep - 1]}
              </Text>
            </HStack>
            <Box
              w="full"
              h="2"
              bg={useColorModeValue('gray.200', 'gray.700')}
              borderRadius="full"
              overflow="hidden"
            >
              <Box
                h="full"
                bg="brand.600"
                w={`${(currentStep / TOTAL_STEPS) * 100}%`}
                transition="width 0.3s ease"
              />
            </Box>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert 
              status="error" 
              variant="subtle"
              title={error}
            />
          )}

          {/* Step Content */}
          <Card variant="elevated">
            <CardBody>
              {renderStep()}
            </CardBody>
          </Card>

          {/* Navigation Buttons */}
          <HStack justify="space-between" gap={4}>
            {currentStep === 1 ? (
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                disabled={isLoading}
              >
                <HStack gap={2}>
                  <FiArrowLeft />
                  <Text>Batal</Text>
                </HStack>
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
              >
                <HStack gap={2}>
                  <FiArrowLeft />
                  <Text>Sebelumnya</Text>
                </HStack>
              </Button>
            )}
            {currentStep < TOTAL_STEPS ? (
              <Button
                variant="solid"
                colorScheme="brand"
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
              >
                <HStack gap={2}>
                  <Text>Selanjutnya</Text>
                  <FiArrowRight />
                </HStack>
              </Button>
            ) : (
              <Button
                variant="solid"
                colorScheme="brand"
                onClick={handleSubmit}
                disabled={!isStepValid() || isLoading}
                loading={isLoading}
                loadingText="Menyimpan..."
              >
                <HStack gap={2}>
                  {!isLoading && <FiCheck />}
                  <Text>Buat Proyek</Text>
                </HStack>
              </Button>
            )}
          </HStack>
        </VStack>
      </Container>
    </>
  );
}

