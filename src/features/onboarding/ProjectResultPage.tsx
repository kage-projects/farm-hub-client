import { Container, VStack, HStack, Heading, Text, Box, SimpleGrid, Badge } from '@chakra-ui/react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '../../components/navbar/Navbar';
import { Button } from '../../components/button/Button';
import { ScoreCard } from '../../components/data/ScoreCard';
import { Card, CardBody, CardHeader } from '../../components/surfaces/Card';
import { useColorModeValue } from '../../components/ui/color-mode';
import { Breadcrumbs } from '../../components/navigation/Breadcrumbs';
import { FiArrowLeft, FiMapPin, FiDroplet, FiInfo, FiExternalLink, FiCopy, FiEdit3, FiX, FiShield, FiAlertCircle, FiZap, FiNavigation, FiTrash2 } from 'react-icons/fi';
import { Spinner as LoadingSpinner } from '../../components/feedback/Spinner';
import { Alert } from '../../components/feedback/Alert';
import { LocationStep } from './components/LocationStep';
import { ProjectDetailsStep } from './components/ProjectDetailsStep';
import { RiskLevelStep } from './components/RiskLevelStep';
import { getProject, updateProject, deleteProject, type ProjectResponse, type CreateProjectRequest } from './services/projectApi';

/**
 * Project Result Page - Menampilkan hasil analisis proyek
 */
