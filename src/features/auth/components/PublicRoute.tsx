/**
 * Public Route Component
 * Hanya bisa diakses oleh user yang belum login
 * Jika sudah login, redirect ke dashboard
 */

import { Navigate } from 'react-router-dom';
import { Box, VStack, Text } from '@chakra-ui/react';
import { Spinner } from '../../../components/feedback/Spinner';
import { useAuth } from '../../../hooks/useAuth';
import { useColorModeValue } from '../../../components/ui/color-mode';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text color={textSecondary}>Memuat...</Text>
        </VStack>
      </Box>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render public content
  return <>{children}</>;
}

