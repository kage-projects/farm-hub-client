/**
 * Auth Page - Main authentication page with login/register tabs
 */

import { useState } from 'react';
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

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    // Update URL without navigation
    const newPath = index === 0 ? '/login' : '/register';
    window.history.replaceState({}, '', newPath);
  };

  return (
    <Container maxW="md" py={20}>
      <VStack gap={8}>
        <HStack w="full" justify="flex-start" align="center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            size="md"
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

        <VStack gap={2} textAlign="center">
          <Heading size="2xl" color={textPrimary}>
            {tabIndex === 0 ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
          </Heading>
          <Text fontSize="md" color={textSecondary}>
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
            <Tabs.Trigger value="0" flex={1}>Masuk</Tabs.Trigger>
            <Tabs.Trigger value="1" flex={1}>Daftar</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="0" px={0} pt={6}>
            <LoginForm />
          </Tabs.Content>
          <Tabs.Content value="1" px={0} pt={6}>
            <RegisterForm />
          </Tabs.Content>
        </Tabs.Root>
      </VStack>
    </Container>
  );
}

