import { Container, VStack, HStack, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Button } from '../components/button/Button';
import { useColorModeValue } from '../components/ui/color-mode';
import { NotificationCenter } from '../components/notifications/NotificationCenter';
import { FiArrowLeft } from 'react-icons/fi';

/**
 * Notifications Page - Full page view
 */
export function NotificationsPage() {
  const navigate = useNavigate();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[{ label: 'Dashboard', href: '/dashboard' }]}
        cta={{ label: 'Dashboard', href: '/dashboard' }}
      />
      <Container maxW="4xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Header */}
          <HStack gap={4}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              leftIcon={<FiArrowLeft />}
            >
              Kembali
            </Button>
            <VStack align="start" gap={1} flex={1}>
              <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
                Notifikasi
              </Heading>
              <Text fontSize="md" color={textSecondary}>
                Semua notifikasi dan pembaruan
              </Text>
            </VStack>
          </HStack>

          {/* Notification Center */}
          <NotificationCenter />
        </VStack>
      </Container>
    </>
  );
}

