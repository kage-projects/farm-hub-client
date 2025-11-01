/**
 * Login Form Component
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VStack, HStack, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FormInput } from '../../../components/forms/FormInput';
import { Button } from '../../../components/button/Button';
import { Checkbox } from '../../../components/forms/Checkbox';
import { Card, CardBody, CardHeader } from '../../../components/surfaces/Card';
import { useColorModeValue } from '../../../components/ui/color-mode';
import { useAuth } from '../../../hooks/useAuth';
import type { LoginCredentials } from '../types/auth';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, error, clearError, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const credentials: LoginCredentials = {
      email,
      password,
      rememberMe,
    };

    const result = await login(credentials);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <Card variant="elevated" w="full">
      <CardHeader>
        <Heading size="lg" color={textPrimary}>
          Login
        </Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            {error && (
              <Text fontSize="sm" color="red.500">
                {error}
              </Text>
            )}

            <FormInput
              label="Email atau Username"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nama@email.com"
              disabled={isLoading}
            />

            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={isLoading}
            />

            <HStack justify="space-between">
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              >
                <Text fontSize="sm" color={textSecondary}>
                  Ingat saya
                </Text>
              </Checkbox>
              <ChakraLink as={Link} to="/forgot-password" fontSize="sm" color="brand.600">
                Lupa password?
              </ChakraLink>
            </HStack>

            <Button
              type="submit"
              variant="solid"
              colorScheme="brand"
              size="lg"
              w="full"
              loading={isLoading}
              disabled={isLoading || !email || !password}
            >
              Masuk
            </Button>

            <HStack justify="center" gap={1}>
              <Text fontSize="sm" color={textSecondary}>
                Belum punya akun?
              </Text>
              <ChakraLink as={Link} to="/register" fontSize="sm" color="brand.600" fontWeight="semibold">
                Daftar sekarang
              </ChakraLink>
            </HStack>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
}

