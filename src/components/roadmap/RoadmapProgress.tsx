/**
 * Roadmap Progress Component - Visual progress indicator untuk roadmap execution
 */

import { VStack, HStack, Text, Box, Progress } from '@chakra-ui/react';
import { Card, CardHeader, CardBody } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { useRoadmapStore, type RoadmapExecution } from '../../store/roadmapStore';
import { FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

interface RoadmapProgressProps {
  execution: RoadmapExecution;
}

export function RoadmapProgress({ execution }: RoadmapProgressProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');

  const totalTahapan = execution.roadmap.tahapan.length;
  const completedTahapan = execution.progress.completedTahapan.length;
  const progressPercentage = (completedTahapan / totalTahapan) * 100;

  const pendingCount = execution.roadmap.tahapan.filter((t) => t.status === 'pending').length;
  const inProgressCount = execution.roadmap.tahapan.filter((t) => t.status === 'in_progress').length;
  const blockedCount = execution.roadmap.tahapan.filter((t) => t.status === 'blocked').length;

  return (
    <Card variant="elevated">
      <CardHeader>
        <HStack justify="space-between" w="full">
          <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
            Progress Roadmap
          </Text>
          <Text fontSize="sm" fontWeight="bold" color={useColorModeValue('brand.600', 'brand.400')}>
            {completedTahapan} / {totalTahapan} Tahap
          </Text>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="stretch" gap={4}>
          {/* Progress Bar */}
          <Box>
            <Box
              w="full"
              h="12px"
              bg={useColorModeValue('gray.100', 'gray.700')}
              borderRadius="full"
              overflow="hidden"
              position="relative"
            >
              <Box
                h="100%"
                bg={useColorModeValue('brand.600', 'brand.400')}
                borderRadius="full"
                width={`${progressPercentage}%`}
                transition="width 0.3s ease"
              />
            </Box>
            <Text fontSize="xs" color={textSecondary} mt={2} textAlign="right">
              {progressPercentage.toFixed(0)}% Selesai
            </Text>
          </Box>

          {/* Status Summary */}
          <HStack gap={4} flexWrap="wrap">
            {completedTahapan > 0 && (
              <HStack gap={2}>
                <FiCheckCircle size={16} color={useColorModeValue('green.600', 'green.400')} />
                <Text fontSize="sm" color={textSecondary}>
                  Selesai: <Text as="span" fontWeight="semibold" color={textPrimary}>{completedTahapan}</Text>
                </Text>
              </HStack>
            )}
            {inProgressCount > 0 && (
              <HStack gap={2}>
                <FiClock size={16} color={useColorModeValue('blue.600', 'blue.400')} />
                <Text fontSize="sm" color={textSecondary}>
                  Berjalan: <Text as="span" fontWeight="semibold" color={textPrimary}>{inProgressCount}</Text>
                </Text>
              </HStack>
            )}
            {blockedCount > 0 && (
              <HStack gap={2}>
                <FiAlertCircle size={16} color={useColorModeValue('red.600', 'red.400')} />
                <Text fontSize="sm" color={textSecondary}>
                  Terblokir: <Text as="span" fontWeight="semibold" color={textPrimary}>{blockedCount}</Text>
                </Text>
              </HStack>
            )}
            {pendingCount > 0 && (
              <HStack gap={2}>
                <FiClock size={16} color={useColorModeValue('gray.400', 'gray.500')} />
                <Text fontSize="sm" color={textSecondary}>
                  Menunggu: <Text as="span" fontWeight="semibold" color={textPrimary}>{pendingCount}</Text>
                </Text>
              </HStack>
            )}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}


