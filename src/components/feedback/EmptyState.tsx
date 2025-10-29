import { VStack, Heading, Text, Box } from '@chakra-ui/react';
import { Button } from '../button/Button';

/**
 * EmptyState component props
 */
export interface EmptyStateProps {
  /** Icon or illustration */
  icon?: React.ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * EmptyState component for no data scenarios
 * - Icon slot for visual feedback
 * - Title and description
 * - Optional action button
 */
export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <VStack gap={4} py={12} textAlign="center" maxW="md" mx="auto">
      {/* Icon */}
      {icon && (
        <Box fontSize="5xl" color="gray.400">
          {icon}
        </Box>
      )}

      {/* Title */}
      <Heading size="lg" color="gray.700">
        {title}
      </Heading>

      {/* Description */}
      {description && (
        <Text color="gray.600" fontSize="md">
          {description}
        </Text>
      )}

      {/* Action Button */}
      {action && (
        <Button colorScheme="brand" onClick={action.onClick} mt={2}>
          {action.label}
        </Button>
      )}
    </VStack>
  );
};

