/**
 * Plan Detail Page - Halaman detail rencana dengan streaming SSE
 * Menampilkan informasi teknis, roadmap, dan analisis finansial secara real-time
 */

import { Container, VStack, HStack, Heading, Text, Box, Button } from '@chakra-ui/react';
import { Navbar } from '../components/navbar/Navbar';
import { useColorModeValue } from '../components/ui/color-mode';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { usePlanDetail } from '../hooks/usePlanDetail';
import { PlanProgress } from '../components/plan/PlanProgress';
import { PlanTechnicalInfo } from '../components/plan/PlanTechnicalInfo';
import { PlanFinancialAnalysis } from '../components/plan/PlanFinancialAnalysis';
import { SupplierRecommendation } from '../components/supplier/SupplierRecommendation';
import { FiArrowLeft, FiRefreshCw } from 'react-icons/fi';
import { Alert } from '../components/feedback/Alert';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs';

export function PlanDetailPage() {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get projectId from URL params or search params
  const projectId = params.id || new URLSearchParams(location.search).get('projectId');
  
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

  // Load dummy data when component mounts
  useEffect(() => {
    if (!isLoading && !isCompleted && !informasiTeknis && !roadmap && !analisisFinansial) {
      // Use any projectId or empty string - we're using dummy data
      startStreaming(projectId || 'dummy');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    reset();
    startStreaming(projectId || 'dummy');
  };

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[{ label: 'Dashboard', href: '/dashboard' }]}
        cta={{ label: 'Dashboard', href: '/dashboard' }}
      />
      
      <Container maxW="7xl" py={8}>
        <VStack align="stretch" gap={6}>
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Proyek', href: '/dashboard' },
              { label: 'Detail Rencana', href: '#' },
            ]}
          />

          {/* Header */}
          <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
            <VStack align="start" gap={2}>
              <HStack gap={3}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  leftIcon={<FiArrowLeft />}
                  colorScheme="brand"
                >
                  Kembali
                </Button>
              </HStack>
              <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                Detail Rencana Proyek
              </Heading>
              <Text color={textSecondary}>
                Informasi lengkap rencana budidaya ikan dengan analisis teknis dan finansial, serta rekomendasi supplier
              </Text>
            </VStack>
            
            <Button
              size="sm"
              variant="outline"
              colorScheme="brand"
              onClick={handleRefresh}
              leftIcon={<FiRefreshCw />}
              disabled={isLoading}
            >
              Refresh Data
            </Button>
          </HStack>

          {/* Progress Indicator */}
          {isLoading && (
            <PlanProgress 
              progress={progress} 
              statusMessage={statusMessage}
              currentSection={currentSection}
            />
          )}

          {/* Error Alert */}
          {error && (
            <Alert 
              status="error" 
              variant="subtle"
              title="Error"
              description={error}
            />
          )}

          {/* Content - Single Page Layout */}
          {isCompleted ? (
            <VStack align="stretch" gap={6}>
              {/* Informasi Teknis */}
              {informasiTeknis && (
                <PlanTechnicalInfo data={informasiTeknis} />
              )}

              {/* Analisis Finansial */}
              {analisisFinansial && (
                <PlanFinancialAnalysis data={analisisFinansial} />
              )}

              {/* Rekomendasi Supplier */}
              <SupplierRecommendation technicalData={informasiTeknis} />
            </VStack>
          ) : !isLoading && !error ? (
            <Box p={6} borderRadius="lg" bg={useColorModeValue('gray.50', 'gray.800')} textAlign="center">
              <VStack gap={4}>
                <Text fontSize="lg" color={textSecondary}>
                  Data sedang diproses...
                </Text>
                <Text fontSize="sm" color={textSecondary}>
                  Klik tombol "Refresh Data" untuk memulai analisis
                </Text>
              </VStack>
            </Box>
          ) : null}
        </VStack>
      </Container>
    </>
  );
}

