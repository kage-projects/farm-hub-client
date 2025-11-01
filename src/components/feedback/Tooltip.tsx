import { Tooltip as ChakraTooltip } from '@chakra-ui/react';

/**
 * Tooltip placement options
 */
export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/**
 * Tooltip component - re-export from Chakra
 * - Dark background with white text
 * - Arrow enabled by default
 * - Accessible with proper ARIA
 */
export const Tooltip = ChakraTooltip;

