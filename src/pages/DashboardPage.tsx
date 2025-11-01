import { Container, VStack, HStack, Heading, Text, SimpleGrid, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Button } from '../components/button/Button';
import { ProjectCard } from '../components/data/ProjectCard';
import { StatCard } from '../components/data/StatCard';
import { Card, CardBody, CardHeader } from '../components/surfaces/Card';
import { useColorModeValue } from '../components/ui/color-mode';
import { FiPlus, FiFileText, FiCheckCircle, FiClock, FiShoppingCart, FiSearch } from 'react-icons/fi';
import { useState } from 'react';

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

  // Sample projects - dalam real app, ini dari API/state management
  const [projects] = useState([
    {
      id: '1',
      name: 'Proyek Budidaya Nila - Padang',
      location: 'Padang, Sumatra Barat',
      fishType: 'Nila',
      status: 'completed' as const,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Proyek Lele - Bukittinggi',
      location: 'Bukittinggi, Sumatra Barat',
      fishType: 'Lele',
      status: 'generating' as const,
      createdAt: new Date('2024-01-20'),
    },
    {
      id: '3',
      name: 'Proyek Patin - Solok',
      location: 'Solok, Sumatra Barat',
      fishType: 'Patin',
      status: 'draft' as const,
      createdAt: new Date('2024-01-22'),
    },
  ]);

  const handleViewProject = (id: string) => {
    navigate(`/plan?id=${id}`);
  };

  const handleEditProject = (id: string) => {
    navigate(`/onboarding?id=${id}`);
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
                leftIcon={<FiSearch />}
                onClick={() => navigate('/suppliers')}
              >
                Cari Supplier
              </Button>
              <Button
                variant="solid"
                colorScheme="brand"
                size="lg"
                leftIcon={<FiPlus />}
                onClick={() => navigate('/onboarding')}
              >
                Buat Proyek Baru
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

            {projects.length === 0 ? (
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

