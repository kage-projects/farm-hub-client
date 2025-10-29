import { Tabs as ChakraTabs } from '@chakra-ui/react';

/**
 * Tabs variant types
 */
export type TabsVariant = 'line' | 'soft-rounded';

/**
 * Tabs component - re-export from Chakra with our variants
 * - Variant 'line': underline style with bottom border
 * - Variant 'soft-rounded': pill-style with rounded background
 * - Selected color uses brand colors
 */
export const Tabs = ChakraTabs;

