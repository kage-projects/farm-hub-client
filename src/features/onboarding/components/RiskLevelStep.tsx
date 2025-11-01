import { VStack, Box, HStack, SimpleGrid, Heading, Text } from '@chakra-ui/react';
import { WizardStep } from '../../../components/onboarding/WizardStep';
import { Card, CardBody } from '../../../components/surfaces/Card';
import { useColorModeValue } from '../../../components/ui/color-mode';
import { FiCheck, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';

export interface RiskLevelFormData {
  resiko: '' | 'KONSERVATIF' | 'MODERAT' | 'AGRESIF';
}

export interface RiskLevelStepProps {
  data: RiskLevelFormData;
  onChange: (data: Partial<RiskLevelFormData>) => void;
  errors?: Record<string, string>;
}

interface RiskLevelOption {
  value: 'KONSERVATIF' | 'MODERAT' | 'AGRESIF';
  label: string;
  icon: React.ReactNode;
  description: string;
  characteristics: string[];
  color: string;
  bgColor: string;
  borderColor: string;
}

const riskLevelOptions: RiskLevelOption[] = [
  {
    value: 'KONSERVATIF',
    label: 'Konservatif',
    icon: <FiCheck size={24} />,
    description: 'Pendekatan aman dengan risiko rendah dan profit yang lebih stabil',
    characteristics: [
      'Risiko rendah dengan profit stabil',
      'ROI lebih kecil namun lebih konsisten',
      'Sesuai untuk pemula',
      'Perencanaan lebih terstruktur',
      'Minimal fluktuasi harga',
    ],
    color: 'success',
    bgColor: 'green.50',
    borderColor: 'green.300',
  },
  {
    value: 'MODERAT',
    label: 'Moderat',
    icon: <FiAlertCircle size={24} />,
    description: 'Keseimbangan antara risiko dan potensi profit',
    characteristics: [
      'Risiko dan profit seimbang',
      'ROI menengah dengan variabilitas wajar',
      'Cocok untuk investor berpengalaman',
      'Fleksibilitas dalam perencanaan',
      'Perlindungan risiko sedang',
    ],
    color: 'warning',
    bgColor: 'yellow.50',
    borderColor: 'yellow.300',
  },
  {
    value: 'AGRESIF',
    label: 'Agresif',
    icon: <FiTrendingUp size={24} />,
    description: 'Strategi berani dengan risiko tinggi untuk potensi profit maksimal',
    characteristics: [
      'Risiko tinggi dengan potensi profit besar',
      'ROI tinggi namun lebih fluktuatif',
      'Untuk investor yang toleran risiko',
      'Strategi lebih fleksibel',
      'Perlu monitoring intensif',
    ],
    color: 'error',
    bgColor: 'red.50',
    borderColor: 'red.300',
  },
];

/**
 * Risk Level Step - Select risk level with informative cards
 */
export function RiskLevelStep({ data, onChange, errors }: RiskLevelStepProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleRiskSelect = (risk: 'KONSERVATIF' | 'MODERAT' | 'AGRESIF') => {
    onChange({ resiko: risk });
  };

  return (
    <WizardStep
      title="Tingkat Risiko"
      description="Pilih tingkat risiko yang sesuai dengan profil investasi Anda"
    >
      <VStack gap={6} align="stretch">
        <Text fontSize="sm" color={textSecondary}>
          Setiap tingkat risiko memiliki karakteristik, potensi profit, dan strategi yang berbeda. Pilih sesuai dengan preferensi dan kemampuan Anda.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          {riskLevelOptions.map((option) => {
            const isSelected = data.resiko === option.value;
            const optionBgColorLight = useColorModeValue(
              option.bgColor,
              'gray.800'
            );
            const optionBgColorDark = useColorModeValue(
              'white',
              'gray.800'
            );
            const optionBorderColor = isSelected
              ? option.borderColor
              : useColorModeValue('gray.200', 'gray.700');
            const selectedBorderColor = option.borderColor;

            return (
              <Card
                key={option.value}
                variant="elevated"
                cursor="pointer"
                onClick={() => handleRiskSelect(option.value)}
                border="2px solid"
                borderColor={isSelected ? selectedBorderColor : optionBorderColor}
                bg={isSelected ? optionBgColorLight : optionBgColorDark}
                transform={isSelected ? 'translateY(-4px)' : 'translateY(0)'}
                boxShadow={
                  isSelected
                    ? useColorModeValue(
                        `0 8px 24px -8px ${option.borderColor}`,
                        `0 8px 24px -8px ${option.borderColor}`
                      )
                    : undefined
                }
                position="relative"
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                _hover={{
                  transform: 'translateY(-4px)',
                  borderColor: selectedBorderColor,
                }}
              >
                {isSelected && (
                  <Box
                    position="absolute"
                    top={2}
                    right={2}
                    w={6}
                    h={6}
                    borderRadius="full"
                    bg={selectedBorderColor}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                  >
                    <FiCheck size={16} />
                  </Box>
                )}

                <CardBody>
                  <VStack gap={4} align="stretch" textAlign="left">
                    <HStack gap={3} align="start">
                      <Box
                        color={useColorModeValue(option.borderColor, option.borderColor)}
                        flexShrink={0}
                      >
                        {option.icon}
                      </Box>
                      <VStack align="start" gap={1} flex={1}>
                        <Heading fontSize="lg" fontWeight="bold" color={textPrimary}>
                          {option.label}
                        </Heading>
                        <Text fontSize="xs" color={textSecondary} lineHeight="1.4">
                          {option.description}
                        </Text>
                      </VStack>
                    </HStack>

                    <Box pt={2} borderTop="1px solid" borderColor={borderColor}>
                      <Text fontSize="xs" fontWeight="semibold" color={textSecondary} mb={2}>
                        Karakteristik:
                      </Text>
                      <VStack align="start" gap={1.5}>
                        {option.characteristics.map((char, idx) => (
                          <HStack key={idx} gap={2} align="start">
                            <Box
                              w={1}
                              h={1}
                              borderRadius="full"
                              bg={useColorModeValue(option.borderColor, option.borderColor)}
                              mt={1.5}
                              flexShrink={0}
                            />
                            <Text fontSize="xs" color={textSecondary} lineHeight="1.4">
                              {char}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>

        {errors?.resiko && (
          <Box fontSize="xs" color="red.500" mt={-2}>
            {errors.resiko}
          </Box>
        )}

        <Box
          fontSize="xs"
          color={textSecondary}
          p={3}
          borderRadius="md"
          bg={useColorModeValue('blue.50', 'blue.900')}
          border="1px solid"
          borderColor={useColorModeValue('blue.200', 'blue.700')}
        >
          <Text fontWeight="medium" mb={1}>
            💡 Tips Memilih Tingkat Risiko:
          </Text>
          <Text>
            Pertimbangkan pengalaman, modal, dan toleransi risiko Anda. Pemula disarankan memilih Konservatif, sedangkan investor berpengalaman bisa memilih Moderat atau Agresif sesuai strategi investasi.
          </Text>
        </Box>
      </VStack>
    </WizardStep>
  );
}

