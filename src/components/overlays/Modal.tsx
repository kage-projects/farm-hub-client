import { Modal as ChakraModal } from '@chakra-ui/react';

/**
 * Modal size options
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Modal component - re-export from Chakra
 * - Rounded corners (xl)
 * - Header with bottom border
 * - Overlay at 70% opacity
 * - Focus trap and keyboard handling
 */
export const Modal = ChakraModal;

