import { Container, VStack, HStack, Heading, Text, Button, SimpleGrid, Box } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { OceanBackground } from '../components/layout/OceanBackground';
import { useColorModeValue } from '../components/ui/color-mode';
import { Button as CustomButton } from '../components/button/Button';

/**
 * Landing Page
 * - Hero section dengan CTA
 * - Features highlight
 * - CTA untuk register/login
 */
export function LandingPage() {
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
        cta={{ label: 'Mulai Sekarang', href: '/register' }}
      />
      <Container maxW="7xl" py={20}>
        {/* Hero Section */}
        <VStack gap={8} textAlign="center" py={16}>
          <Heading size="3xl" color={textPrimary} fontWeight="800">
            Analisis Kelayakan Proyek
            <br />
            Budidaya Ikan di Sumatra Barat
          </Heading>
          <Text fontSize="xl" color={textSecondary} maxW="2xl">
            Dapatkan analisis lengkap dan rencana detail untuk memulai proyek budidaya ikan Anda dengan confidence
          </Text>
          <HStack gap={4}>
            <Link to="/register">
              <CustomButton variant="solid" colorScheme="brand" size="lg">
                Mulai Sekarang
              </CustomButton>
            </Link>
            <Link to="/login">
              <CustomButton variant="outline" colorScheme="brand" size="lg">
                Masuk
              </CustomButton>
            </Link>
          </HStack>
        </VStack>

        {/* Features Section */}
        <Box id="features" py={16}>
          <VStack gap={12}>
            <VStack gap={2} textAlign="center">
              <Heading size="2xl" color={textPrimary}>
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
                  <Heading size="md" color={textPrimary} mb={2}>
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
            <Heading size="xl" color={textPrimary}>
              Siap Memulai Proyek Anda?
            </Heading>
            <Text fontSize="lg" color={textSecondary} maxW="lg">
              Daftar sekarang dan dapatkan analisis kelayakan gratis untuk proyek budidaya ikan pertama Anda
            </Text>
            <Link to="/register">
              <CustomButton variant="solid" colorScheme="brand" size="lg">
                Daftar Gratis
              </CustomButton>
            </Link>
          </VStack>
        </Box>
      </Container>
    </OceanBackground>
  );
}

