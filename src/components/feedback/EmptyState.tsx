import { VStack, Heading, Text, Box } from '@chakra-ui/react';
import { Button } from '../button/Button';
import { useColorModeValue } from '../ui/color-mode';

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
  const iconColor = useColorModeValue('gray.400', 'gray.500');
  const titleColor = useColorModeValue('gray.800', 'gray.100');
  const descColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <VStack gap={4} py={12} textAlign="center" maxW="md" mx="auto">
      {/* Icon */}
      {icon && (
        <Box fontSize="5xl" color={iconColor}>
          {icon}
        </Box>
      )}

      {/* Title */}
      <Heading size="lg" color={titleColor}>
        {title}
      </Heading>

      {/* Description */}
      {description && (
        <Text color={descColor} fontSize="md">
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

