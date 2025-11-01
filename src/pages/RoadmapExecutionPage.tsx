/**
 * Roadmap Execution Page - Halaman untuk menjalankan roadmap step-by-step
 * User menjalankan satu tahap pada satu waktu dan bisa melaporkan kendala
 */

import { Container, VStack, HStack, Heading, Text, Box, SimpleGrid, Button, Badge } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '../components/navbar/Navbar';
import { Card, CardHeader, CardBody, CardFooter } from '../components/surfaces/Card';
import { useColorModeValue } from '../components/ui/color-mode';
import { Button as CustomButton } from '../components/button/Button';
import { Alert } from '../components/feedback/Alert';
import { useRoadmapStore } from '../store/roadmapStore';
import { usePurchaseStore } from '../store/purchaseStore';
import { IssueReport, RoadmapProgress, RoadmapStepView } from '../components/roadmap';
import { FiArrowLeft, FiCheckCircle, FiAlertCircle, FiPlay, FiPause, FiList } from 'react-icons/fi';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';
import { dummyPlanDetailData } from '../data/planDetailDummy';

export function RoadmapExecutionPage() {
  const navigate = useNavigate();
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId || '';

  const {
    getExecutionByProject,
    createExecution,
    startTahap,
    completeTahap,
    reportIssue,
    getNextTahap,
    updateExecutionStatus,
  } = useRoadmapStore();

  const { orders } = usePurchaseStore();

  // All hooks must be called at top level
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const green100 = useColorModeValue('green.100', 'green.900');
  const green600 = useColorModeValue('green.600', 'green.400');
  const brand50 = useColorModeValue('brand.50', 'brand.900');
  const brand200 = useColorModeValue('brand.200', 'brand.700');
  const brand600 = useColorModeValue('brand.600', 'brand.400');
  const brand500 = useColorModeValue('brand.500', 'brand.400');
  const green500 = useColorModeValue('green.500', 'green.400');
  const red500 = useColorModeValue('red.500', 'red.400');
  const orange50 = useColorModeValue('orange.50', 'orange.900');
  const orange200 = useColorModeValue('orange.200', 'orange.700');
  const orange700 = useColorModeValue('orange.700', 'orange.300');

  const [execution, setExecution] = useState(
    () => getExecutionByProject(projectId)
  );

  // Initialize execution if not exists
  useEffect(() => {
    if (!execution && projectId) {
      // Get selected suppliers from completed orders
      const completedOrders = orders.filter((o) => o.status === 'completed' && o.projectId === projectId);
      const selectedSuppliers = {
        pakan: completedOrders.find((o) => o.supplier.type === 'pakan')?.supplier.id,
        benih: completedOrders.find((o) => o.supplier.type === 'benih')?.supplier.id,
        peralatan: completedOrders.find((o) => o.supplier.type === 'peralatan')?.supplier.id,
      };

      // Create roadmap from dummy data (in real app, fetch from API)
      const roadmap = {
        ...dummyPlanDetailData.roadmap,
        tahapan: dummyPlanDetailData.roadmap.tahapan.map((t) => ({
          ...t,
          status: 'pending' as const,
        })),
      };

      const newExecution = createExecution({
        projectId,
        roadmap,
        selectedSuppliers: Object.keys(selectedSuppliers).length > 0 ? selectedSuppliers : undefined,
      });

      setExecution(newExecution);
    } else if (execution) {
      // Refresh execution from store
      setExecution(getExecutionByProject(projectId));
    }
  }, [projectId, execution, orders, createExecution, getExecutionByProject]);

  if (!execution) {
    return (
      <>
        <Navbar
          brandName="FarmHub Analytics"
          links={[{ label: 'Dashboard', href: '/dashboard' }]}
          cta={{ label: 'Dashboard', href: '/dashboard' }}
        />
        <Container maxW="5xl" py={8}>
          <VStack gap={6} align="stretch">
            <Alert
              status="error"
              variant="subtle"
              title="Roadmap tidak ditemukan"
              description="Roadmap untuk proyek ini belum tersedia."
            />
          </VStack>
        </Container>
      </>
    );
  }

  const nextTahap = getNextTahap(execution.id);
  const currentTahap = execution.currentTahap
    ? execution.roadmap.tahapan.find((t) => t.nomor === execution.currentTahap)
    : null;

  const handleStartTahap = (tahapNomor: number) => {
    startTahap(execution.id, tahapNomor);
    setExecution(getExecutionByProject(projectId));
  };

  const handleCompleteTahap = (tahapNomor: number) => {
    if (confirm('Apakah Anda yakin tahap ini sudah selesai? Pastikan semua kegiatan dan output telah tercapai.')) {
      completeTahap(execution.id, tahapNomor);
      setExecution(getExecutionByProject(projectId));
    }
  };

  const handleIssueReported = () => {
    // Refresh execution after issue reported
    setExecution(getExecutionByProject(projectId));
  };

  const handleStatusChange = (newStatus: typeof execution.status) => {
    updateExecutionStatus(execution.id, newStatus);
    setExecution(getExecutionByProject(projectId));
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Plan Detail', href: `/plan-detail/${projectId}` },
    { label: 'Roadmap Execution', href: `/roadmap/${projectId}/execute` },
  ];

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Proyek', href: '/dashboard' },
        ]}
        cta={{ label: 'Dashboard', href: '/dashboard' }}
      />
      <Container maxW="6xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />

          {/* Header */}
          <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
            <VStack align="start" gap={2} flex={1}>
              <HStack gap={3}>
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/plan-detail/${projectId}`)}
                  leftIcon={<FiArrowLeft />}
                >
                  Kembali
                </CustomButton>
              </HStack>
              <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                {execution.roadmap.judul}
              </Heading>
              <Text fontSize="md" color={textSecondary}>
                {execution.roadmap.tujuan}
              </Text>
              <HStack gap={2} flexWrap="wrap">
                <Badge
                  colorPalette={
                    execution.status === 'completed'
                      ? 'green'
                      : execution.status === 'in_progress'
                      ? 'blue'
                      : execution.status === 'blocked'
                      ? 'red'
                      : 'gray'
                  }
                  variant="subtle"
                  px={3}
                  py={1}
                >
                  {execution.status === 'not_started'
                    ? 'Belum Dimulai'
                    : execution.status === 'in_progress'
                    ? 'Sedang Berjalan'
                    : execution.status === 'completed'
                    ? 'Selesai'
                    : execution.status === 'blocked'
                    ? 'Terblokir'
                    : 'Ditunda'}
                </Badge>
                <Text fontSize="sm" color={textSecondary}>
                  Durasi: {execution.roadmap.durasi_bulan} bulan
                </Text>
              </HStack>
            </VStack>
            <HStack gap={2}>
              {execution.status === 'in_progress' && (
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('paused')}
                  leftIcon={<FiPause />}
                >
                  Tunda
                </CustomButton>
              )}
              {execution.status === 'paused' && (
                <CustomButton
                  variant="solid"
                  colorScheme="brand"
                  size="sm"
                  onClick={() => handleStatusChange('in_progress')}
                  leftIcon={<FiPlay />}
                >
                  Lanjutkan
                </CustomButton>
              )}
            </HStack>
          </HStack>

          {/* Progress Overview */}
          <RoadmapProgress execution={execution} />

          {/* Current/Next Tahap */}
          {currentTahap ? (
            <RoadmapStepView
              tahap={currentTahap}
              execution={execution}
              onComplete={() => handleCompleteTahap(currentTahap.nomor)}
              onIssueReported={handleIssueReported}
            />
          ) : nextTahap ? (
            <Card variant="elevated">
              <CardHeader>
                <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                  Tahap Selanjutnya
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary} mb={1}>
                      {nextTahap.nama_tahap}
                    </Text>
                    <Text fontSize="sm" color={textSecondary}>
                      {nextTahap.deskripsi}
                    </Text>
                    <Text fontSize="xs" color={textSecondary} mt={2}>
                      Durasi: {nextTahap.durasi_minggu} minggu
                    </Text>
                  </Box>
                  <CustomButton
                    variant="solid"
                    colorScheme="brand"
                    onClick={() => handleStartTahap(nextTahap.nomor)}
                    leftIcon={<FiPlay />}
                  >
                    Mulai Tahap Ini
                  </CustomButton>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            <Card variant="elevated">
              <CardBody>
                <VStack gap={4}>
                  <Box
                    p={4}
                    borderRadius="full"
                    bg={green100}
                    color={green600}
                  >
                    <FiCheckCircle size={48} />
                  </Box>
                  <Heading fontSize="xl" fontWeight="bold" color={textPrimary}>
                    Roadmap Selesai! 🎉
                  </Heading>
                  <Text fontSize="md" color={textSecondary} textAlign="center">
                    Selamat! Semua tahap roadmap telah diselesaikan dengan monitoring AI.
                  </Text>
                  <Box
                    p={4}
                    borderRadius="md"
                    bg={brand50}
                    border="1px solid"
                    borderColor={brand200}
                    w="full"
                  >
                    <VStack align="stretch" gap={2}>
                      <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                        Status Proyek:
                      </Text>
                      <Text fontSize="sm" color={textSecondary}>
                        ✓ Semua tahap roadmap telah diselesaikan dengan monitoring AI
                        <br />
                        ✓ Semua kegiatan dan output telah tercapai sesuai rencana
                        <br />
                        ✓ Siklus budidaya pertama telah selesai
                        <br />
                        <br />
                        <Text as="span" fontWeight="semibold">
                          Proyek dinyatakan selesai setelah siklus budidaya selesai.
                        </Text>
                        <br />
                        Anda dapat memulai siklus berikutnya atau menyelesaikan proyek ini.
                      </Text>
                    </VStack>
                  </Box>
                  <HStack gap={2} w="full">
                    <CustomButton
                      variant="outline"
                      flex={1}
                      onClick={() => navigate(`/plan-detail/${projectId}`)}
                    >
                      Lihat Detail Proyek
                    </CustomButton>
                    <CustomButton
                      variant="solid"
                      colorScheme="brand"
                      flex={1}
                      onClick={() => navigate('/dashboard')}
                    >
                      Kembali ke Dashboard
                    </CustomButton>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* All Tahapan List */}
          <Card variant="elevated">
            <CardHeader>
              <HStack gap={2}>
                <FiList size={18} color={brand600} />
                <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                  Semua Tahapan
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" gap={3}>
                {execution.roadmap.tahapan.map((tahap) => {
                  const isActive = tahap.nomor === execution.currentTahap;
                  const isCompleted = tahap.status === 'completed';
                  const isBlocked = tahap.status === 'blocked';
                  const isAdjusted = tahap.status === 'adjusted';

                  return (
                    <Card
                      key={tahap.nomor}
                      variant="subtle"
                      border={isActive ? '2px solid' : '1px solid'}
                      borderColor={
                        isActive
                          ? brand500
                          : isCompleted
                          ? green500
                          : isBlocked
                          ? red500
                          : borderColor
                      }
                    >
                      <CardBody>
                        <HStack justify="space-between" align="start" gap={4}>
                          <VStack align="start" gap={1} flex={1}>
                            <HStack gap={2}>
                              <Text fontSize="sm" fontWeight="bold" color={textPrimary}>
                                Tahap {tahap.nomor}: {tahap.nama_tahap}
                              </Text>
                              {isActive && (
                                <Badge colorPalette="brand" variant="subtle" fontSize="xs">
                                  Sedang Berjalan
                                </Badge>
                              )}
                              {isCompleted && (
                                <Badge colorPalette="green" variant="subtle" fontSize="xs">
                                  Selesai
                                </Badge>
                              )}
                              {isBlocked && (
                                <Badge colorPalette="red" variant="subtle" fontSize="xs">
                                  Terblokir
                                </Badge>
                              )}
                              {isAdjusted && (
                                <Badge colorPalette="orange" variant="subtle" fontSize="xs">
                                  Disesuaikan
                                </Badge>
                              )}
                            </HStack>
                            <Text fontSize="sm" color={textSecondary}>
                              {tahap.deskripsi}
                            </Text>
                            <Text fontSize="xs" color={textSecondary}>
                              Durasi: {tahap.durasi_minggu} minggu
                            </Text>
                            {isCompleted && tahap.completedAt && (
                              <Text fontSize="xs" color={textSecondary}>
                                Selesai: {new Date(tahap.completedAt).toLocaleDateString('id-ID')}
                              </Text>
                            )}
                            {isAdjusted && tahap.adjustments && tahap.adjustments.length > 0 && (
                              <Box
                                mt={2}
                                p={2}
                                borderRadius="md"
                                bg={orange50}
                                border="1px solid"
                                borderColor={orange200}
                              >
                                <Text fontSize="xs" fontWeight="semibold" color={orange700} mb={1}>
                                  Penyesuaian:
                                </Text>
                                <VStack align="start" gap={1}>
                                  {tahap.adjustments.map((adj, idx) => (
                                    <Text key={idx} fontSize="xs" color={orange700}>
                                      • {adj}
                                    </Text>
                                  ))}
                                </VStack>
                              </Box>
                            )}
                          </VStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  );
                })}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </>
  );
}

