import { HStack, VStack, Text } from '@chakra-ui/react';
import { Select } from '../forms/Select';
import { Button } from '../button/Button';
import { useColorModeValue } from '../ui/color-mode';
import type { SupplierData } from '../../data/mockSuppliers';

export type SortOption = 'score' | 'distance' | 'price' | 'rating';
export type FilterOption = SupplierData['category'] | 'all';

export interface SupplierFiltersProps {
  categoryFilter: FilterOption;
  onCategoryChange: (category: FilterOption) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showSort?: boolean;
}

const categoryOptions = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'bibit', label: 'Bibit Ikan' },
  { value: 'pakan', label: 'Pakan' },
  { value: 'obat', label: 'Obat' },
  { value: 'logistik', label: 'Peralatan' },
];

const sortOptions = [
  { value: 'score', label: 'Score Tertinggi' },
  { value: 'distance', label: 'Jarak Terdekat' },
  { value: 'price', label: 'Harga Terendah' },
  { value: 'rating', label: 'Rating Tertinggi' },
];

/**
 * Supplier Filters Component
 * - Filter by category
 * - Sort options
 */
export function SupplierFilters({
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  showSort = true,
}: SupplierFiltersProps) {
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  return (
    <VStack align="stretch" gap={4}>
      <HStack gap={4} flexWrap="wrap" align="end">
        <VStack align="start" gap={1} flex={{ base: 1, md: 'initial' }} minW={{ base: 'full', md: '200px' }}>
          <Text fontSize="sm" fontWeight="medium" color={textSecondary}>
            Kategori
          </Text>
          <Select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value as FilterOption)}
            items={categoryOptions}
          />
        </VStack>

        {showSort && (
          <VStack align="start" gap={1} flex={{ base: 1, md: 'initial' }} minW={{ base: 'full', md: '200px' }}>
            <Text fontSize="sm" fontWeight="medium" color={textSecondary}>
              Urutkan
            </Text>
            <Select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              items={sortOptions}
            />
          </VStack>
        )}
      </HStack>
    </VStack>
  );
}

