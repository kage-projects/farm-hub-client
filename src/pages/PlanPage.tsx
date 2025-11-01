import { Container, HStack, Box, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { Navbar } from '../components/navbar/Navbar';
import { PlanSidebar } from '../components/navigation/PlanSidebar';
import { useColorModeValue } from '../components/ui/color-mode';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePlanDetail } from '../hooks/usePlanDetail';
import { PlanProgress } from '../components/plan/PlanProgress';
import { PlanTechnicalInfo } from '../components/plan/PlanTechnicalInfo';
import { PlanRoadmapDetail } from '../components/plan/PlanRoadmapDetail';
import {
  InitialCapitalSimulation,
  MonthlyOperationalCosts,
  RevenueProjection,
  ROIAnalysis,
  TechnicalSpecs,
  Roadmap,
  SupplierMap,
} from '../components/plan';
import { FiRefreshCw } from 'react-icons/fi';
import { Alert } from '../components/feedback/Alert';

/**
 * Plan Page - Halaman rencana lengkap dengan submenu
 * - Sidebar navigation
 * - Content area dengan sections berdasarkan hash
 * - Submenu: Ringkasan, Spesifikasi Teknis, Roadmap, Modal, Peta Supplier
 */
export function PlanPage() {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [currentHash, setCurrentHash] = useState(location.hash || '#ringkasan');
  
  // Get projectId from URL search params or location state
  const projectId = searchParams.get('projectId') || location.state?.projectId || null;
  
  const {
    isLoading,
    progress,
    statusMessage,
    currentSection,
    informasiTeknis,
    roadmap,
    analisisFinansial,
    isCompleted,
    error,
    startStreaming,
    reset,
  } = usePlanDetail();

  // Start streaming when component mounts with projectId
  useEffect(() => {
    if (projectId && !isLoading && !isCompleted && !informasiTeknis && !roadmap && !analisisFinansial) {
      startStreaming(projectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    // Listen for hash changes
    const handleHashChange = () => {
      const hash = window.location.hash || '#ringkasan';
      setCurrentHash(hash);
      const elementId = hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };

    // Initial scroll
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderContent = () => {
    const hash = currentHash;
    
    switch (hash) {
      case '#ringkasan':
        return (
          <VStack align="stretch" gap={4}>
            <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
              Ringkasan
            </Heading>
            <Text color={textSecondary}>
              Ringkasan lengkap dari analisis proyek budidaya ikan. Lihat detail di setiap submenu untuk informasi lebih lanjut.
            </Text>
            <VStack align="stretch" gap={4} mt={4}>
              <Box>
                <Text fontSize="md" fontWeight="semibold" color={textPrimary} mb={2}>
                  Informasi Proyek
                </Text>
                <Text fontSize="sm" color={textSecondary}>
                  Proyek budidaya ikan lele dengan sistem kolam terpal. Rencana pelaksanaan 6 bulan per siklus panen dengan estimasi hasil panen optimal.
                </Text>
              </Box>
              <Box>
                <Text fontSize="md" fontWeight="semibold" color={textPrimary} mb={2}>
                  Potensi Keuntungan
                </Text>
                <Text fontSize="sm" color={textSecondary}>
                  Dengan perhitungan yang matang, proyek ini memiliki potensi ROI positif dengan payback period yang wajar. Lihat detail perhitungan di submenu Modal, Operasional, Pendapatan, dan ROI.
                </Text>
              </Box>
            </VStack>
          </VStack>
        );
      
      case '#spesifikasi':
        return (
          <VStack align="stretch" gap={4}>
            <HStack justify="space-between" align="start">
              <VStack align="start" gap={1}>
                <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                  Spesifikasi Teknis
                </Heading>
                <Text color={textSecondary}>
                  Detail spesifikasi teknis kolam, bibit, pakan, dan peralatan yang digunakan dalam proyek budidaya.
                </Text>
              </VStack>
              {projectId && !isCompleted && (
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="brand"
                  onClick={() => {
                    reset();
                    startStreaming(projectId);
                  }}
                  leftIcon={<FiRefreshCw />}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
              )}
            </HStack>
            
            {isLoading && (
              <PlanProgress 
                progress={progress} 
                statusMessage={statusMessage}
                currentSection={currentSection}
              />
            )}
            
            {error && (
              <Alert 
                status="error" 
                variant="subtle"
                title="Error"
                description={error}
              />
            )}
            
            {isCompleted && informasiTeknis ? (
              <PlanTechnicalInfo data={informasiTeknis} />
            ) : !isLoading && !error ? (
              <TechnicalSpecs />
            ) : null}
          </VStack>
        );
      
      case '#roadmap':
        return (
          <VStack align="stretch" gap={4}>
            <HStack justify="space-between" align="start">
              <VStack align="start" gap={1}>
                <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                  Tahapan Pelaksanaan
                </Heading>
                <Text color={textSecondary}>
                  Roadmap step-by-step pelaksanaan proyek dari persiapan hingga pasca panen.
                </Text>
              </VStack>
              {projectId && !isCompleted && (
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="brand"
                  onClick={() => {
                    reset();
                    startStreaming(projectId);
                  }}
                  leftIcon={<FiRefreshCw />}
                  disabled={isLoading}
                >
                  Refresh
                </Button>
              )}
            </HStack>
            
            {isLoading && (
              <PlanProgress 
                progress={progress} 
                statusMessage={statusMessage}
                currentSection={currentSection}
              />
            )}
            
            {error && (
              <Alert 
                status="error" 
                variant="subtle"
                title="Error"
                description={error}
              />
            )}
            
            {isCompleted && roadmap ? (
              <PlanRoadmapDetail data={roadmap} />
            ) : !isLoading && !error ? (
              <Roadmap />
            ) : null}
          </VStack>
        );
      
      case '#modal':
      case '#modal-awal':
        return (
          <VStack align="stretch" gap={4}>
            <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
              Simulasi Modal Awal
            </Heading>
            <Text color={textSecondary}>
              Breakdown modal awal: pembuatan kolam, bibit, pakan, peralatan dan perlengkapan.
            </Text>
            <InitialCapitalSimulation />
          </VStack>
        );
      
      case '#operasional':
        return (
          <VStack align="stretch" gap={4}>
            <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
              Biaya Operasional Bulanan
            </Heading>
            <Text color={textSecondary}>
              Breakdown biaya operasional: listrik, air, tenaga kerja, pakan, dan maintenance.
            </Text>
            <MonthlyOperationalCosts />
          </VStack>
        );
      
      case '#pendapatan':
        return (
          <VStack align="stretch" gap={4}>
            <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
              Proyeksi Pendapatan per Panen
            </Heading>
            <Text color={textSecondary}>
              Perhitungan pendapatan kotor, bersih, dan margin profit per siklus panen.
            </Text>
            <RevenueProjection />
          </VStack>
        );
      
      case '#roi':
        return (
          <VStack align="stretch" gap={4}>
            <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
              ROI dengan Grafik
            </Heading>
            <Text color={textSecondary}>
              Grafik cash flow timeline dan analisis ROI lengkap dengan perhitungan payback period.
            </Text>
            <ROIAnalysis />
          </VStack>
        );
      
      case '#supplier':
        return (
          <VStack align="stretch" gap={4}>
            <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
              Peta Supplier
            </Heading>
            <Text color={textSecondary}>
              Peta interaktif lokasi supplier: bibit, pakan, pasar, dan peralatan.
            </Text>
            <SupplierMap />
          </VStack>
        );
      
      default:
        return (
          <VStack align="stretch" gap={4}>
            <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
              Ringkasan
            </Heading>
            <Text color={textSecondary}>
              Pilih menu di sidebar untuk melihat detail rencana...
            </Text>
          </VStack>
        );
    }
  };

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[{ label: 'Dashboard', href: '/dashboard' }]}
        cta={{ label: 'Dashboard', href: '/dashboard' }}
      />
      <HStack align="start" gap={0} minH="calc(100vh - 80px)">
        {/* Sidebar */}
        <PlanSidebar />

        {/* Main Content */}
        <Box flex={1} minH="calc(100vh - 80px)">
          <Container maxW="6xl" py={8}>
            <Box id={currentHash.substring(1)}>
              {renderContent()}
            </Box>
          </Container>
        </Box>
      </HStack>
    </>
  );
}

