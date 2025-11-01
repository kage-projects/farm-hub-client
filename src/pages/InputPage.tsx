import { Container, VStack, HStack, Heading, Text, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Button } from '../components/button/Button';
import { FormInput } from '../components/forms/FormInput';
import { FormCurrencyInput } from '../components/forms/FormCurrencyInput';
import { Select } from '../components/forms/Select';
import { Radio } from '../components/forms/Radio';
import { Card, CardBody, CardHeader } from '../components/surfaces/Card';
import { useColorModeValue } from '../components/ui/color-mode';
import { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

/**
 * Input Page - Halaman input data project
 * - Lokasi (Sumatra Barat)
 * - Jenis ikan
 * - Modal investasi
 * - Tingkatan risiko (3 level)
 */
export function InputPage() {
  const navigate = useNavigate();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const [formData, setFormData] = useState({
    city: '',
    address: '',
    fishType: '',
    capital: 0,
    riskLevel: 'medium' as 'low' | 'medium' | 'high',
  });

  const cities = [
    { value: 'padang', label: 'Padang' },
    { value: 'bukittinggi', label: 'Bukittinggi' },
    { value: 'solok', label: 'Solok' },
    { value: 'payakumbuh', label: 'Payakumbuh' },
    { value: 'padang-panjang', label: 'Padang Panjang' },
    { value: 'sawahlunto', label: 'Sawahlunto' },
  ];

  const fishTypes = [
    { value: 'nila', label: 'Nila' },
    { value: 'lele', label: 'Lele' },
    { value: 'patin', label: 'Patin' },
    { value: 'gurame', label: 'Gurame' },
    { value: 'mas', label: 'Mas' },
    { value: 'other', label: 'Lainnya' },
  ];

  const riskLevels = [
    {
      value: 'low',
      label: 'Rendah',
      description: 'Konservatif, modal kecil, risiko minimal',
    },
    {
      value: 'medium',
      label: 'Sedang',
      description: 'Balance, modal medium, risiko moderate',
    },
    {
      value: 'high',
      label: 'Tinggi',
      description: 'Agresif, modal besar, potensi tinggi',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save form data & generate summary
    console.log('Form submitted:', formData);
    navigate('/summary');
  };

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
              <Heading size="2xl" color={textPrimary}>
                Input Data Project
              </Heading>
              <Text fontSize="md" color={textSecondary}>
                Lengkapi data untuk analisis kelayakan proyek budidaya ikan
              </Text>
            </VStack>
          </HStack>

          <form onSubmit={handleSubmit}>
            <VStack gap={6} align="stretch">
              {/* Lokasi Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Heading size="md" color={textPrimary}>
                    Lokasi & Lingkungan
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack gap={4} align="stretch">
                    <FormInput
                      label="Provinsi"
                      value="Sumatra Barat"
                      disabled
                      helperText="Lokasi proyek harus berada di Sumatra Barat"
                    />

                    <Select
                      label="Kota/Kabupaten"
                      value={formData.city}
                      onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                      required
                      items={cities}
                    />

                    <FormInput
                      label="Alamat Detail"
                      value={formData.address}
                      onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="Masukkan alamat lengkap lokasi proyek"
                      required
                    />
                  </VStack>
                </CardBody>
              </Card>

              {/* Jenis Ikan Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Heading size="md" color={textPrimary}>
                    Jenis Ikan
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack gap={4} align="stretch">
                    <Select
                      label="Pilih Jenis Ikan"
                      value={formData.fishType}
                      onChange={(e) => setFormData((prev) => ({ ...prev, fishType: e.target.value }))}
                      required
                      items={fishTypes}
                    />
                    {formData.fishType === 'other' && (
                      <FormInput
                        label="Jenis Ikan Lainnya"
                        placeholder="Masukkan jenis ikan"
                        required
                      />
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* Modal Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Heading size="md" color={textPrimary}>
                    Modal Investasi
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack gap={4} align="stretch">
                    <FormCurrencyInput
                      label="Total Modal yang Tersedia"
                      value={formData.capital}
                      onChange={(value) => setFormData((prev) => ({ ...prev, capital: value }))}
                      required
                      helperText="Masukkan jumlah modal yang tersedia untuk investasi"
                    />
                  </VStack>
                </CardBody>
              </Card>

              {/* Risiko Section */}
              <Card variant="elevated">
                <CardHeader>
                  <Heading size="md" color={textPrimary}>
                    Tingkatan Risiko
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack gap={4} align="stretch">
                    {riskLevels.map((level) => (
                      <Box
                        key={level.value}
                        p={4}
                        borderRadius="md"
                        border="2px solid"
                        borderColor={
                          formData.riskLevel === level.value
                            ? useColorModeValue('brand.500', 'brand.400')
                            : useColorModeValue('gray.200', 'gray.700')
                        }
                        bg={
                          formData.riskLevel === level.value
                            ? useColorModeValue('brand.50', 'brand.900')
                            : 'transparent'
                        }
                        cursor="pointer"
                        onClick={() => setFormData((prev) => ({ ...prev, riskLevel: level.value as any }))}
                      >
                        <Radio
                          checked={formData.riskLevel === level.value}
                          onChange={() => setFormData((prev) => ({ ...prev, riskLevel: level.value as any }))}
                          name="riskLevel"
                          value={level.value}
                        >
                          <VStack align="start" gap={1} ml={2}>
                            <Text fontWeight="semibold" color={textPrimary}>
                              {level.label}
                            </Text>
                            <Text fontSize="sm" color={textSecondary}>
                              {level.description}
                            </Text>
                          </VStack>
                        </Radio>
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </Card>

              {/* Actions */}
              <HStack gap={4} justify="flex-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="solid"
                  colorScheme="brand"
                >
                  Generate Ringkasan
                </Button>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Container>
    </>
  );
}

