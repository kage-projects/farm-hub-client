/**
 * Register Form Component
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
import type { RegisterData } from '../types/auth';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register, error, clearError, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!agreeTerms) {
      return;
    }

    const registerData: RegisterData = {
      ...formData,
      agreeTerms,
    };

    const result = await register(registerData);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const passwordMatch = formData.password === formData.confirmPassword || !formData.confirmPassword;

  return (
    <Card variant="elevated" w="full" p={5}>
      <CardHeader mb={3} pb={2}>
        <Heading size="md" color={textPrimary}>
          Pendaftaran
        </Heading>
      </CardHeader>
      <CardBody gap={3}>
        <form onSubmit={handleSubmit}>
          <VStack gap={3} align="stretch">
            {error && (
              <Text fontSize="sm" color="red.500">
                {error}
              </Text>
            )}

            {!passwordMatch && formData.confirmPassword && (
              <Text fontSize="sm" color="red.500">
                Password tidak cocok!
              </Text>
            )}

            <FormInput
              label="Nama Lengkap"
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              required
              placeholder="Nama lengkap Anda"
              disabled={isLoading}
            />

            <FormInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
              placeholder="nama@email.com"
              disabled={isLoading}
            />

            <FormInput
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              required
              placeholder="Minimal 8 karakter"
              helperText="Minimal 8 karakter, kombinasi huruf dan angka"
              disabled={isLoading}
            />

            <FormInput
              label="Konfirmasi Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              required
              placeholder="Ulangi password"
              invalid={!passwordMatch && !!formData.confirmPassword}
              disabled={isLoading}
            />

            <Checkbox
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
              disabled={isLoading}
            >
              <Text fontSize="sm" color={textSecondary}>
                Saya menyetujui{' '}
                <ChakraLink color="brand.600" href="#terms">
                  Syarat & Ketentuan
                </ChakraLink>{' '}
                dan{' '}
                <ChakraLink color="brand.600" href="#privacy">
                  Kebijakan Privasi
                </ChakraLink>
              </Text>
            </Checkbox>

            <Button
              type="submit"
              variant="solid"
              colorScheme="brand"
              size="lg"
              w="full"
              loading={isLoading}
              disabled={
                isLoading ||
                !formData.name ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword ||
                !passwordMatch ||
                !agreeTerms
              }
            >
              Daftar
            </Button>

            <HStack justify="center" gap={1}>
              <Text fontSize="sm" color={textSecondary}>
                Sudah punya akun?
              </Text>
              <ChakraLink as={Link} to="/login" fontSize="sm" color="brand.600" fontWeight="semibold">
                Masuk
              </ChakraLink>
            </HStack>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
}

