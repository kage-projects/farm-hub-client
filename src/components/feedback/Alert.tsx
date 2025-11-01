import { Flex, Box, VStack, Text } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';

/**
 * Alert status types
 */
export type AlertStatus = 'success' | 'info' | 'warning' | 'error';

/**
 * Alert variants
 */
export type AlertVariant = 'subtle' | 'solid' | 'left-accent';

/**
 * Alert component props
 */
export interface AlertProps {
  /** Alert status/intent */
  status: AlertStatus;
  /** Visual variant */
  variant?: AlertVariant;
  /** Alert title */
  title?: string;
  /** Alert description/message */
  description?: string;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Children content */
  children?: React.ReactNode;
}

/**
 * Alert component for feedback messages
 * - Status: success, info, warning, error
 * - Variants: subtle, solid, left-accent
 * - Uses semantic color mapping
 */
export const Alert = ({
  status,
  variant = 'subtle',
  title,
  description,
  icon,
  children,
}: AlertProps) => {
  // Map status to color scheme
  const colorMap: Record<AlertStatus, string> = {
    success: 'brand',
    info: 'secondary',
    warning: 'accent',
    error: 'red',
  };

  // Default icons
  const iconMap: Record<AlertStatus, string> = {
    success: '✓',
    info: 'ℹ',
    warning: '⚠',
    error: '✕',
  };

  const color = colorMap[status];
  const defaultIcon = iconMap[status];

  // Variant styles with glassmorphism
  const getVariantStyles = () => {
    const glassBg = useColorModeValue(
      `rgba(255, 255, 255, 0.7)`,
      `rgba(55, 85, 165, 0.65)`
    );
    const solidBg = useColorModeValue(`${color}.600`, `${color}.500`);
    const textColor = useColorModeValue(`${color}.900`, `${color}.100`);
    const iconColor = useColorModeValue(`${color}.600`, `${color}.400`);
    const borderColor = useColorModeValue(`${color}.400`, `${color}.500`);

    switch (variant) {
      case 'subtle':
        return {
          bg: glassBg,
          color: textColor,
          iconColor: iconColor,
          border: '1px solid',
          borderColor: useColorModeValue(`${color}.200`, `${color}.700`),
          backdropFilter: 'blur(16px) saturate(180%)',
        };
      case 'solid':
        return {
          bg: solidBg,
          color: 'white',
          iconColor: 'white',
          border: 'none',
        };
      case 'left-accent':
        return {
          bg: glassBg,
          color: textColor,
          iconColor: iconColor,
          borderLeft: '4px solid',
          borderColor: borderColor,
          backdropFilter: 'blur(16px) saturate(180%)',
        };
      default:
        return {};
    }
  };

  const styles = getVariantStyles();

  return (
    <Flex
      p={4}
      rounded="xl"
      align="flex-start"
      gap={3}
      bg={styles.bg}
      color={styles.color}
      borderLeft={styles.borderLeft}
      borderColor={styles.borderColor}
      border={styles.border}
      backdropFilter={styles.backdropFilter}
      css={{
        WebkitBackdropFilter: styles.backdropFilter,
      }}
      role="alert"
      transition="all 0.3s"
      _hover={{
        transform: variant === 'solid' ? 'none' : 'translateY(-1px)',
        boxShadow: useColorModeValue(
          '0 4px 20px -8px rgba(0, 0, 0, 0.15)',
          '0 4px 20px -8px rgba(0, 0, 0, 0.4)'
        ),
      }}
    >
      {/* Icon */}
      <Box color={styles.iconColor} fontSize="xl" lineHeight="1">
        {icon || defaultIcon}
      </Box>

      {/* Content */}
      <VStack align="stretch" gap={1} flex={1}>
        {title && (
          <Text fontWeight="600" fontSize="md">
            {title}
          </Text>
        )}
        {description && (
          <Text fontSize="sm" color={variant === 'solid' ? 'white' : `${color}.700`}>
            {description}
          </Text>
        )}
        {children}
      </VStack>
    </Flex>
  );
};

