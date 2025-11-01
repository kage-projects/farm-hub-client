import { Container, VStack, HStack, Heading, Text, Box, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FormInput } from '../components/forms/FormInput';
import { Button } from '../components/button/Button';
import { Checkbox } from '../components/forms/Checkbox';
import { Card, CardBody, CardHeader } from '../components/surfaces/Card';
import { useColorModeValue } from '../components/ui/color-mode';
import { useState } from 'react';

/**
 * Register Page
 * - Registration form dengan validasi
 * - Terms & conditions checkbox
 * - Link ke login
 */
export function RegisterPage() {
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic & validation
    if (formData.password !== formData.confirmPassword) {
      alert('Password tidak cocok!');
      return;
    }
    if (!agreeTerms) {
      alert('Anda harus menyetujui syarat & ketentuan');
      return;
    }
    console.log('Register:', formData);
    // Redirect to login
    window.location.href = '/login';
  };

  return (
    <Container maxW="md" py={20}>
      <VStack gap={8}>
        <VStack gap={2} textAlign="center">
          <Heading size="2xl" color={textPrimary}>
            Buat Akun Baru
          </Heading>
          <Text fontSize="md" color={textSecondary}>
            Daftar sekarang dan mulai analisis proyek Anda
          </Text>
        </VStack>

        <Card variant="elevated" w="full">
          <CardHeader>
            <Heading size="lg" color={textPrimary}>
              Pendaftaran
            </Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack gap={4} align="stretch">
                <FormInput
                  label="Nama Lengkap"
                  type="text"
                  value={formData.name}
                  onChange={handleChange('name')}
                  required
                  placeholder="Nama lengkap Anda"
                />

                <FormInput
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  required
                  placeholder="nama@email.com"
                />

                <FormInput
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  required
                  placeholder="Minimal 8 karakter"
                  helperText="Minimal 8 karakter, kombinasi huruf dan angka"
                />

                <FormInput
                  label="Konfirmasi Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  required
                  placeholder="Ulangi password"
                />

                <Checkbox
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
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
      </VStack>
    </Container>
  );
}

