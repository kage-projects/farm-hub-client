import { Container, VStack, HStack, Heading, Text, Button, SimpleGrid, Box } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/navbar/Navbar';
import { OceanBackground } from '../../components/layout/OceanBackground';
import { useColorModeValue } from '../../components/ui/color-mode';
import { Button as CustomButton } from '../../components/button/Button';
import { useAuth } from '../../hooks/useAuth';

/**
 * Landing Page
 * - Hero section dengan CTA
 * - Features highlight
 * - CTA untuk register/login (jika belum login)
 * - CTA untuk dashboard (jika sudah login)
 */
export function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const features = [
    {
      title: 'Analisis Kelayakan',
      description: 'Dapatkan analisis lengkap tentang kelayakan proyek budidaya ikan Anda',
      icon: '📊',
    },
    {
      title: 'Rencana Detail',
      description: 'Simulasi modal, biaya operasional, dan proyeksi pendapatan',
      icon: '📈',
    },
    {
      title: 'Peta Supplier',
      description: 'Temukan supplier bibit, pakan, dan pasar terdekat',
      icon: '📍',
    },
    {
      title: 'ROI Calculator',
      description: 'Hitung estimasi ROI dan waktu balik modal dengan akurat',
      icon: '💰',
    },
  ];

  return (
    <OceanBackground>
      <Navbar
        brandName="FarmHub Analytics"
        links={[
          { label: 'Fitur', href: '#features' },
          { label: 'Tentang', href: '#about' },
        ]}
        cta={
          isAuthenticated
            ? { label: 'Dashboard', href: '/dashboard' }
            : { label: 'Mulai Sekarang', href: '/register' }
        }
        user={user ? { name: user.name || user.email || 'User' } : null}
      />
      <Container maxW="7xl" py={20}>
        {/* Hero Section */}
        <VStack gap={8} textAlign="center" py={16}>
          <Heading fontSize="3xl" fontWeight="800" color={textPrimary}>
            Analisis Kelayakan Proyek
            <br />
            Budidaya Ikan di Sumatra Barat
          </Heading>
          <Text fontSize="xl" color={textSecondary} maxW="2xl">
            Dapatkan analisis lengkap dan rencana detail untuk memulai proyek budidaya ikan Anda dengan confidence
          </Text>
          <HStack gap={4} flexWrap="wrap" justify="center">
            {isAuthenticated ? (
              <>
                <CustomButton
                  variant="solid"
                  colorScheme="brand"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                >
                  Masuk ke Dashboard
                </CustomButton>
                <CustomButton
                  variant="outline"
                  colorScheme="brand"
                  size="lg"
                  onClick={() => navigate('/quick-plan')}
                >
                  Buat Proyek Baru
                </CustomButton>
              </>
            ) : (
              <>
                <Link to="/dashboard">
                  <CustomButton variant="solid" colorScheme="brand" size="lg">
                    Coba Demo
                  </CustomButton>
                </Link>
                <Link to="/register">
                  <CustomButton variant="solid" colorScheme="accent" size="lg">
                    Daftar Gratis
                  </CustomButton>
                </Link>
                <Link to="/login">
                  <CustomButton variant="outline" colorScheme="brand" size="lg">
                    Masuk
                  </CustomButton>
                </Link>
              </>
            )}
          </HStack>
        </VStack>

        {/* Features Section */}
        <Box id="features" py={16}>
          <VStack gap={12}>
            <VStack gap={2} textAlign="center">
              <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                Fitur Unggulan
              </Heading>
              <Text fontSize="lg" color={textSecondary} maxW="xl">
                Semua yang Anda butuhkan untuk memulai proyek budidaya ikan
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} w="full">
              {features.map((feature, index) => (
                <Box
                  key={index}
                  p={6}
                  borderRadius="xl"
                  bg={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(30, 58, 138, 0.5)')}
                  backdropFilter="blur(12px)"
                  border="1px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                  textAlign="center"
                >
                  <Text fontSize="4xl" mb={3}>
                    {feature.icon}
                  </Text>
                  <Heading fontSize="md" fontWeight="semibold" color={textPrimary} mb={2}>
                    {feature.title}
                  </Heading>
                  <Text fontSize="sm" color={textSecondary}>
                    {feature.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Box>

        {/* CTA Section */}
        <Box py={16} textAlign="center">
          <VStack gap={6}>
            <Heading fontSize="xl" fontWeight="bold" color={textPrimary}>
              Siap Memulai Proyek Anda?
            </Heading>
            <Text fontSize="lg" color={textSecondary} maxW="lg">
              Daftar sekarang dan dapatkan analisis kelayakan gratis untuk proyek budidaya ikan pertama Anda
            </Text>
            <HStack gap={4} justify="center">
              {isAuthenticated ? (
                <CustomButton
                  variant="solid"
                  colorScheme="brand"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                >
                  Masuk ke Dashboard
                </CustomButton>
              ) : (
                <>
                  <Link to="/dashboard">
                    <CustomButton variant="outline" colorScheme="brand" size="lg">
                      Coba Demo
                    </CustomButton>
                  </Link>
                  <Link to="/register">
                    <CustomButton variant="solid" colorScheme="brand" size="lg">
                      Daftar Gratis
                    </CustomButton>
                  </Link>
                </>
              )}
            </HStack>
          </VStack>
        </Box>
      </Container>
    </OceanBackground>
  );
}

