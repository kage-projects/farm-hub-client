import { Box, VStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface WizardStepProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

/**
 * Base component for wizard steps
 * - Consistent layout
 * - Title and description support
 */
export function WizardStep({ children, title, description }: WizardStepProps) {
  return (
    <VStack align="stretch" gap={4} w="full">
      {title && (
        <Box>
          <Box fontSize="lg" fontWeight="semibold" mb={1}>
            {title}
          </Box>
          {description && (
            <Box fontSize="sm" color="gray.600">
              {description}
            </Box>
          )}
        </Box>
      )}
      {children}
    </VStack>
  );
}

