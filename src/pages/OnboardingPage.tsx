import { Container, VStack, HStack, Heading, Text, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { Card, CardBody } from '../components/surfaces/Card';
import { Button } from '../components/button/Button';
import { useColorModeValue } from '../components/ui/color-mode';
import { LocationStep, type LocationData } from '../components/onboarding/steps/LocationStep';
import { PondDetailsStep, type PondDetailsData } from '../components/onboarding/steps/PondDetailsStep';
import { TargetStep, type TargetData } from '../components/onboarding/steps/TargetStep';
import { ReviewStep, type ReviewData } from '../components/onboarding/steps/ReviewStep';
import { saveDraft, loadDraft } from '../utils/storage';
import { generateROS, type ROSResult } from '../utils/onboarding/rosGenerator';
import { generateThreeScenarios, getDefaultParameters, type ROIParameters } from '../utils/onboarding/roiCalculator';
import { calculateSurfaceArea } from '../utils/onboarding/validation';
import { FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';

const TOTAL_STEPS = 4;
const DRAFT_KEY = 'onboarding';

export interface OnboardingFormData {
  location: LocationData;
  pond: PondDetailsData;
  target: TargetData;
}

/**
 * Onboarding Wizard Page - Multi-step form untuk membuat rencana budidaya
 */
export function OnboardingPage() {
  const navigate = useNavigate();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    location: {
      province: 'Sumatra Barat',
      city: '',
      address: '',
      waterSource: '',
    },
    pond: {
      pondType: '',
      length: 0,
      width: 0,
      depth: 0,
      stockingDensity: 0,
      species: '',
    },
    target: {
      targetHarvestWeight: 0,
      targetHarvestDate: '',
      budget: 0,
    },
  });

  const [validationState, setValidationState] = useState<{
    isValid: boolean;
    warnings: string[];
    errors: string[];
  } | null>(null);

  const [rosPreview, setRosPreview] = useState<ROSResult | null>(null);
  const [roiPreview, setRoiPreview] = useState<{
    conservative: { roi: number; profit: number; bepPerKg: number };
    moderate: { roi: number; profit: number; bepPerKg: number };
    aggressive: { roi: number; profit: number; bepPerKg: number };
  } | null>(null);

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

  // Generate ROS and ROI preview when on review step
  useEffect(() => {
    if (currentStep === TOTAL_STEPS && formData.pond.pondType && formData.pond.species) {
      const surfaceArea = calculateSurfaceArea({
        length: formData.pond.length,
        width: formData.pond.width,
      });

      const totalFish = surfaceArea * formData.pond.stockingDensity;
      
      if (totalFish > 0 && formData.target.targetHarvestWeight > 0) {
        const rosResult = generateROS({
          species: formData.pond.species,
          totalFish: Math.floor(totalFish),
          surfaceArea,
          targetHarvestWeight: formData.target.targetHarvestWeight,
          targetHarvestDate: new Date(formData.target.targetHarvestDate),
          startDate: new Date(),
        });
        setRosPreview(rosResult);

        // Generate ROI scenarios
        const defaultParams = getDefaultParameters(formData.pond.species, surfaceArea);
        const roiParams: ROIParameters = {
          stockingDensity: formData.pond.stockingDensity,
          surfaceArea,
          sr: defaultParams.sr || 0.85,
          fcr: defaultParams.fcr || 1.2,
          feedPricePerKg: defaultParams.feedPricePerKg || 11000,
          seedPricePerFish: defaultParams.seedPricePerFish || 300,
          sellingPricePerKg: defaultParams.sellingPricePerKg || 28000,
          averageWeightAtHarvest: formData.target.targetHarvestWeight,
          otherCosts: defaultParams.otherCosts || 1800000,
          freightCost: defaultParams.freightCost || 500000,
        };

        const roiScenarios = generateThreeScenarios(roiParams);
        setRoiPreview({
          conservative: {
            roi: roiScenarios.conservative.roi,
            profit: roiScenarios.conservative.profit,
            bepPerKg: roiScenarios.conservative.bepPerKg,
          },
          moderate: {
            roi: roiScenarios.moderate.roi,
            profit: roiScenarios.moderate.profit,
            bepPerKg: roiScenarios.moderate.bepPerKg,
          },
          aggressive: {
            roi: roiScenarios.aggressive.roi,
            profit: roiScenarios.aggressive.profit,
            bepPerKg: roiScenarios.aggressive.bepPerKg,
          },
        });
      }
    }
  }, [currentStep, formData]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = () => {
    // Save final data and navigate to summary
    const summaryData = {
      formData,
      ros: rosPreview,
      roi: roiPreview,
    };
    // Store in localStorage for SummaryPage to read
    localStorage.setItem('onboarding_result', JSON.stringify(summaryData));
    navigate('/summary');
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(
          formData.location.city &&
          formData.location.address &&
          formData.location.waterSource
        );
      case 2:
        return !!(
          formData.pond.pondType &&
          formData.pond.length > 0 &&
          formData.pond.width > 0 &&
          formData.pond.depth > 0 &&
          formData.pond.stockingDensity > 0 &&
          formData.pond.species &&
          validationState?.isValid !== false
        );
      case 3:
        return !!(
          formData.target.targetHarvestWeight > 0 &&
          formData.target.targetHarvestDate &&
          formData.target.budget > 0
        );
      case 4:
        return validationState?.isValid !== false;
      default:
        return false;
    }
  };

  const stepLabels = [
    'Lokasi',
    'Detail Kolam',
    'Target Panen',
    'Review',
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <LocationStep
            data={formData.location}
            onChange={(data) => setFormData((prev) => ({ ...prev, location: { ...prev.location, ...data } }))}
          />
        );
      case 2:
        return (
          <PondDetailsStep
            data={formData.pond}
            onChange={(data) => setFormData((prev) => ({ ...prev, pond: { ...prev.pond, ...data } }))}
            onValidationChange={setValidationState}
          />
        );
      case 3:
        return (
          <TargetStep
            data={formData.target}
            onChange={(data) => setFormData((prev) => ({ ...prev, target: { ...prev.target, ...data } }))}
          />
        );
      case 4:
        return (
          <ReviewStep
            data={{
              location: formData.location,
              pond: formData.pond,
              target: formData.target,
            }}
            rosPreview={rosPreview ? {
              totalFeedRequired: rosPreview.totalFeedRequired,
              estimatedTimeToProperSize: rosPreview.estimatedTimeToProperSize,
              estimatedHarvestDate: rosPreview.estimatedHarvestDate,
            } : undefined}
            roiPreview={roiPreview || undefined}
            onGenerate={handleGenerate}
            isValid={isStepValid()}
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
                leftIcon={<FiArrowLeft />}
              >
                Kembali
              </Button>
            </HStack>
            <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
              Onboarding - Rencana Budidaya Ikan
            </Heading>
            <Text fontSize="md" color={textSecondary}>
              Ikuti langkah-langkah untuk membuat rencana operasional siklus (ROS) dan analisis finansial
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

          {/* Step Content */}
          <Card variant="elevated">
            <CardBody>
              {renderStep()}
            </CardBody>
          </Card>

          {/* Navigation Buttons */}
          <HStack justify="space-between" gap={4}>
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              leftIcon={<FiArrowLeft />}
            >
              Sebelumnya
            </Button>
            {currentStep < TOTAL_STEPS ? (
              <Button
                variant="solid"
                colorScheme="brand"
                onClick={handleNext}
                disabled={!isStepValid()}
                rightIcon={<FiArrowRight />}
              >
                Selanjutnya
              </Button>
            ) : (
              <Button
                variant="solid"
                colorScheme="brand"
                onClick={handleGenerate}
                disabled={!isStepValid()}
                leftIcon={<FiCheck />}
              >
                Generate ROS & ROI
              </Button>
            )}
          </HStack>
        </VStack>
      </Container>
    </>
  );
}

