import { Container, VStack, HStack, Heading, Text, SimpleGrid, Box, Alert } from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { useColorModeValue } from '../components/ui/color-mode';
import { SupplierCard } from '../components/supplier/SupplierCard';
import { SupplierFilters, type FilterOption, type SortOption } from '../components/supplier/SupplierFilters';
import { mockSuppliers } from '../data/mockSuppliers';
import { calculateAllScores, sortByScore, filterByCategory } from '../utils/supplier/scoring';
import type { SupplierData } from '../data/mockSuppliers';
import { FiSearch, FiInfo, FiArrowRight } from 'react-icons/fi';
import { Card, CardBody } from '../components/surfaces/Card';
import { Button } from '../components/button/Button';

/**
 * Suppliers Page - Directory dengan scoring & badges
 */
export function SuppliersPage() {
  const navigate = useNavigate();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const [categoryFilter, setCategoryFilter] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('score');

  // Calculate scores for all suppliers
  const scores = useMemo(() => calculateAllScores(mockSuppliers), []);

  // Filter and sort suppliers
  const filteredSuppliers = useMemo(() => {
    let filtered = filterByCategory(mockSuppliers, categoryFilter);

    // Sort
    if (sortBy === 'score') {
      filtered = sortByScore(filtered, scores);
    } else if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price') {
      filtered = [...filtered].sort((a, b) => a.priceRange.min - b.priceRange.min);
    } else if (sortBy === 'distance') {
      // Mock distance calculation (in real app, calculate from user location)
      filtered = [...filtered].sort((a, b) => {
        // Simple mock: use ID to simulate distance
        const distanceA = parseInt(a.id.replace('s', '')) * 2;
        const distanceB = parseInt(b.id.replace('s', '')) * 2;
        return distanceA - distanceB;
      });
    }

    return filtered;
  }, [categoryFilter, sortBy, scores]);

  const handleSelectSupplier = (supplierId: string) => {
    // Find supplier data
    const supplier = filteredSuppliers.find((s) => s.id === supplierId);
    if (!supplier) return;

    // Navigate to RFQ page with supplier pre-selected
    navigate('/rfq', {
      state: {
        prefillData: {
          supplierId: supplier.id,
          itemCategory: supplier.category === 'bibit' ? 'benih' : 
                       supplier.category === 'pakan' ? 'pakan' : 
                       'peralatan',
        },
        source: 'supplier-page',
      },
    });
  };

  // Mock distance calculation
  const getDistance = (supplier: SupplierData): number => {
    // In real app, calculate from user location
    return parseInt(supplier.id.replace('s', '')) * 2;
  };

  return (
    <>
      <Navbar
        brandName="FarmHub Analytics"
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Supplier', href: '/suppliers' },
        ]}
        cta={{ label: 'Dashboard', href: '/dashboard' }}
      />
      <Container maxW="7xl" py={8}>
        <VStack gap={6} align="stretch">
          {/* Header */}
          <VStack align="start" gap={2}>
            <Heading fontSize="2xl" fontWeight="bold" color={textPrimary}>
              Supplier Directory
            </Heading>
            <Text fontSize="md" color={textSecondary}>
              Temukan supplier terpercaya dengan skor dan badge terverifikasi
            </Text>
          </VStack>

          {/* Info Box: Perbedaan dengan Supplier Recommendation */}
          <Card variant="elevated">
            <CardBody>
              <VStack align="start" gap={3}>
                <HStack gap={2}>
                  <FiInfo size={18} color={useColorModeValue('blue.600', 'blue.300')} />
                  <Heading fontSize="sm" fontWeight="semibold" color={textPrimary}>
                    Tentang Supplier Directory
                  </Heading>
                </HStack>
                <Text fontSize="sm" color={textSecondary}>
                  Halaman ini menampilkan <strong>directory umum</strong> semua supplier yang tersedia. 
                  Gunakan untuk browsing, membandingkan, dan membuat RFQ manual.
                </Text>
                <Text fontSize="sm" color={textSecondary}>
                  <strong>Berbeda dengan Rekomendasi Supplier</strong> yang muncul di halaman Plan Detail. 
                  Rekomendasi di Plan Detail adalah supplier yang <strong>disesuaikan dengan kebutuhan proyek spesifik</strong> Anda.
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  rightIcon={<FiArrowRight />}
                >
                  Lihat Dashboard untuk melihat rekomendasi kontekstual
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Filters */}
          <SupplierFilters
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Results Count */}
          <HStack justify="space-between">
            <Text fontSize="sm" color={textSecondary}>
              Menampilkan <Text as="span" fontWeight="semibold">{filteredSuppliers.length}</Text> supplier
            </Text>
          </HStack>

          {/* Supplier Grid */}
          {filteredSuppliers.length === 0 ? (
            <Box textAlign="center" py={12}>
              <Text fontSize="lg" color={textSecondary}>
                Tidak ada supplier ditemukan
              </Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
              {filteredSuppliers.map((supplier) => {
                const score = scores.get(supplier.id);
                if (!score) return null;
                
                return (
                  <SupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    score={score}
                    distance={getDistance(supplier)}
                    onSelect={handleSelectSupplier}
                  />
                );
              })}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </>
  );
}

