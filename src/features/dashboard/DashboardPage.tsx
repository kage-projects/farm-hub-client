import { Container, VStack, HStack, Heading, Text, SimpleGrid, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/navbar/Navbar';
import { Button } from '../../components/button/Button';
import { ProjectCard } from '../../components/data/ProjectCard';
import { StatCard } from '../../components/data/StatCard';
import { Card, CardBody } from '../../components/surfaces/Card';
import { Alert } from '../../components/feedback/Alert';
import { useColorModeValue } from '../../components/ui/color-mode';
import { Spinner as LoadingSpinner } from '../../components/feedback/Spinner';
import { FiPlus, FiFileText, FiCheckCircle, FiClock, FiShoppingCart, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { getAllProjects, deleteProject } from '../onboarding/services/projectApi';
import { useAuth } from '../../hooks/useAuth';

/**
 * Dashboard Page
 * - Overview semua project
 * - Stats cards
 * - Button tambah project
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const iconColor = useColorModeValue('brand.600', 'brand.400');

  const [projects, setProjects] = useState<Array<{
    id: string;
    name: string;
    location: string;
    fishType: string;
    status: 'completed' | 'generating' | 'draft';
    createdAt: Date;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getAllProjects();
        console.log('Response dari getAllProjects:', response);
        
        // Handle different response structures
        // Response bisa berupa:
        // 1. Array langsung: ProjectSummary[]
        // 2. Object GetAllProjectsResponse: { success, message, data: ProjectSummary[] }
        let projectsData: Array<{
          id: string;
          project_name: string;
          kabupaten_id: string;
          resiko: string;
        }>;
        
        if (Array.isArray(response)) {
          // Response adalah array langsung
          projectsData = response;
        } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
          // Response adalah GetAllProjectsResponse dengan structure { success, message, data: [...] }
          projectsData = response.data;
        } else {
          throw new Error(`Format response tidak valid. Tipe: ${typeof response}, Response: ${JSON.stringify(response).substring(0, 200)}`);
        }

        // Transform API response to match ProjectCard interface
        const transformedProjects = projectsData.map((project) => {
          // Extract jenis ikan from project name (e.g., "Project LELE - Padang" -> "LELE")
          let fishType = 'Ikan';
          const nameUpper = project.project_name?.toUpperCase() || '';
          if (nameUpper.includes('LELE')) fishType = 'Lele';
          else if (nameUpper.includes('NILA')) fishType = 'Nila';
          else if (nameUpper.includes('GURAME')) fishType = 'Gurame';
          else if (nameUpper.includes('PATIN')) fishType = 'Patin';
          else if (nameUpper.includes('MAS')) fishType = 'Mas';

          return {
            id: project.id,
            name: project.project_name || 'Unnamed Project',
            location: `${project.kabupaten_id || 'Unknown'}, Sumatra Barat`,
            fishType,
            status: 'completed' as const, // Default status since API doesn't return it
            createdAt: new Date(), // API doesn't return createdAt in summary
          };
        });
        setProjects(transformedProjects);
      } catch (err: any) {
        const errorMessage = err.message || 'Gagal memuat data proyek';
        setError(errorMessage);
        setProjects([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleViewProject = (id: string) => {
    navigate(`/onboarding/result/${id}`);
  };

  const handleEditProject = (id: string) => {
    navigate(`/onboarding/result/${id}`);
  };

  const handleOpenDeleteModal = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      setProjectToDelete({ id: project.id, name: project.name });
      setIsDeleteModalOpen(true);
      setDeleteError(null);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
      setDeleteError(null);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteProject(projectToDelete.id);
      
      // Remove project from list
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      
      // Close modal
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
      
      // Show success (optional: bisa pakai toast)
      alert('Proyek berhasil dihapus!');
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal menghapus proyek';
      setDeleteError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { 
            label: 'Proyek',
            children: [
              { label: 'Semua Proyek', href: '/dashboard' },
              { label: 'Buat Proyek Baru', href: '/onboarding' },
            ]
          },
          { label: 'Supplier', href: '/suppliers' },
          { label: 'RFQ', href: '/rfq' },
        ]}
        cta={{ 
          label: 'Logout', 
          href: '#',
          onClick: () => {
            logout();
            navigate('/');
          }
        }}
        user={user ? { name: user.name || user.email || 'User' } : null}
      />
      <Container maxW="7xl" py={8}>
        <VStack gap={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <VStack align="start" gap={1}>
              <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                Dashboard
              </Heading>
              <Text fontSize="md" color={textSecondary}>
                Kelola semua proyek budidaya ikan Anda
              </Text>
            </VStack>
            <HStack gap={2}>
              <Button
                variant="outline"
                colorScheme="brand"
                size="lg"
                onClick={() => navigate('/suppliers')}
              >
                <HStack gap={2}>
                  <FiSearch />
                  <Text>Cari Supplier</Text>
                </HStack>
              </Button>
              <Button
                variant="solid"
                colorScheme="brand"
                size="lg"
                onClick={() => navigate('/onboarding')}
              >
                <HStack gap={2}>
                  <FiPlus />
                  <Text>Buat Proyek Baru</Text>
                </HStack>
              </Button>
            </HStack>
          </HStack>

          {/* Quick Actions */}
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
            <Card variant="elevated" cursor="pointer" onClick={() => navigate('/quick-plan')} _hover={{ transform: 'translateY(-2px)' }} transition="all 0.2s">
              <CardBody>
                <HStack gap={3}>
                  <Box fontSize="2xl" color={useColorModeValue('brand.600', 'brand.400')}>
                    <FiPlus />
                  </Box>
                  <VStack align="start" gap={0} flex={1}>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      Quick Plan
                    </Text>
                    <Text fontSize="xs" color={textSecondary}>
                      Generate rencana cepat (AI)
                    </Text>
                  </VStack>
                </HStack>
              </CardBody>
            </Card>
            <Card variant="elevated" cursor="pointer" onClick={() => navigate('/onboarding')} _hover={{ transform: 'translateY(-2px)' }} transition="all 0.2s">
              <CardBody>
                <HStack gap={3}>
                  <Box fontSize="2xl" color={useColorModeValue('brand.600', 'brand.400')}>
                    <FiPlus />
                  </Box>
                  <VStack align="start" gap={0} flex={1}>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      Buat Proyek Baru
                    </Text>
                    <Text fontSize="xs" color={textSecondary}>
                      Onboarding wizard
                    </Text>
                  </VStack>
                </HStack>
              </CardBody>
            </Card>
            <Card variant="elevated" cursor="pointer" onClick={() => navigate('/suppliers')} _hover={{ transform: 'translateY(-2px)' }} transition="all 0.2s">
              <CardBody>
                <HStack gap={3}>
                  <Box fontSize="2xl" color={useColorModeValue('secondary.600', 'secondary.400')}>
                    <FiSearch />
                  </Box>
                  <VStack align="start" gap={0} flex={1}>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      Supplier Directory
                    </Text>
                    <Text fontSize="xs" color={textSecondary}>
                      Cari supplier terpercaya
                    </Text>
                  </VStack>
                </HStack>
              </CardBody>
            </Card>
            <Card variant="elevated" cursor="pointer" onClick={() => navigate('/rfq')} _hover={{ transform: 'translateY(-2px)' }} transition="all 0.2s">
              <CardBody>
                <HStack gap={3}>
                  <Box fontSize="2xl" color={useColorModeValue('accent.600', 'accent.400')}>
                    <FiShoppingCart />
                  </Box>
                  <VStack align="start" gap={0} flex={1}>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      Buat RFQ
                    </Text>
                    <Text fontSize="xs" color={textSecondary}>
                      Request for Quotation
                    </Text>
                  </VStack>
                </HStack>
              </CardBody>
            </Card>
            <Card variant="elevated" cursor="pointer" onClick={() => navigate('/harvest')} _hover={{ transform: 'translateY(-2px)' }} transition="all 0.2s">
              <CardBody>
                <HStack gap={3}>
                  <Box fontSize="2xl" color={useColorModeValue('accent.600', 'accent.400')}>
                    <FiClock />
                  </Box>
                  <VStack align="start" gap={0} flex={1}>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      Harvest Planner
                    </Text>
                    <Text fontSize="xs" color={textSecondary}>
                      Kalender panen & demand
                    </Text>
                  </VStack>
                </HStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
            <StatCard
              label="Total Project"
              value={projects.length}
              icon={<FiFileText />}
            />
            <StatCard
              label="Selesai"
              value={projects.filter((p) => p.status === 'completed').length}
              icon={<FiCheckCircle />}
            />
            <StatCard
              label="Draft"
              value={projects.filter((p) => p.status === 'draft').length}
              icon={<FiFileText />}
            />
            <StatCard
              label="Processing"
              value={projects.filter((p) => p.status === 'generating').length}
              icon={<FiClock />}
            />
          </SimpleGrid>

          {/* Projects Grid */}
          <VStack align="stretch" gap={4}>
            <HStack justify="space-between">
              <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                Proyek Saya
              </Heading>
              {/* TODO: Add filter & search */}
            </HStack>

            {isLoading ? (
              <Box textAlign="center" py={12}>
                <VStack gap={4}>
                  <LoadingSpinner size="xl" color="brand.500" />
                  <Text color={textSecondary}>Memuat proyek...</Text>
                </VStack>
              </Box>
            ) : error ? (
              <Box>
                <Alert 
                  status="error" 
                  variant="subtle"
                  title={error}
                />
                <Button
                  variant="outline"
                  size="sm"
                  mt={4}
                  onClick={() => window.location.reload()}
                >
                  Muat Ulang
                </Button>
              </Box>
            ) : projects.length === 0 ? (
              <Box textAlign="center" py={12}>
                <Text fontSize="lg" color={textSecondary} mb={4}>
                  Belum ada project
                </Text>
                <Button
                  variant="solid"
                  colorScheme="brand"
                  onClick={() => navigate('/onboarding')}
                >
                  Buat Project Pertama
                </Button>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    {...project}
                    onView={handleViewProject}
                    onEdit={handleEditProject}
                    onDelete={handleOpenDeleteModal}
                  />
                ))}
              </SimpleGrid>
            )}
          </VStack>
        </VStack>
      </Container>

      {/* Delete Project Confirmation Modal */}
      {isDeleteModalOpen && projectToDelete && (
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
                borderColor={useColorModeValue('gray.200', 'gray.700')}
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

                  <Box
                    p={4}
                    borderRadius="md"
                    bg={useColorModeValue('gray.50', 'gray.800')}
                    border="1px solid"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                  >
                    <VStack align="start" gap={2}>
                      <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                        Proyek yang akan dihapus:
                      </Text>
                      <Text fontSize="sm" color={textPrimary}>
                        {projectToDelete.name}
                      </Text>
                      <Text fontSize="xs" color={textSecondary}>
                        ID: {projectToDelete.id}
                      </Text>
                    </VStack>
                  </Box>
                </VStack>
              </Box>

              {/* Modal Footer */}
              <Box
                p={6}
                borderTop="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
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
    </>
  );
}

