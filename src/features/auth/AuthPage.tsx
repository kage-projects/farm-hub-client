/**
 * Auth Page - Main authentication page with login/register tabs
 */

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, VStack, HStack, Heading, Text } from '@chakra-ui/react';
import { Tabs } from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { useColorModeValue } from '../../components/ui/color-mode';
import { Button } from '../../components/button/Button';
import { LoginForm, RegisterForm } from './components';

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(() => {
    // Check if coming from register link or login link
    return location.pathname === '/register' ? 1 : 0;
  });

  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  // Update tab index when URL changes (e.g., from link clicks)
  useEffect(() => {
    const newTabIndex = location.pathname === '/register' ? 1 : 0;
    setTabIndex(newTabIndex);
  }, [location.pathname]);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    // Update URL without navigation
    const newPath = index === 0 ? '/login' : '/register';
    window.history.replaceState({}, '', newPath);
  };

  return (
    <Container 
      maxW="md" 
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      py={8}
      px={4}
    >
      <VStack gap={6} w="full">
        <HStack w="full" justify="flex-start" align="center" mb={-2}>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            size="sm"
            leftIcon={<FiArrowLeft />}
            colorScheme="brand"
            _hover={{
              bg: useColorModeValue('brand.50', 'brand.900'),
              transform: 'translateX(-2px)',
            }}
            transition="all 0.2s"
          >
            Kembali ke Beranda
          </Button>
        </HStack>

        <VStack gap={2} textAlign="center" mb={2}>
          <Heading size="xl" color={textPrimary}>
            {tabIndex === 0 ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
          </Heading>
          <Text fontSize="sm" color={textSecondary}>
            {tabIndex === 0
              ? 'Masukkan kredensial Anda untuk melanjutkan'
              : 'Daftar sekarang dan mulai analisis proyek Anda'}
          </Text>
        </VStack>

        <Tabs.Root
          value={tabIndex.toString()}
          onValueChange={(e) => handleTabChange(parseInt(e.value))}
          w="full"
          colorScheme="brand"
        >
          <Tabs.List>
            <Tabs.Trigger value="0" flex={1} textAlign="center">Masuk</Tabs.Trigger>
            <Tabs.Trigger value="1" flex={1} textAlign="center">Daftar</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="0" px={0} pt={4}>
            <LoginForm />
          </Tabs.Content>
          <Tabs.Content value="1" px={0} pt={4}>
            <RegisterForm />
          </Tabs.Content>
        </Tabs.Root>
      </VStack>
    </Container>
  );
}

