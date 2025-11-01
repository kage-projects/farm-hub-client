/**
 * Plan Progress Component
 * Menampilkan progress saat streaming data plan detail
 */

import { Box, VStack, HStack, Text, Heading } from '@chakra-ui/react';
import { Card } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { FiActivity } from 'react-icons/fi';

export interface PlanProgressProps {
  progress: number;
  statusMessage: string;
  currentSection?: string;
}

export function PlanProgress({ progress, statusMessage, currentSection }: PlanProgressProps) {
  // All hooks must be called at top level
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const brandBg100 = useColorModeValue('brand.100', 'brand.900');
  const brandColor600 = useColorModeValue('brand.600', 'brand.400');
  const grayBg100 = useColorModeValue('gray.100', 'gray.700');
  const brandBg50 = useColorModeValue('brand.50', 'brand.900');
  const brandBorder200 = useColorModeValue('brand.200', 'brand.700');

  const getSectionLabel = (section?: string) => {
    if (!section || section === 'all') return 'Semua Section';
    
    const sectionMap: Record<string, string> = {
      informasi_teknis: 'Informasi Teknis',
      roadmap: 'Roadmap',
      analisis_finansial: 'Analisis Finansial',
    };
    
    return sectionMap[section] || section;
  };

  return (
    <Card variant="elevated" p={6}>
      <VStack align="stretch" gap={4}>
        <HStack gap={3}>
          <Box
            p={2}
            borderRadius="lg"
            bg={brandBg100}
            color={brandColor600}
          >
            <FiActivity size={20} />
          </Box>
          <VStack align="start" gap={0} flex={1}>
            <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
              Memproses Analisis Detail
            </Heading>
            <Text fontSize="sm" color={textSecondary}>
              {statusMessage || 'Memuat data...'}
            </Text>
          </VStack>
        </HStack>

        <VStack align="stretch" gap={2}>
          <HStack justify="space-between">
            <Text fontSize="sm" fontWeight="medium" color={textPrimary}>
              Progress
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={brandColor600}>
              {Math.round(progress)}%
            </Text>
          </HStack>
          
          <Box
            w="full"
            h="8px"
            bg={grayBg100}
            borderRadius="full"
            overflow="hidden"
            position="relative"
          >
            <Box
              h="100%"
              bg={brandColor600}
              borderRadius="full"
              width={`${progress}%`}
              transition="width 0.3s ease"
            />
          </Box>
        </VStack>

        {currentSection && currentSection !== 'all' && (
          <Box
            p={3}
            borderRadius="lg"
            bg={brandBg50}
            border="1px solid"
            borderColor={brandBorder200}
          >
            <Text fontSize="xs" color={textSecondary} fontWeight="medium">
              Memproses: {getSectionLabel(currentSection)}
            </Text>
          </Box>
        )}
      </VStack>
    </Card>
  );
}

