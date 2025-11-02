import { Container, VStack, HStack, Heading, Text, Box, SimpleGrid, Badge } from '@chakra-ui/react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '../../components/navbar/Navbar';
import { Button } from '../../components/button/Button';
import { ScoreCard } from '../../components/data/ScoreCard';
import { Card, CardBody, CardHeader } from '../../components/surfaces/Card';
import { useColorModeValue } from '../../components/ui/color-mode';
import { FiArrowLeft, FiMapPin, FiDroplet, FiInfo, FiExternalLink, FiCopy, FiEdit3, FiX } from 'react-icons/fi';
import { Spinner as LoadingSpinner } from '../../components/feedback/Spinner';
import { Alert } from '../../components/feedback/Alert';
import { LocationStep } from './components/LocationStep';
import { ProjectDetailsStep } from './components/ProjectDetailsStep';
import { RiskLevelStep } from './components/RiskLevelStep';
import { getProject, updateProject, type ProjectResponse, type CreateProjectRequest } from './services/projectApi';
import { SupplierMap } from '../../components/plan/SupplierMap';

/**
 * Project Result Page - Menampilkan hasil analisis proyek
 */
export function ProjectResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('#6b7280', '#9ca3af');

  const [projectResult, setProjectResult] = useState<ProjectResponse | null>(
    location.state?.projectResult || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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
        setProjectResult(response);
      } catch (err: any) {
        const errorMessage = err.message || 'Gagal memuat data proyek';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId, projectResult]);

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

  const { data, ringkasan_awal } = projectResult;
  
  // Validate that required fields exist
  if (!data) {
    throw new Error('Data proyek tidak ditemukan dalam response');
  }
  
  if (!ringkasan_awal) {
    throw new Error('Ringkasan awal tidak ditemukan dalam response');
  }

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
    return 'error';
  };

  const getResikoColor = (resiko: string) => {
    const upper = resiko.toUpperCase();
    if (upper === 'KONSERVATIF') return 'success';
    if (upper === 'MODERAT') return 'warning';
    return 'error';
  };

  const isModalCukup = data.modal >= ringkasan_awal.estimasi_modal;
  const modalSelisih = Math.abs(data.modal - ringkasan_awal.estimasi_modal);

  // Initialize edit form when opening modal
  const handleOpenEditModal = () => {
    if (projectResult && projectResult.data) {
      setEditFormData({
        kabupaten_id: projectResult.data.kabupaten_id || '',
        lang: projectResult.data.lang,
        lat: projectResult.data.lat,
        jenis_ikan: (projectResult.data.jenis_ikan as 'NILA' | 'LELE' | 'GURAME') || '',
        modal: projectResult.data.modal || 10_000_000,
        resiko: (projectResult.data.resiko as 'KONSERVATIF' | 'MODERAT' | 'AGRESIF') || '',
      });
      setFormErrors({});
      setUpdateError(null);
    }
    setIsEditModalOpen(true);
  };

  // Validate edit form
  const validateEditForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!editFormData.kabupaten_id) {
      errors.kabupaten_id = 'Kabupaten/Kota harus dipilih';
    }
    if (!editFormData.jenis_ikan) {
      errors.jenis_ikan = 'Jenis ikan harus dipilih';
    }
    if (!editFormData.modal || editFormData.modal < 10_000_000) {
      errors.modal = 'Modal minimal Rp 10.000.000';
    }
    if (!editFormData.resiko) {
      errors.resiko = 'Tingkat risiko harus dipilih';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle update project
  const handleUpdateProject = async () => {
    if (!validateEditForm() || !projectId) return;

    setIsUpdating(true);
    setUpdateError(null);

    try {
      const updateData: Partial<CreateProjectRequest> = {
        kabupaten_id: editFormData.kabupaten_id,
        jenis_ikan: editFormData.jenis_ikan as 'NILA' | 'LELE' | 'GURAME',
        modal: editFormData.modal,
        resiko: editFormData.resiko as 'KONSERVATIF' | 'MODERAT' | 'AGRESIF',
      };

      if (editFormData.lang !== undefined) {
        updateData.lang = editFormData.lang;
      }
      if (editFormData.lat !== undefined) {
        updateData.lat = editFormData.lat;
      }

      const updatedProject = await updateProject(projectId, updateData);
      
      // Update project result and close modal
      setProjectResult(updatedProject);
      setIsEditModalOpen(false);
      
      // Show success message
      alert('Proyek berhasil diupdate dan analisis telah di-generate ulang!');
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal mengupdate proyek';
      setUpdateError(errorMessage);
      
      // Handle validation errors
      if (err.errors) {
        setFormErrors(err.errors);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[{ label: 'Dashboard', href: '/dashboard' }]}
        cta={{ label: 'Dashboard', href: '/dashboard' }}
      />
      <Container maxW="6xl" py={8}>
        <VStack gap={8} align="stretch">
          {/* Hero Section - Clean Header */}
          <VStack align="start" gap={4}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <HStack gap={2}>
                <FiArrowLeft />
                <Text>Kembali</Text>
              </HStack>
            </Button>
            
            <VStack align="start" gap={3} w="full">
              <Heading fontSize="3xl" fontWeight="bold" color={textPrimary}>
                {data.project_name}
              </Heading>
              
              <HStack gap={2} flexWrap="wrap">
                <Badge 
                  colorScheme={getResikoColor(data.resiko)} 
                  px={3} 
                  py={1} 
                  borderRadius="full"
                  fontSize="xs"
                >
                  {data.resiko}
                </Badge>
                <Badge 
                  colorScheme="brand" 
                  px={3} 
                  py={1} 
                  borderRadius="full"
                  fontSize="xs"
                >
                  {data.jenis_ikan}
                </Badge>
                <Badge 
                  colorScheme="accent" 
                  px={3} 
                  py={1} 
                  borderRadius="full"
                  fontSize="xs"
                >
                  {data.kabupaten_id}
                </Badge>
              </HStack>
            </VStack>
          </VStack>

          {/* Main Score Section - Prominent */}
          <Card variant="elevated">
            <CardBody>
              <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
                {/* Score Card - Center */}
                <VStack align="center" justify="center" gap={3}>
                  <ScoreCard
                    score={ringkasan_awal.skor_kelayakan}
                    label="Skor Kelayakan"
                    size="lg"
                  />
                  <Box
                    px={4}
                    py={2}
                    borderRadius="full"
                    bg={
                      ringkasan_awal.skor_kelayakan >= 80 
                        ? useColorModeValue('green.100', 'green.900') 
                        : ringkasan_awal.skor_kelayakan >= 70
                        ? useColorModeValue('orange.100', 'orange.900')
                        : useColorModeValue('red.100', 'red.900')
                    }
                  >
                    <Text fontSize="xs" fontWeight="semibold" color={textPrimary}>
                      {ringkasan_awal.skor_kelayakan >= 80 ? 'Sangat Layak' : 
                       ringkasan_awal.skor_kelayakan >= 70 ? 'Layak' : 
                       'Perlu Pertimbangan'}
                    </Text>
                  </Box>
                </VStack>

                {/* Key Stats - Right Side */}
                <VStack align="start" gap={4} gridColumn={{ base: 1, lg: '2 / 4' }}>
                  <SimpleGrid columns={2} gap={4} w="full">
                    <Box>
                      <Text fontSize="xs" color={textSecondary} mb={1}>
                        Potensi Pasar
                      </Text>
                      <HStack gap={2}>
                        <Badge 
                          colorScheme={getPotensiPasarColor(ringkasan_awal.potensi_pasar) as any}
                          fontSize="sm"
                          px={2}
                          py={1}
                        >
                          {ringkasan_awal.potensi_pasar}
                        </Badge>
                      </HStack>
                    </Box>
                    <Box>
                      <Text fontSize="xs" color={textSecondary} mb={1}>
                        Balik Modal
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color={textPrimary}>
                        {ringkasan_awal.estimasi_balik_modal} bulan
                      </Text>
                    </Box>
                  </SimpleGrid>

                  <Box w="full" h="1px" bg={borderColor} />

                  {/* Modal Comparison - Simplified */}
                  <VStack align="start" gap={3} w="full">
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      Perbandingan Modal
                    </Text>
                    <SimpleGrid columns={2} gap={3} w="full">
                      <Box
                        p={3}
                        borderRadius="lg"
                        bg={useColorModeValue('blue.50', 'blue.900')}
                        border="1px solid"
                        borderColor={useColorModeValue('blue.200', 'blue.700')}
                      >
                        <Text fontSize="xs" color={textSecondary} mb={1}>
                          Diperlukan
                        </Text>
                        <Text fontSize="md" fontWeight="bold" color={textPrimary}>
                          {formatCurrency(ringkasan_awal.estimasi_modal)}
                        </Text>
                      </Box>
                      <Box
                        p={3}
                        borderRadius="lg"
                        bg={isModalCukup 
                          ? useColorModeValue('green.50', 'green.900') 
                          : useColorModeValue('red.50', 'red.900')}
                        border="1px solid"
                        borderColor={isModalCukup
                          ? useColorModeValue('green.200', 'green.700')
                          : useColorModeValue('red.200', 'red.700')}
                      >
                        <Text fontSize="xs" color={textSecondary} mb={1}>
                          Tersedia
                        </Text>
                        <Text fontSize="md" fontWeight="bold" color={textPrimary}>
                          {formatCurrency(data.modal)}
                        </Text>
                      </Box>
                    </SimpleGrid>
                    <Box
                      px={3}
                      py={2}
                      borderRadius="md"
                      bg={isModalCukup
                        ? useColorModeValue('green.50', 'green.900')
                        : useColorModeValue('orange.50', 'orange.900')}
                      border="1px solid"
                      borderColor={isModalCukup
                        ? useColorModeValue('green.200', 'green.700')
                        : useColorModeValue('orange.200', 'orange.700')}
                      w="full"
                    >
                      <HStack gap={2}>
                        <Text fontSize="sm">{isModalCukup ? '✅' : '⚠️'}</Text>
                        <Text fontSize="xs" color={textPrimary}>
                          {isModalCukup ? (
                            <>Cukup - Selisih: <Text as="span" fontWeight="semibold">{formatCurrency(modalSelisih)}</Text></>
                          ) : (
                            <>Kurang - Kekurangan: <Text as="span" fontWeight="semibold">{formatCurrency(modalSelisih)}</Text></>
                          )}
                        </Text>
                      </HStack>
                    </Box>
                  </VStack>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>


          {/* Project Details & Summary - Combined */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            {/* Project Details */}
            <Card variant="elevated">
              <CardHeader>
                <HStack gap={2}>
                  <FiInfo size={18} color={iconColor} />
                  <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                    Detail Proyek
                  </Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" gap={4}>
                  <HStack justify="space-between" py={2}>
                    <HStack gap={2}>
                      <FiDroplet size={16} color={iconColor} />
                      <Text fontSize="sm" color={textSecondary}>Jenis Ikan</Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      {data.jenis_ikan}
                    </Text>
                  </HStack>
                  <Box w="full" h="1px" bg={borderColor} />
                  <HStack justify="space-between" py={2}>
                    <HStack gap={2}>
                      <FiMapPin size={16} color={iconColor} />
                      <Text fontSize="sm" color={textSecondary}>Lokasi</Text>
                    </HStack>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      {data.kabupaten_id}
                    </Text>
                  </HStack>
                  <Box w="full" h="1px" bg={borderColor} />
                  <HStack justify="space-between" py={2}>
                    <Text fontSize="sm" color={textSecondary}>Tingkat Risiko</Text>
                    <Badge colorScheme={getResikoColor(data.resiko)} fontSize="xs" px={2} py={1}>
                      {data.resiko}
                    </Badge>
                  </HStack>
                  <Box w="full" h="1px" bg={borderColor} />
                  <HStack justify="space-between" py={2}>
                    <Text fontSize="sm" color={textSecondary}>Jumlah Team</Text>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      {data.jumlah_team} orang
                    </Text>
                  </HStack>
                  {data.lat && data.lang && (
                    <>
                      <Box w="full" h="1px" bg={borderColor} />
                      <HStack justify="space-between" py={2}>
                        <Text fontSize="sm" color={textSecondary}>Koordinat</Text>
                        <Text fontSize="xs" color={textSecondary}>
                          {data.lat.toFixed(4)}, {data.lang.toFixed(4)}
                        </Text>
                      </HStack>
                    </>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Summary & Recommendations */}
            <Card variant="elevated">
              <CardHeader>
                <HStack gap={2}>
                  <FiInfo size={18} color={iconColor} />
                  <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                    Analisis & Rekomendasi
                  </Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <Box
                  p={4}
                  borderRadius="lg"
                  bg={useColorModeValue('gray.50', 'gray.800')}
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Text fontSize="sm" color={textPrimary} lineHeight="tall" whiteSpace="pre-line">
                    {ringkasan_awal.kesimpulan_ringkasan}
                  </Text>
                </Box>
                {ringkasan_awal.ai_analysis?.model_used && (
                  <Box mt={4} pt={4} borderTop="1px solid" borderColor={borderColor}>
                    <Text fontSize="xs" color={textSecondary}>
                      Analisis menggunakan {ringkasan_awal.ai_analysis.model_used}
                    </Text>
                  </Box>
                )}
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Supplier Map */}
          <Card variant="elevated">
            <CardHeader>
              <HStack gap={2}>
                <FiMapPin size={18} color={iconColor} />
                <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                  Peta Lokasi Supplier
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <SupplierMap
                jenisIkan={data.jenis_ikan}
                kota={data.kabupaten_id}
                centerLocation={data.lat && data.lang 
                  ? { lat: data.lat, lng: data.lang }
                  : undefined
                }
              />
            </CardBody>
          </Card>

          {/* Action Buttons - Simplified */}
          <Card variant="elevated">
            <CardBody>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} gap={3}>
                <Button
                  variant="outline"
                  colorScheme="brand"
                  onClick={() => navigate('/dashboard')}
                  w="full"
                >
                  <HStack gap={2}>
                    <FiArrowLeft />
                    <Text>Dashboard</Text>
                  </HStack>
                </Button>
                <Button
                  variant="solid"
                  colorScheme="brand"
                  onClick={() => navigate(`/plan?project=${data.id}`)}
                  w="full"
                >
                  <HStack gap={2}>
                    <FiExternalLink />
                    <Text>Rencana Detail</Text>
                  </HStack>
                </Button>
                <Button
                  variant="outline"
                  colorScheme="accent"
                  onClick={handleOpenEditModal}
                  w="full"
                >
                  <HStack gap={2}>
                    <FiEdit3 />
                    <Text>Edit & Generate Ulang</Text>
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
                >
                  <HStack gap={2}>
                    <FiCopy />
                    <Text>Share Link</Text>
                  </HStack>
                </Button>
                <Button
                  variant="ghost"
                  colorScheme="brand"
                  onClick={() => navigate('/onboarding')}
                  w="full"
                >
                  <Text>Proyek Baru</Text>
                </Button>
              </SimpleGrid>
            </CardBody>
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
                bg={useColorModeValue('white', 'gray.800')}
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
        </VStack>
      </Container>
    </>
  );
}