export function ProjectResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  // All hooks must be called at top level before any conditional returns
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('#6b7280', '#9ca3af');
  
  // Color values for conditional rendering (must be called at top level)
  const green600 = useColorModeValue('green.600', 'green.400');
  const orange600 = useColorModeValue('orange.600', 'orange.400');
  const red600 = useColorModeValue('red.600', 'red.400');
  const green100 = useColorModeValue('green.100', 'green.900');
  const orange100 = useColorModeValue('orange.100', 'orange.900');
  const red100 = useColorModeValue('red.100', 'red.900');
  const green300 = useColorModeValue('green.300', 'green.700');
  const orange300 = useColorModeValue('orange.300', 'orange.700');
  const red300 = useColorModeValue('red.300', 'red.700');
  const green50 = useColorModeValue('green.50', 'green.900');
  const orange50 = useColorModeValue('orange.50', 'orange.900');
  const red50 = useColorModeValue('red.50', 'red.900');
  const green200 = useColorModeValue('green.200', 'green.700');
  const orange200 = useColorModeValue('orange.200', 'orange.700');
  const red200 = useColorModeValue('red.200', 'red.700');
  const green800 = useColorModeValue('green.100', 'green.800');
  const orange800 = useColorModeValue('orange.100', 'orange.800');
  const red800 = useColorModeValue('red.100', 'red.800');
  const green600light = useColorModeValue('green.600', 'green.300');
  const orange600light = useColorModeValue('orange.600', 'orange.300');
  const red600light = useColorModeValue('red.600', 'red.300');
  // Additional colors for conditional rendering
  const brand100 = useColorModeValue('brand.100', 'brand.900');
  const cyan50 = useColorModeValue('cyan.50', 'cyan.900');
  const cyan100 = useColorModeValue('cyan.100', 'cyan.800');
  const cyan200 = useColorModeValue('cyan.200', 'cyan.700');
  const cyan600 = useColorModeValue('cyan.600', 'cyan.300');
  const blue50 = useColorModeValue('blue.50', 'blue.900');
  const blue100 = useColorModeValue('blue.100', 'blue.800');
  const blue200 = useColorModeValue('blue.200', 'blue.700');
  const blue600 = useColorModeValue('blue.600', 'blue.300');
  const purple50 = useColorModeValue('purple.50', 'purple.900');
  const purple100 = useColorModeValue('purple.100', 'purple.800');
  const purple200 = useColorModeValue('purple.200', 'purple.700');
  const purple600 = useColorModeValue('purple.600', 'purple.300');
  const brand500 = useColorModeValue('brand.500', 'brand.400');
  const whiteBg = useColorModeValue('white', 'gray.800');
  const gray50Modal = useColorModeValue('gray.50', 'gray.800');

  const [projectResult, setProjectResult] = useState<ProjectResponse | null>(
    location.state?.projectResult || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug: Log initial state
  useEffect(() => {
    console.log('ProjectResultPage mounted');
    console.log('location.state:', location.state);
    console.log('projectResult from state:', projectResult);
    console.log('projectId:', projectId);
  }, []);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const projectId = params.id;

  // Edit form data
  const [editFormData, setEditFormData] = useState<{
    kabupaten_id: string;
    lang?: number;
    lat?: number;
    jenis_ikan: '' | 'NILA' | 'LELE' | 'GURAME';
    modal: number;
    resiko: '' | 'KONSERVATIF' | 'MODERAT' | 'AGRESIF';
  }>({
    kabupaten_id: '',
    lang: undefined,
    lat: undefined,
    jenis_ikan: '',
    modal: 10_000_000,
    resiko: '',
  });

  // Fetch project data if not in location state but ID is in URL
  useEffect(() => {
    const fetchProject = async () => {
      if (projectResult) return; // Already have data from state
      if (!projectId) return; // No ID in URL

      setIsLoading(true);
      setError(null);

      try {
        const response = await getProject(projectId);
        console.log('Response dari getProject:', response);
        console.log('Response.data:', response?.data);
        console.log('Response.ringkasan_awal:', response?.ringkasan_awal);
        
        if (!response?.data || !response?.ringkasan_awal) {
          console.error('Response tidak lengkap:', response);
          setError('Data proyek tidak lengkap dari server');
        } else {
          setProjectResult(response);
        }
      } catch (err: any) {
        console.error('Error fetching project:', err);
        const errorMessage = err.message || 'Gagal memuat data proyek';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId, projectResult]);

  // Get data safely after all hooks - using optional chaining (before conditional returns)
  const data = projectResult?.data;
  const ringkasan_awal = projectResult?.ringkasan_awal;

  // Debug: Log data structure (must be before conditional returns)
  useEffect(() => {
    console.log('Current projectResult:', projectResult);
    console.log('Extracted data:', data);
    console.log('Extracted ringkasan_awal:', ringkasan_awal);
  }, [projectResult, data, ringkasan_awal]);

  // All hooks must be called before any conditional returns
  // Moving validation and helper functions here
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getPotensiPasarColor = (potensi: string) => {
    const upper = potensi.toUpperCase();
    if (upper === 'TINGGI') return 'success';
    if (upper === 'SEDANG' || upper === 'MENENGAH') return 'warning';
    return 'danger';
  };

  const getResikoColor = (resiko: string): 'success' | 'warning' | 'danger' => {
    const upper = resiko.toUpperCase();
    if (upper === 'KONSERVATIF') return 'success';
    if (upper === 'MODERAT') return 'warning';
    return 'danger';
  };

  const getResikoIcon = (resiko: string) => {
    const upper = resiko.toUpperCase();
    if (upper === 'KONSERVATIF') {
      return <FiShield size={14} />;
    } else if (upper === 'MODERAT') {
      return <FiAlertCircle size={14} />;
    } else {
      return <FiZap size={14} />;
    }
  };

  const handleViewProject = (id: string) => {
    navigate(`/onboarding/result/${id}`);
  };

  const handleEditProject = (id: string) => {
    handleOpenEditModal();
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setDeleteError(null);
  };

  const handleDeleteProject = async () => {
    if (!projectId) {
      setDeleteError('Project ID tidak ditemukan');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteProject(projectId);
      // Show success message
      alert('Proyek berhasil dihapus!');
      // Navigate to dashboard after successful delete
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal menghapus proyek';
      setDeleteError(errorMessage);
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setDeleteError(null);
    }
  };

  const handleOpenEditModal = () => {
    if (projectResult?.data) {
      setEditFormData({
        kabupaten_id: projectResult.data.kabupaten_id || '',
        lang: projectResult.data.lang,
        lat: projectResult.data.lat,
        jenis_ikan: (projectResult.data.jenis_ikan as '' | 'NILA' | 'LELE' | 'GURAME') || '',
        modal: projectResult.data.modal || 10_000_000,
        resiko: (projectResult.data.resiko as '' | 'KONSERVATIF' | 'MODERAT' | 'AGRESIF') || '',
      });
      setIsEditModalOpen(true);
      setUpdateError(null);
      setFormErrors({});
    }
  };

  const handleUpdateProject = async () => {
    if (!projectId) {
      setUpdateError('Project ID tidak ditemukan');
      return;
    }

    // Validation
    const errors: Record<string, string> = {};
    if (!editFormData.kabupaten_id) errors.kabupaten_id = 'Lokasi harus diisi';
    if (!editFormData.jenis_ikan) errors.jenis_ikan = 'Jenis ikan harus diisi';
    if (!editFormData.modal || editFormData.modal <= 0) errors.modal = 'Modal harus lebih dari 0';
    if (!editFormData.resiko) errors.resiko = 'Tingkat risiko harus diisi';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setFormErrors({});

    try {
      const updateData: Partial<CreateProjectRequest> = {
        kabupaten_id: editFormData.kabupaten_id,
        lang: editFormData.lang,
        lat: editFormData.lat,
        jenis_ikan: editFormData.jenis_ikan as 'NILA' | 'LELE' | 'GURAME',
        modal: editFormData.modal,
        resiko: editFormData.resiko as 'KONSERVATIF' | 'MODERAT' | 'AGRESIF',
      };

      const response = await updateProject(projectId, updateData);
      setProjectResult(response);
      setIsEditModalOpen(false);
      
      // Show success message or navigate
      alert('Proyek berhasil diupdate!');
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal mengupdate proyek';
      setUpdateError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  // Now safe to do conditional returns after all hooks
  if (isLoading) {
    return (
      <>
        <Navbar
          brandName="FarmHub Analytics"
          links={[{ label: 'Dashboard', href: '/dashboard' }]}
          cta={{ label: 'Dashboard', href: '/dashboard' }}
        />
        <Container maxW="7xl" py={20}>
          <VStack gap={4}>
            <LoadingSpinner size="xl" color="brand.500" />
            <Text color={textSecondary}>Memuat data proyek...</Text>
          </VStack>
        </Container>
      </>
    );
  }

  if (error || !projectResult) {
    return (
      <>
        <Navbar
          brandName="FarmHub Analytics"
          links={[{ label: 'Dashboard', href: '/dashboard' }]}
          cta={{ label: 'Dashboard', href: '/dashboard' }}
        />
        <Container maxW="7xl" py={8}>
          <Alert 
            status="error" 
            variant="subtle"
            title={error || 'Data proyek tidak ditemukan'}
            description={error ? 'Pastikan ID proyek valid dan Anda memiliki akses ke proyek ini.' : 'Silakan buat proyek baru atau akses melalui dashboard.'}
          />
          <HStack gap={4} mt={4}>
            <Button
              variant="solid"
              colorScheme="brand"
              onClick={() => navigate('/onboarding')}
            >
              Buat Proyek Baru
            </Button>
            <Button
              variant="outline"
              colorScheme="brand"
              onClick={() => navigate('/dashboard')}
            >
              Kembali ke Dashboard
            </Button>
          </HStack>
        </Container>
      </>
    );
  }

  // Validate data exists before using
  if (!data || !ringkasan_awal) {
    console.warn('Data atau ringkasan_awal tidak ada. Data:', data, 'Ringkasan:', ringkasan_awal);
    return (
      <>
        <Navbar
          brandName="FarmHub Analytics"
          links={[{ label: 'Dashboard', href: '/dashboard' }]}
          cta={{ label: 'Dashboard', href: '/dashboard' }}
        />
        <Container maxW="7xl" py={8}>
          <Alert 
            status="warning" 
            variant="subtle"
            title="Data tidak lengkap"
            description={
              <>
                <Text mb={2}>Data proyek tidak lengkap:</Text>
                <Text fontSize="sm">• Data: {data ? '✓ Ada' : '✗ Tidak ada'}</Text>
                <Text fontSize="sm">• Ringkasan: {ringkasan_awal ? '✓ Ada' : '✗ Tidak ada'}</Text>
                <Text fontSize="sm" mt={2}>Silakan refresh atau akses kembali dari dashboard.</Text>
              </>
            }
          />
          <Box mt={4} p={4} bg={useColorModeValue('gray.50', 'gray.800')} borderRadius="md">
            <Text fontSize="xs" fontFamily="mono" color={textSecondary}>
              Debug Info:
              <br />
              Project ID: {projectId || 'tidak ada'}
              <br />
              Has projectResult: {projectResult ? 'ya' : 'tidak'}
              <br />
              projectResult structure: {projectResult ? JSON.stringify(Object.keys(projectResult), null, 2) : 'null'}
            </Text>
          </Box>
          <HStack gap={4} mt={4}>
            <Button
              variant="solid"
              colorScheme="brand"
              onClick={() => window.location.reload()}
            >
              Refresh Halaman
            </Button>
            <Button
              variant="outline"
              colorScheme="brand"
              onClick={() => navigate('/dashboard')}
            >
              Kembali ke Dashboard
            </Button>
          </HStack>
        </Container>
      </>
    );
  }

  const isModalCukup = data.modal >= ringkasan_awal.estimasi_modal;
  const modalSelisih = Math.abs(data.modal - ringkasan_awal.estimasi_modal);

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[{ label: 'Dashboard', href: '/dashboard' }]}
        cta={{ label: 'Dashboard', href: '/dashboard' }}
      />
      <Container maxW="7xl" py={6}>
        <VStack gap={6} align="stretch">
          {/* Breadcrumbs Navigation */}
          {data && (
            <Breadcrumbs
              items={[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Proyek', href: '/dashboard' },
                { label: data.project_name || 'Detail Proyek', isCurrentPage: true },
              ]}
            />
          )}

          {/* Hero Section - Clean Header */}
          <VStack align="start" gap={3}>
            
            <HStack justify="space-between" align="start" w="full" flexWrap="wrap" gap={4}>
              <VStack align="start" gap={2} flex={1}>
                <Heading fontSize="2xl" fontWeight="bold" color={textPrimary} lineHeight="shorter">
                  {data.project_name}
                </Heading>
                
                <HStack gap={2} flexWrap="wrap">
                  <Badge 
                    colorScheme={getResikoColor(data.resiko)} 
                    px={3} 
                    py={1} 
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="medium"
                  >
                    {data.resiko}
                  </Badge>
                  <Badge 
                    colorScheme="brand" 
                    px={3} 
                    py={1} 
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="medium"
                  >
                    {data.jenis_ikan}
                  </Badge>
                  <Badge 
                    variant="outline"
                    colorScheme="brand"
                    px={3} 
                    py={1} 
                    borderRadius="full"
                    fontSize="xs"
                  >
                    <HStack gap={1}>
                      <FiMapPin size={12} />
                      <Text>{data.kabupaten_id}</Text>
                    </HStack>
                  </Badge>
                </HStack>
              </VStack>
              
              <HStack gap={2}>
                <Button
                  variant="outline"
                  colorScheme="brand"
                  size="sm"
                  onClick={handleOpenEditModal}
                >
                  <HStack gap={2}>
                    <FiEdit3 size={16} />
                    <Text>Edit Proyek</Text>
                  </HStack>
                </Button>
                <Button
                  variant="outline"
                  colorScheme="red"
                  size="sm"
                  onClick={handleOpenDeleteModal}
                >
                  <HStack gap={2}>
                    <FiTrash2 size={16} />
                    <Text>Hapus Proyek</Text>
                  </HStack>
                </Button>
              </HStack>
            </HStack>
          </VStack>

          {/* Main Score Section - Compact & Clean */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={2}>
            {/* Score Card - Featured */}
            <Card variant="elevated" p={3} display="flex" alignItems="center" justifyContent="center" minH="140px">
              <VStack align="center" gap={1.5} w="full">
                <Text fontSize="xs" color={textSecondary} fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                  Skor Kelayakan
                </Text>
                <Text 
                  fontSize="4xl" 
                  fontWeight="bold" 
                  color={
                    ringkasan_awal.skor_kelayakan >= 80 
                      ? green600
                      : ringkasan_awal.skor_kelayakan >= 70
                      ? orange600
                      : red600
                  }
                  lineHeight="1"
                >
                  {ringkasan_awal.skor_kelayakan}
                </Text>
                <Box
                  px={2.5}
                  py={1}
                  borderRadius="full"
                  bg={
                    ringkasan_awal.skor_kelayakan >= 80 
                      ? green100
                      : ringkasan_awal.skor_kelayakan >= 70
                      ? orange100
                      : red100
                  }
                  border="1px solid"
                  borderColor={
                    ringkasan_awal.skor_kelayakan >= 80 
                      ? green300
                      : ringkasan_awal.skor_kelayakan >= 70
                      ? orange300
                      : red300
                  }
                >
                  <Text fontSize="xs" fontWeight="semibold" color={textPrimary}>
                    {ringkasan_awal.skor_kelayakan >= 80 ? '✨ Sangat Layak' : 
                     ringkasan_awal.skor_kelayakan >= 70 ? '✓ Layak' : 
                     '⚠ Perlu Pertimbangan'}
                  </Text>
                </Box>
              </VStack>
            </Card>

            {/* Potensi Pasar */}
            <Card variant="elevated" p={3} display="flex" alignItems="center" justifyContent="center" minH="140px">
              <VStack align="center" gap={2} w="full">
                <Text fontSize="xs" color={textSecondary} fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                  Potensi Pasar
                </Text>
                <Badge 
                  colorScheme={getPotensiPasarColor(ringkasan_awal.potensi_pasar) as any}
                  fontSize="md"
                  px={3}
                  py={1.5}
                  borderRadius="lg"
                  fontWeight="bold"
                >
                  {ringkasan_awal.potensi_pasar}
                </Badge>
                <Text fontSize="xs" color={textSecondary}>
                  untuk {data.jenis_ikan}
                </Text>
              </VStack>
            </Card>

            {/* Estimasi Balik Modal */}
            <Card variant="elevated" p={3} display="flex" alignItems="center" justifyContent="center" minH="140px">
              <VStack align="center" gap={2} w="full">
                <Text fontSize="xs" color={textSecondary} fontWeight="medium" textTransform="uppercase" letterSpacing="wide">
                  Estimasi Balik Modal
                </Text>
                <Text fontSize="4xl" fontWeight="bold" color={textPrimary} lineHeight="1">
                  {ringkasan_awal.estimasi_balik_modal}
                </Text>
                <Text fontSize="xs" color={textSecondary}>
                  bulan untuk ROI
                </Text>
              </VStack>
            </Card>
          </SimpleGrid>


          {/* Project Details & Summary - Clean Layout */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={3}>
            {/* Project Details */}
            <Card variant="elevated" p={3}>
              <VStack align="start" gap={3}>
                <HStack gap={2} align="center">
                  <Box
                    p={1.5}
                    borderRadius="lg"
                    bg={brand100}
                  >
                    <FiInfo size={16} color={iconColor} />
                  </Box>
                  <Heading fontSize="md" fontWeight="semibold" color={textPrimary}>
                    Detail Proyek
                  </Heading>
                </HStack>
                
                <VStack align="stretch" gap={2.5} w="full">
                  <Box
                    p={2.5}
                    borderRadius="lg"
                    bg={cyan50}
                    border="1px solid"
                    borderColor={cyan200}
                  >
                    <HStack justify="space-between" align="center">
                      <HStack gap={2.5}>
                        <Box
                          p={1.5}
                          borderRadius="md"
                          bg={cyan100}
                        >
                          <FiDroplet size={14} color={cyan600} />
                        </Box>
                        <Text fontSize="sm" color={textSecondary} fontWeight="medium">Jenis Ikan</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="bold" color={textPrimary}>
                        {data.jenis_ikan}
                      </Text>
                    </HStack>
                  </Box>
                  
                  <Box
                    p={2.5}
                    borderRadius="lg"
                    bg={blue50}
                    border="1px solid"
                    borderColor={blue200}
                  >
                    <HStack justify="space-between" align="center">
                      <HStack gap={2.5}>
                        <Box
                          p={1.5}
                          borderRadius="md"
                          bg={blue100}
                        >
                          <FiMapPin size={14} color={blue600} />
                        </Box>
                        <Text fontSize="sm" color={textSecondary} fontWeight="medium">Lokasi</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="bold" color={textPrimary}>
                        {data.kabupaten_id}
                      </Text>
                    </HStack>
                  </Box>
                  
                  <Box
                    p={2.5}
                    borderRadius="lg"
                    bg={
                      getResikoColor(data.resiko) === 'success'
                        ? green50
                        : getResikoColor(data.resiko) === 'warning'
                        ? orange50
                        : red50
                    }
                    border="1px solid"
                    borderColor={
                      getResikoColor(data.resiko) === 'success'
                        ? green200
                        : getResikoColor(data.resiko) === 'warning'
                        ? orange200
                        : red200
                    }
                  >
                    <HStack justify="space-between" align="center">
                      <HStack gap={2.5}>
                        <Box
                          p={1.5}
                          borderRadius="md"
                          bg={
                            getResikoColor(data.resiko) === 'success'
                              ? green800
                              : getResikoColor(data.resiko) === 'warning'
                              ? orange800
                              : red800
                          }
                          color={
                            getResikoColor(data.resiko) === 'success'
                              ? green600light
                              : getResikoColor(data.resiko) === 'warning'
                              ? orange600light
                              : red600light
                          }
                        >
                          {getResikoIcon(data.resiko)}
                        </Box>
                        <Text fontSize="sm" color={textSecondary} fontWeight="medium">Tingkat Risiko</Text>
                      </HStack>
                      <Badge 
                        colorScheme={getResikoColor(data.resiko)} 
                        fontSize="xs" 
                        px={2.5} 
                        py={1}
                        borderRadius="md"
                        fontWeight="semibold"
                      >
                        {data.resiko}
                      </Badge>
                    </HStack>
                  </Box>
                  
                  {data.lat && data.lang && (
                    <Box
                      p={2.5}
                      borderRadius="lg"
                    bg={purple50}
                    border="1px solid"
                    borderColor={purple200}
                  >
                    <HStack justify="space-between" align="center">
                      <HStack gap={2.5}>
                        <Box
                          p={1.5}
                          borderRadius="md"
                          bg={purple100}
                        >
                          <FiNavigation size={14} color={purple600} />
                          </Box>
                          <Text fontSize="sm" color={textSecondary} fontWeight="medium">Koordinat</Text>
                        </HStack>
                        <Text fontSize="xs" color={textPrimary} fontFamily="mono" fontWeight="medium">
                          {data.lat.toFixed(4)}, {data.lang.toFixed(4)}
                        </Text>
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </VStack>
            </Card>

            {/* Summary & Recommendations */}
            <Card variant="elevated" p={4}>
              <VStack align="start" gap={3}>
                <HStack gap={2} align="center">
                  <Box
                    p={1.5}
                    borderRadius="md"
                    bg={brand100}
                  >
                    <FiInfo size={16} color={iconColor} />
                  </Box>
                  <Heading fontSize="sm" fontWeight="semibold" color={textPrimary}>
                    Analisis & Rekomendasi
                  </Heading>
                </HStack>
                
                <Box
                  p={4}
                  borderRadius="xl"
                  bg={cyan50}
                  border="1px solid"
                  borderColor={cyan200}
                  w="full"
                >
                  <VStack align="stretch" gap={2.5}>
                    {ringkasan_awal.kesimpulan_ringkasan.split('\n').map((paragraph, idx) => {
                      if (!paragraph.trim()) return null;
                      
                      // Check if paragraph is a bullet point or numbered
                      const isBullet = paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•');
                      const isNumbered = /^\d+[\.)]/.test(paragraph.trim());
                      
                      if (isBullet || isNumbered) {
                        return (
                          <HStack key={idx} align="start" gap={2.5}>
                            <Box
                              mt={1}
                              w={1.5}
                              h={1.5}
                              borderRadius="full"
                              bg={brand500}
                            />
                            <Text flex={1} fontSize="sm" color={textPrimary} lineHeight="relaxed">
                              {paragraph.replace(/^[-•]\s*/, '').replace(/^\d+[\.)]\s*/, '').trim()}
                            </Text>
                          </HStack>
                        );
                      }
                      
                      // Regular paragraph
                      return (
                        <Text key={idx} fontSize="sm" color={textPrimary} lineHeight="relaxed">
                          {paragraph.trim()}
                        </Text>
                      );
                    })}
                  </VStack>
                </Box>
                
                {ringkasan_awal.ai_analysis?.model_used && (
                  <HStack 
                    justify="flex-end" 
                    w="full" 
                    pt={2} 
                    borderTop="1px solid" 
                    borderColor={borderColor}
                    opacity={0.7}
                  >
                    <Text fontSize="xs" color={textSecondary} fontStyle="italic">
                      Analisis menggunakan {ringkasan_awal.ai_analysis.model_used}
                    </Text>
                  </HStack>
                )}
              </VStack>
            </Card>
          </SimpleGrid>

          {/* Action Buttons - Clean & Organized */}
          <Card variant="elevated" p={4}>
            <VStack gap={3} align="stretch">
              {/* Primary Actions */}
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={2.5}>
                  <Button
                    variant="solid"
                    colorScheme="brand"
                    onClick={() => navigate(`/plan-detail/${data.id}`)}
                    w="full"
                    size="md"
                  >
                    <HStack gap={2}>
                      <FiExternalLink />
                      <Text>Lihat Rencana Detail</Text>
                    </HStack>
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="brand"
                    onClick={() => navigate('/dashboard')}
                    w="full"
                    size="md"
                  >
                    <HStack gap={2}>
                      <FiArrowLeft />
                      <Text>Kembali ke Dashboard</Text>
                    </HStack>
                  </Button>
                </SimpleGrid>
              
              {/* Secondary Actions */}
              <Box w="full" h="1px" bg={borderColor} opacity={0.5} />
              
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={2.5}>
                <Button
                  variant="outline"
                  colorScheme="brand"
                  onClick={handleOpenEditModal}
                  w="full"
                  size="sm"
                >
                  <HStack gap={2}>
                    <FiEdit3 size={16} />
                    <Text>Edit Proyek</Text>
                  </HStack>
                </Button>
                <Button
                  variant="outline"
                  colorScheme="red"
                  onClick={handleOpenDeleteModal}
                  w="full"
                  size="sm"
                >
                  <HStack gap={2}>
                    <FiTrash2 size={16} />
                    <Text>Hapus Proyek</Text>
                  </HStack>
                </Button>
                <Button
                  variant="outline"
                  colorScheme="brand"
                  onClick={async () => {
                    const url = `${window.location.origin}/onboarding/result/${data.id}`;
                    try {
                      await navigator.clipboard.writeText(url);
                      alert('Link berhasil disalin!');
                    } catch (err) {
                      const textarea = document.createElement('textarea');
                      textarea.value = url;
                      textarea.style.position = 'fixed';
                      textarea.style.opacity = '0';
                      document.body.appendChild(textarea);
                      textarea.select();
                      document.execCommand('copy');
                      document.body.removeChild(textarea);
                      alert('Link berhasil disalin!');
                    }
                  }}
                  w="full"
                  size="sm"
                >
                  <HStack gap={2}>
                    <FiCopy size={16} />
                    <Text>Share Link</Text>
                  </HStack>
                </Button>
                <Button
                  variant="ghost"
                  colorScheme="brand"
                  onClick={() => navigate('/onboarding')}
                  w="full"
                  size="sm"
                >
                  <Text>Buat Proyek Baru</Text>
                </Button>
              </SimpleGrid>
            </VStack>
          </Card>

          {/* Edit Project Modal */}
          {isEditModalOpen && (
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.600"
              zIndex={1000}
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={4}
              onClick={() => !isUpdating && setIsEditModalOpen(false)}
            >
              <Box
                maxW="4xl"
                w="full"
                maxH="90vh"
                overflowY="auto"
                bg={whiteBg}
                borderRadius="xl"
                boxShadow="2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <VStack align="stretch" gap={0}>
                  {/* Modal Header */}
                  <Box
                    p={6}
                    borderBottom="1px solid"
                    borderColor={borderColor}
                  >
                    <HStack justify="space-between" align="start">
                      <VStack align="start" gap={1} flex={1}>
                        <Heading fontSize="xl" fontWeight="bold" color={textPrimary}>
                          Edit Proyek & Generate Ulang
                        </Heading>
                        <Text fontSize="sm" color={textSecondary}>
                          Ubah informasi proyek untuk generate analisis baru
                        </Text>
                      </VStack>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditModalOpen(false)}
                        disabled={isUpdating}
                      >
                        <FiX size={20} />
                      </Button>
                    </HStack>
                  </Box>

                  {/* Modal Body */}
                  <Box p={6}>
                    <VStack gap={6} align="stretch">
                      {updateError && (
                        <Alert 
                          status="error" 
                          variant="subtle"
                          title={updateError}
                        />
                      )}

                      <LocationStep
                        data={{
                          kabupaten_id: editFormData.kabupaten_id,
                          lang: editFormData.lang,
                          lat: editFormData.lat,
                        }}
                        onChange={(data) => setEditFormData((prev) => ({ ...prev, ...data }))}
                        errors={formErrors}
                      />

                      <ProjectDetailsStep
                        data={{
                          jenis_ikan: editFormData.jenis_ikan,
                          modal: editFormData.modal,
                        }}
                        onChange={(data) => setEditFormData((prev) => ({ ...prev, ...data }))}
                        errors={formErrors}
                      />

                      <RiskLevelStep
                        data={{
                          resiko: editFormData.resiko,
                        }}
                        onChange={(data) => setEditFormData((prev) => ({ ...prev, ...data }))}
                        errors={formErrors}
                      />
                    </VStack>
                  </Box>

                  {/* Modal Footer */}
                  <Box
                    p={6}
                    borderTop="1px solid"
                    borderColor={borderColor}
                  >
                    <HStack gap={3} justify="flex-end">
                      <Button
                        variant="outline"
                        colorScheme="brand"
                        onClick={() => setIsEditModalOpen(false)}
                        disabled={isUpdating}
                      >
                        Batal
                      </Button>
                      <Button
                        variant="solid"
                        colorScheme="brand"
                        onClick={handleUpdateProject}
                        loading={isUpdating}
                        loadingText="Mengupdate..."
                      >
                        Update & Generate Ulang
                      </Button>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </Box>
          )}

          {/* Delete Project Confirmation Modal */}
          {isDeleteModalOpen && (
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.600"
              zIndex={1000}
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={4}
              onClick={handleCloseDeleteModal}
            >
              <Box
                maxW="md"
                w="full"
                bg={whiteBg}
                borderRadius="xl"
                boxShadow="2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <VStack align="stretch" gap={0}>
                  {/* Modal Header */}
                  <Box
                    p={6}
                    borderBottom="1px solid"
                    borderColor={borderColor}
                  >
                    <HStack justify="space-between" align="start">
                      <VStack align="start" gap={1} flex={1}>
                        <Heading fontSize="xl" fontWeight="bold" color={textPrimary}>
                          Hapus Proyek
                        </Heading>
                        <Text fontSize="sm" color={textSecondary}>
                          Tindakan ini tidak dapat dibatalkan
                        </Text>
                      </VStack>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCloseDeleteModal}
                        disabled={isDeleting}
                      >
                        <FiX size={20} />
                      </Button>
                    </HStack>
                  </Box>

                  {/* Modal Body */}
                  <Box p={6}>
                    <VStack gap={4} align="stretch">
                      {deleteError && (
                        <Alert 
                          status="error" 
                          variant="subtle"
                          title={deleteError}
                        />
                      )}

                      <Alert 
                        status="warning" 
                        variant="subtle"
                        title="Peringatan"
                        description="Apakah Anda yakin ingin menghapus proyek ini? Semua data analisis, roadmap, dan informasi terkait akan dihapus secara permanen dan tidak dapat dikembalikan."
                      />

                      {data && (
                        <Box
                          p={4}
                          borderRadius="md"
                          bg={gray50Modal}
                          border="1px solid"
                          borderColor={borderColor}
                        >
                          <VStack align="start" gap={2}>
                            <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                              Proyek yang akan dihapus:
                            </Text>
                            <Text fontSize="sm" color={textPrimary}>
                              {data.project_name}
                            </Text>
                            <Text fontSize="xs" color={textSecondary}>
                              ID: {data.id}
                            </Text>
                          </VStack>
                        </Box>
                      )}
                    </VStack>
                  </Box>

                  {/* Modal Footer */}
                  <Box
                    p={6}
                    borderTop="1px solid"
                    borderColor={borderColor}
                  >
                    <HStack gap={3} justify="flex-end">
                      <Button
                        variant="outline"
                        colorScheme="brand"
                        onClick={handleCloseDeleteModal}
                        disabled={isDeleting}
                      >
                        Batal
                      </Button>
                      <Button
                        variant="solid"
                        colorScheme="red"
                        onClick={handleDeleteProject}
                        loading={isDeleting}
                        loadingText="Menghapus..."
                        disabled={isDeleting}
                        leftIcon={<FiTrash2 />}
                      >
                        {isDeleting ? 'Menghapus...' : 'Ya, Hapus Proyek'}
                      </Button>
                    </HStack>
                  </Box>
                </VStack>
              </Box>
            </Box>
          )}
        </VStack>
      </Container>
    </>
  );
}

