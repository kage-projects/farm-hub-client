import { Container, VStack, HStack, Heading, Text, SimpleGrid, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Button } from '../components/button/Button';
import { ProjectCard } from '../components/data/ProjectCard';
import { StatCard } from '../components/data/StatCard';
import { useColorModeValue } from '../components/ui/color-mode';
import { FiPlus, FiFileText, FiCheckCircle, FiClock } from 'react-icons/fi';
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
    navigate(`/input?id=${id}`);
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
          { label: 'Proyek', href: '/dashboard' },
        ]}
        cta={{ label: 'Logout', href: '/' }}
        user={{ name: 'John Doe' }}
      />
      <Container maxW="7xl" py={8}>
        <VStack gap={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <VStack align="start" gap={1}>
              <Heading size="2xl" color={textPrimary}>
                Dashboard
              </Heading>
              <Text fontSize="md" color={textSecondary}>
                Kelola semua proyek budidaya ikan Anda
              </Text>
            </VStack>
            <Button
              variant="solid"
              colorScheme="brand"
              size="lg"
              leftIcon={<FiPlus />}
              onClick={() => navigate('/input')}
            >
              Tambah Project
            </Button>
          </HStack>

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
              <Heading size="lg" color={textPrimary}>
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
                  onClick={() => navigate('/input')}
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

