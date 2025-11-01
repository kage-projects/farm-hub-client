import { Container, VStack, HStack, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Button as CustomButton } from '../components/button/Button';
import { useColorModeValue } from '../components/ui/color-mode';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

/**
 * 404 Not Found Page
 */
export function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[
          { label: 'Beranda', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
        ]}
        cta={
          isAuthenticated
            ? { label: 'Dashboard', href: '/dashboard' }
            : { label: 'Masuk', href: '/login' }
        }
        user={user ? { name: user.name || user.email || 'User' } : null}
      />
      <Container maxW="2xl" py={20}>
        <VStack gap={6} textAlign="center">
          <Heading fontSize="6xl" fontWeight="bold" color={textPrimary}>
            404
          </Heading>
          <Heading fontSize="2xl" fontWeight="semibold" color={textPrimary}>
            Halaman Tidak Ditemukan
          </Heading>
          <Text fontSize="lg" color={textSecondary} maxW="md">
            Maaf, halaman yang Anda cari tidak ditemukan. Mungkin halaman telah dipindahkan atau URL yang Anda masukkan salah.
          </Text>
          <HStack gap={4} justify="center" flexWrap="wrap">
            <CustomButton
              variant="solid"
              colorScheme="brand"
              size="lg"
              onClick={() => navigate('/')}
              leftIcon={<FiHome />}
            >
              Kembali ke Beranda
            </CustomButton>
            {isAuthenticated && (
              <CustomButton
                variant="outline"
                colorScheme="brand"
                size="lg"
                onClick={() => navigate('/dashboard')}
                leftIcon={<FiArrowLeft />}
              >
                Kembali ke Dashboard
              </CustomButton>
            )}
          </HStack>
        </VStack>
      </Container>
    </>
  );
}

