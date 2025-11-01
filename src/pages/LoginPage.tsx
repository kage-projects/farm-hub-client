import { Container, VStack, HStack, Heading, Text, Box, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FormInput } from '../components/forms/FormInput';
import { Button } from '../components/button/Button';
import { Checkbox } from '../components/forms/Checkbox';
import { Card, CardBody, CardHeader } from '../components/surfaces/Card';
import { useColorModeValue } from '../components/ui/color-mode';
import { useState } from 'react';

/**
 * Login Page
 * - Email/username & password form
 * - Remember me checkbox
 * - Links ke register & forgot password
 */
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login:', { email, password, rememberMe });
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <Container maxW="md" py={20}>
      <VStack gap={8}>
        <VStack gap={2} textAlign="center">
          <Heading size="2xl" color={textPrimary}>
            Masuk ke Akun Anda
          </Heading>
          <Text fontSize="md" color={textSecondary}>
            Masukkan kredensial Anda untuk melanjutkan
          </Text>
        </VStack>

        <Card variant="elevated" w="full">
          <CardHeader>
            <Heading size="lg" color={textPrimary}>
              Login
            </Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack gap={4} align="stretch">
                <FormInput
                  label="Email atau Username"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nama@email.com"
                />

                <FormInput
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />

                <HStack justify="space-between">
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
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
      </VStack>
    </Container>
  );
}

