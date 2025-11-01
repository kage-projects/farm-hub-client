/**
 * Roadmap Step View Component - Menampilkan detail tahap aktif
 */

import { VStack, HStack, Text, Heading, Box, SimpleGrid, Button } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { Button as CustomButton } from '../button/Button';
import { IssueReport } from './IssueReport';
import { AIMonitoring } from './AIMonitoring';
import { useRoadmapStore, type RoadmapTahapan, type RoadmapExecution } from '../../store/roadmapStore';
import { FiCheckCircle, FiList, FiFileText, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { Alert } from '../feedback/Alert';
import { useState } from 'react';

interface RoadmapStepViewProps {
  tahap: RoadmapTahapan;
  execution: RoadmapExecution;
  onComplete: () => void;
  onIssueReported: () => void;
}

export function RoadmapStepView({
  tahap,
  execution,
  onComplete,
  onIssueReported,
}: RoadmapStepViewProps) {
  // All hooks must be called at top level
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const red500 = useColorModeValue('red.500', 'red.400');
  const brand500 = useColorModeValue('brand.500', 'brand.400');
  const red50 = useColorModeValue('red.50', 'red.900');
  const red200 = useColorModeValue('red.200', 'red.700');
  const red600 = useColorModeValue('red.600', 'red.400');
  const red700 = useColorModeValue('red.700', 'red.300');
  const brand600 = useColorModeValue('brand.600', 'brand.400');
  const green50 = useColorModeValue('green.50', 'green.900');
  const green200 = useColorModeValue('green.200', 'green.700');
  const green600 = useColorModeValue('green.600', 'green.400');
  const green700 = useColorModeValue('green.700', 'green.300');
  const orange50 = useColorModeValue('orange.50', 'orange.900');
  const orange200 = useColorModeValue('orange.200', 'orange.700');
  const orange600 = useColorModeValue('orange.600', 'orange.400');
  const orange700 = useColorModeValue('orange.700', 'orange.300');
  const blue50 = useColorModeValue('blue.50', 'blue.900');
  const blue200 = useColorModeValue('blue.200', 'blue.700');
  const blue600 = useColorModeValue('blue.600', 'blue.300');
  const blue700 = useColorModeValue('blue.700', 'blue.300');
  const gray50 = useColorModeValue('gray.50', 'gray.800');
  const brand500full = useColorModeValue('brand.500', 'brand.400');

  const [isReadyForNext, setIsReadyForNext] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isBlocked = tahap.status === 'blocked';
  const activeIssues = execution.issues.filter((i) => !i.resolved && i.reportedAt);
  const hasActiveIssues = activeIssues.length > 0;

  const handleReadyChange = (ready: boolean) => {
    setIsReadyForNext(ready);
  };

  const handleComplete = () => {
    // Jika belum ready, show monitoring first
    if (!isReadyForNext) {
      setShowConfirmation(true);
      return;
    }

    // Confirm before completing
    if (confirm('Apakah Anda yakin tahap ini sudah selesai? Pastikan semua kegiatan dan output telah tercapai sebelum melanjutkan ke step selanjutnya.')) {
      onComplete();
    }
  };

  return (
    <VStack align="stretch" gap={4}>
      {/* AI Monitoring - Shown before completing step */}
      {(showConfirmation || !isReadyForNext) && (
        <AIMonitoring
          stepNumber={tahap.nomor}
          stepName={tahap.nama_tahap}
          onReady={handleReadyChange}
          requiredQuestions={[
            {
              question: 'Saya telah menyelesaikan semua kegiatan di tahap ini sesuai dengan yang direncanakan',
              required: true,
            },
            {
              question: 'Saya telah mencapai output yang diharapkan atau melaporkan kendala jika ada',
              required: true,
            },
            {
              question: 'Saya telah memeriksa kembali dan yakin semua kegiatan sudah sesuai',
              required: true,
            },
            {
              question: 'Saya siap untuk melanjutkan ke tahap selanjutnya',
              required: false,
            },
          ]}
        />
      )}

      {/* Current Tahap Card */}
      <Card
        variant="elevated"
        border={isBlocked ? '2px solid' : '1px solid'}
        borderColor={isBlocked ? red500 : brand500}
      >
        <CardHeader>
          <VStack align="start" gap={2}>
            <HStack justify="space-between" w="full">
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Tahap {tahap.nomor}: {tahap.nama_tahap}
              </Heading>
              {isBlocked && (
                <Box
                  px={3}
                  py={1}
                  borderRadius="md"
                  bg={red50}
                  border="1px solid"
                  borderColor={red200}
                >
                  <HStack gap={1}>
                    <FiAlertCircle size={14} color={red600} />
                    <Text fontSize="xs" fontWeight="semibold" color={red700}>
                      Terblokir
                    </Text>
                  </HStack>
                </Box>
              )}
            </HStack>
            <Text fontSize="sm" color={textSecondary}>
              {tahap.deskripsi}
            </Text>
            <HStack gap={4}>
              <Text fontSize="xs" color={textSecondary}>
                Durasi: {tahap.durasi_minggu} minggu
              </Text>
              {tahap.startedAt && (
                <Text fontSize="xs" color={textSecondary}>
                  Dimulai: {new Date(tahap.startedAt).toLocaleDateString('id-ID')}
                </Text>
              )}
            </HStack>
          </VStack>
        </CardHeader>
        <CardBody>
          <VStack align="stretch" gap={4}>
            {/* Blocked Alert */}
            {isBlocked && activeIssues.length > 0 && (
              <Alert
                status="warning"
                variant="subtle"
                title="Tahap ini terblokir karena kendala"
                description={`Ada ${activeIssues.length} kendala yang perlu diselesaikan terlebih dahulu. Selesaikan kendala atau laporkan kembali untuk mendapatkan saran penyesuaian.`}
              />
            )}

            {/* Kegiatan */}
            <Box>
              <HStack gap={2} mb={3}>
                <FiList size={16} color={brand600} />
                <Heading fontSize="md" fontWeight="semibold" color={textPrimary}>
                  Kegiatan
                </Heading>
              </HStack>
              <VStack align="stretch" gap={2}>
                {tahap.kegiatan.map((kegiatan, idx) => (
                  <HStack key={idx} align="start" gap={3}>
                    <Box
                      mt={1}
                      w={1.5}
                      h={1.5}
                      borderRadius="full"
                      bg={brand500full}
                      flexShrink={0}
                    />
                    <Text flex={1} fontSize="sm" color={textPrimary}>
                      {kegiatan}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Output */}
            <Box
              p={3}
              borderRadius="md"
              bg={green50}
              border="1px solid"
              borderColor={green200}
            >
              <HStack gap={2} mb={2}>
                <FiCheckCircle size={14} color={green600} />
                <Text fontSize="sm" fontWeight="semibold" color={green700}>
                  Output yang Diharapkan
                </Text>
              </HStack>
              <Text fontSize="sm" color={green700}>
                {tahap.output}
              </Text>
            </Box>

            {/* Adjustments */}
            {tahap.adjustments && tahap.adjustments.length > 0 && (
              <Box
                p={3}
                borderRadius="md"
                bg={orange50}
                border="1px solid"
                borderColor={orange200}
              >
                <HStack gap={2} mb={2}>
                  <FiFileText size={14} color={orange600} />
                  <Text fontSize="sm" fontWeight="semibold" color={orange700}>
                    Penyesuaian Roadmap
                  </Text>
                </HStack>
                <VStack align="start" gap={1}>
                  {tahap.adjustments.map((adj, idx) => (
                    <Text key={idx} fontSize="sm" color={orange700}>
                      • {adj}
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        </CardBody>
        <CardFooter>
          <HStack gap={3} w="full" justify="flex-end">
            {!isBlocked && (
              <>
                {!isReadyForNext && !showConfirmation && (
                  <CustomButton
                    variant="outline"
                    colorScheme="brand"
                    onClick={() => setShowConfirmation(true)}
                    leftIcon={<FiArrowRight />}
                  >
                    Konfirmasi Selesai
                  </CustomButton>
                )}
                {isReadyForNext && (
                  <CustomButton
                    variant="solid"
                    colorScheme="brand"
                    onClick={handleComplete}
                    leftIcon={<FiCheckCircle />}
                  >
                    Tandai Selesai & Lanjut ke Step Selanjutnya
                  </CustomButton>
                )}
              </>
            )}
          </HStack>
        </CardFooter>
      </Card>

      {/* AI Guidance Info */}
      {!showConfirmation && !hasActiveIssues && (
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
              AI Monitoring Aktif
            </Text>
          </HStack>
          <Text fontSize="sm" color={blue700}>
            AI sedang memonitoring progress Anda. Jika ada kendala atau pertanyaan, laporkan terlebih dahulu sebelum melanjutkan ke step selanjutnya. Sistem akan membantu menyesuaikan roadmap berdasarkan laporan Anda.
          </Text>
        </Box>
      )}

      {/* Issue Report */}
      <IssueReport executionId={execution.id} onIssueReported={onIssueReported} execution={execution} />

      {/* Active Issues */}
      {activeIssues.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <Heading fontSize="md" fontWeight="semibold" color={textPrimary}>
              Kendala yang Dilaporkan
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch" gap={3}>
              {activeIssues.map((issue) => (
                <Box
                  key={issue.id}
                  p={3}
                  borderRadius="md"
                  bg={gray50}
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <VStack align="start" gap={2}>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                        {issue.title}
                      </Text>
                      <Text fontSize="xs" color={textSecondary}>
                        {new Date(issue.reportedAt).toLocaleDateString('id-ID')}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color={textSecondary}>
                      {issue.description}
                    </Text>
                    {issue.resolution && (
                      <Box
                        mt={2}
                        p={2}
                        borderRadius="md"
                        bg={blue50}
                        border="1px solid"
                        borderColor={blue200}
                        w="full"
                      >
                        <Text fontSize="xs" fontWeight="semibold" color={blue700} mb={1}>
                          Resolusi:
                        </Text>
                        <Text fontSize="xs" color={blue700}>
                          {issue.resolution}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
}

