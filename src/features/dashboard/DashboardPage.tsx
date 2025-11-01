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
import { FiPlus, FiFileText, FiCheckCircle, FiClock, FiShoppingCart, FiSearch } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { getAllProjects } from '../onboarding/services/projectApi';

/**
 * Dashboard Page
 * - Overview semua project
 * - Stats cards
 * - Button tambah project
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

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

  const handleDeleteProject = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus project ini?')) {
      // TODO: Implement delete
      console.log('Delete project:', id);
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
        cta={{ label: 'Logout', href: '/' }}
        user={{ name: 'John Doe' }}
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
            <Card variant="elevated" cursor="pointer" onClick={() => navigate('/quick-plan')}>
              <CardBody>
                <HStack gap={3}>
                  <Box fontSize="2xl" color="brand.600">
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
            <Card variant="elevated" cursor="pointer" onClick={() => navigate('/onboarding')}>
              <CardBody>
                <HStack gap={3}>
                  <Box fontSize="2xl" color="brand.600">
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
            <Card variant="elevated" cursor="pointer" onClick={() => navigate('/suppliers')}>
              <CardBody>
                <HStack gap={3}>
                  <Box fontSize="2xl" color="secondary.600">
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
            <Card variant="elevated" cursor="pointer" onClick={() => navigate('/rfq')}>
              <CardBody>
                <HStack gap={3}>
                  <Box fontSize="2xl" color="accent.600">
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
            <Card variant="elevated" cursor="pointer" onClick={() => navigate('/harvest')}>
              <CardBody>
                <HStack gap={3}>
                  <Box fontSize="2xl" color="accent.600">
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
                    onDelete={handleDeleteProject}
                  />
                ))}
              </SimpleGrid>
            )}
          </VStack>
        </VStack>
      </Container>
    </>
  );
}

