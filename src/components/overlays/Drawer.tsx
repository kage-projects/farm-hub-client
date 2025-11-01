import { Drawer as ChakraDrawer } from '@chakra-ui/react';

/**
 * Drawer placement options
 */
export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

/**
 * Drawer component - re-export from Chakra
 * - Side panel overlay
 * - Header with bottom border
 * - Overlay at 70% opacity
 * - Focus trap and keyboard handling
 */
export const Drawer = ChakraDrawer;

