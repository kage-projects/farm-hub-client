/**
 * AI Monitoring Component - Menampilkan guidance AI di setiap step
 */

import { VStack, HStack, Text, Box } from '@chakra-ui/react';
import { Card, CardHeader, CardBody } from '../surfaces/Card';
import { Checkbox } from '../forms/Checkbox';
import { useColorModeValue } from '../ui/color-mode';
import { FiCpu, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { useState } from 'react';

interface AIMonitoringProps {
  stepNumber: number;
  stepName: string;
  onReady: (ready: boolean) => void;
  requiredQuestions?: Array<{
    question: string;
    required: boolean;
  }>;
}

export function AIMonitoring({ stepNumber, stepName, onReady, requiredQuestions = [] }: AIMonitoringProps) {
  // All hooks must be called at top level
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const brand200 = useColorModeValue('brand.200', 'brand.700');
  const brand100 = useColorModeValue('brand.100', 'brand.900');
  const brand600 = useColorModeValue('brand.600', 'brand.400');
  const blue50 = useColorModeValue('blue.50', 'blue.900');
  const blue200 = useColorModeValue('blue.200', 'blue.700');
  const blue600 = useColorModeValue('blue.600', 'blue.300');
  const blue700 = useColorModeValue('blue.700', 'blue.300');
  const red600 = useColorModeValue('red.600', 'red.400');
  const green50 = useColorModeValue('green.50', 'green.900');
  const green200 = useColorModeValue('green.200', 'green.700');
  const green600 = useColorModeValue('green.600', 'green.400');
  const green700 = useColorModeValue('green.700', 'green.300');
  const orange50 = useColorModeValue('orange.50', 'orange.900');
  const orange200 = useColorModeValue('orange.200', 'orange.700');
  const orange600 = useColorModeValue('orange.600', 'orange.400');
  const orange700 = useColorModeValue('orange.700', 'orange.300');

  const [confirmations, setConfirmations] = useState<Record<number, boolean>>({});
  const [isReady, setIsReady] = useState(false);

  const handleConfirmationChange = (index: number, checked: boolean) => {
    const newConfirmations = { ...confirmations, [index]: checked };
    setConfirmations(newConfirmations);
    
    // Check if all required questions are confirmed
    const allRequiredConfirmed = requiredQuestions.every(
      (q, idx) => !q.required || newConfirmations[idx]
    );
    
    setIsReady(allRequiredConfirmed);
    onReady(allRequiredConfirmed);
  };

  // Default monitoring questions if none provided
  const monitoringQuestions = requiredQuestions.length > 0 
    ? requiredQuestions 
    : [
        {
          question: 'Saya telah membaca dan memahami semua kegiatan yang harus dilakukan di tahap ini',
          required: true,
        },
        {
          question: 'Saya telah menyiapkan semua resource dan bahan yang diperlukan',
          required: true,
        },
        {
          question: 'Saya siap untuk melaporkan kendala atau bertanya jika ada masalah',
          required: false,
        },
      ];

  return (
    <Card variant="elevated" border="2px solid" borderColor={brand200}>
      <CardHeader>
        <HStack gap={2}>
          <Box
            p={2}
            borderRadius="lg"
            bg={brand100}
            color={brand600}
          >
            <FiCpu size={18} />
          </Box>
          <VStack align="start" gap={0} flex={1}>
            <Heading fontSize="md" fontWeight="semibold" color={textPrimary}>
              AI Monitoring & Konfirmasi
            </Heading>
            <Text fontSize="xs" color={textSecondary}>
              Pastikan Anda siap sebelum melanjutkan ke step selanjutnya
            </Text>
          </VStack>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="stretch" gap={4}>
          {/* AI Guidance */}
          <Box
            p={3}
            borderRadius="md"
            bg={blue50}
            border="1px solid"
            borderColor={blue200}
          >
            <HStack gap={2} mb={2}>
              <FiInfo size={14} color={blue600} />
              <Text fontSize="sm" fontWeight="semibold" color={blue700}>
                Panduan AI untuk Tahap {stepNumber}
              </Text>
            </HStack>
            <Text fontSize="sm" color={blue700}>
              AI akan memonitoring progress Anda di tahap "{stepName}". Pastikan Anda memahami semua kegiatan dan siap untuk melaporkan kendala atau bertanya jika diperlukan. Sistem akan membantu menyesuaikan roadmap berdasarkan laporan Anda.
            </Text>
          </Box>

          {/* Confirmation Checklist */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textPrimary} mb={3}>
              Konfirmasi Sebelum Lanjut:
            </Text>
            <VStack align="stretch" gap={3}>
              {monitoringQuestions.map((item, idx) => (
                <HStack key={idx} align="start" gap={3}>
                  <Checkbox
                    checked={confirmations[idx] || false}
                    onChange={(e) => handleConfirmationChange(idx, e.target.checked)}
                    colorScheme="brand"
                    mt={1}
                  />
                  <VStack align="start" gap={0} flex={1}>
                    <HStack gap={2}>
                      <Text fontSize="sm" color={textPrimary}>
                        {item.question}
                      </Text>
                      {item.required && (
                        <Text as="span" fontSize="xs" color={red600}>
                          *
                        </Text>
                      )}
                    </HStack>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </Box>

          {/* Ready Status */}
          {isReady && (
            <Box
              p={3}
              borderRadius="md"
              bg={green50}
              border="1px solid"
              borderColor={green200}
            >
              <HStack gap={2}>
                <FiCheckCircle size={16} color={green600} />
                <Text fontSize="sm" fontWeight="semibold" color={green700}>
                  Siap untuk melanjutkan ke step selanjutnya
                </Text>
              </HStack>
            </Box>
          )}

          {/* Not Ready Warning */}
          {!isReady && (
            <Box
              p={3}
              borderRadius="md"
              bg={orange50}
              border="1px solid"
              borderColor={orange200}
            >
              <HStack gap={2}>
                <FiAlertCircle size={16} color={orange600} />
                <Text fontSize="sm" color={orange700}>
                  Silakan lengkapi semua konfirmasi yang wajib (*) sebelum melanjutkan
                </Text>
              </HStack>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}

