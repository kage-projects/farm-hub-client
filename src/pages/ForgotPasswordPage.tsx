import { Container, VStack, HStack, Heading, Text, Box } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Button } from '../components/button/Button';
import { FormInput } from '../components/forms/FormInput';
import { Card, CardBody, CardHeader } from '../components/surfaces/Card';
import { useColorModeValue } from '../components/ui/color-mode';
import { Alert } from '../components/feedback/Alert';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

/**
 * Forgot Password Page
 */
export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // TODO: Implement forgot password API call
      // await authApi.forgotPassword(email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim email reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[{ label: 'Beranda', href: '/' }]}
        cta={{ label: 'Masuk', href: '/login' }}
      />
      <Container maxW="md" py={8}>
        <VStack gap={6} align="stretch">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
            colorScheme="brand"
          >
            <HStack gap={2}>
              <FiArrowLeft />
              <Text>Kembali ke Login</Text>
            </HStack>
          </Button>

          <Card variant="elevated" p={5}>
            <CardHeader>
              <HStack gap={3}>
                <Box
                  p={2}
                  borderRadius="lg"
                  bg={useColorModeValue('brand.100', 'brand.900')}
                >
                  <FiMail size={20} color={useColorModeValue('brand.600', 'brand.400')} />
                </Box>
                <VStack align="start" gap={0}>
                  <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
                    Lupa Password?
                  </Heading>
                  <Text fontSize="sm" color={textSecondary}>
                    Masukkan email Anda untuk reset password
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody>
              {success ? (
                <VStack gap={4}>
                  <Alert
                    status="success"
                    variant="subtle"
                    title="Email terkirim!"
                    description="Silakan cek email Anda untuk instruksi reset password. Jika tidak ada, cek folder spam."
                  />
                  <Button
                    variant="solid"
                    colorScheme="brand"
                    w="full"
                    onClick={() => navigate('/login')}
                  >
                    Kembali ke Login
                  </Button>
                </VStack>
              ) : (
                <form onSubmit={handleSubmit}>
                  <VStack gap={4} align="stretch">
                    {error && (
                      <Alert
                        status="error"
                        variant="subtle"
                        title={error}
                      />
                    )}

                    <FormInput
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="nama@email.com"
                      disabled={isLoading}
                    />

                    <Button
                      type="submit"
                      variant="solid"
                      colorScheme="brand"
                      size="lg"
                      w="full"
                      loading={isLoading}
                      disabled={isLoading || !email}
                    >
                      Kirim Link Reset Password
                    </Button>

                    <HStack justify="center" gap={1}>
                      <Text fontSize="sm" color={textSecondary}>
                        Ingat password?
                      </Text>
                      <Link to="/login">
                        <Text fontSize="sm" color="brand.600" fontWeight="semibold">
                          Masuk
                        </Text>
                      </Link>
                    </HStack>
                  </VStack>
                </form>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </>
  );
}

