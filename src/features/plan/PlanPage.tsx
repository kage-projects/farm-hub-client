import { Container, HStack, Box, VStack, Heading, Text } from '@chakra-ui/react';
import { Navbar } from '../../components/navbar/Navbar';
import { PlanSidebar } from '../../components/navigation/PlanSidebar';
import { useColorModeValue } from '../../components/ui/color-mode';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  InitialCapitalSimulation,
  MonthlyOperationalCosts,
  RevenueProjection,
  ROIAnalysis,
  TechnicalSpecs,
  Roadmap,
  SupplierMap,
} from '../../components/plan';
import { getProject, type ProjectResponse } from '../onboarding/services/projectApi';

/**
 * Plan Page - Halaman rencana lengkap dengan submenu
 * - Sidebar navigation
 * - Content area dengan sections berdasarkan hash
 * - Submenu: Ringkasan, Spesifikasi Teknis, Roadmap, Modal, Peta Supplier
 */
export function PlanPage() {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [currentHash, setCurrentHash] = useState(location.hash || '#ringkasan');
  const [projectData, setProjectData] = useState<ProjectResponse | null>(null);

  // Get project ID from query params or location state
  const projectId = searchParams.get('project') || location.state?.projectId;

  // Fetch project data if project ID is available
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      try {
        const data = await getProject(projectId);
        setProjectData(data);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProject();
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
            <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
              Spesifikasi Teknis
            </Heading>
            <Text color={textSecondary}>
              Detail spesifikasi teknis kolam, bibit, pakan, dan peralatan yang digunakan dalam proyek budidaya.
            </Text>
            <TechnicalSpecs />
          </VStack>
        );
      
      case '#roadmap':
        return (
          <VStack align="stretch" gap={4}>
            <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
              Tahapan Pelaksanaan
            </Heading>
            <Text color={textSecondary}>
              Roadmap step-by-step pelaksanaan proyek dari persiapan hingga pasca panen.
            </Text>
            <Roadmap />
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
            <SupplierMap 
              jenisIkan={projectData?.data.jenis_ikan}
              kota={projectData?.data.kabupaten_id}
              centerLocation={projectData?.data.lat && projectData?.data.lang 
                ? { lat: projectData.data.lat, lng: projectData.data.lang }
                : undefined
              }
            />
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

