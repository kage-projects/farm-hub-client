import { Box, VStack } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { useColorModeValue } from '../ui/color-mode';

/**
 * Card variant types
 */
export type CardVariant = 'glass' | 'elevated';

/**
 * Card component props
 */
export interface CardProps extends React.ComponentProps<typeof Box> {
  /** Card variant */
  variant?: CardVariant;
}

/**
 * Card component with glassmorphism effect
 * - Glass variant: transparent with blur effect
 * - Elevated variant: strong shadow with glass
 * - Clean and modern design
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'glass', children, ...props }, ref) => {
    const glassBg = useColorModeValue(
      'rgba(255, 255, 255, 0.65)',
      'rgba(30, 58, 138, 0.4)'
    );
    const elevatedBg = useColorModeValue(
      'rgba(255, 255, 255, 0.85)',
      'rgba(30, 58, 138, 0.6)'
    );
    const borderColor = useColorModeValue(
      'rgba(6, 182, 212, 0.2)',
      'rgba(34, 211, 238, 0.2)'
    );

    const variantStyles = {
      glass: {
        bg: glassBg,
        border: '1px solid',
        borderColor,
        boxShadow: useColorModeValue(
          '0 4px 24px -8px rgba(0, 0, 0, 0.08)',
          '0 4px 24px -8px rgba(0, 0, 0, 0.4)'
        ),
        backdropFilter: 'blur(24px) saturate(180%)',
        css: {
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        },
      },
      elevated: {
        bg: elevatedBg,
        border: '1px solid',
        borderColor,
        boxShadow: useColorModeValue(
          '0 10px 40px -15px rgba(0, 0, 0, 0.12)',
          '0 10px 40px -15px rgba(0, 0, 0, 0.5)'
        ),
        backdropFilter: 'blur(24px) saturate(180%)',
        css: {
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        },
      },
    };

    return (
      <Box
        ref={ref}
        rounded="2xl"
        p={6}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: useColorModeValue(
            '0 12px 48px -12px rgba(0, 0, 0, 0.15)',
            '0 12px 48px -12px rgba(0, 0, 0, 0.6)'
          ),
        }}
        {...variantStyles[variant]}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header component
 */
export const CardHeader = ({ children, ...props }: React.ComponentProps<typeof Box>) => {
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  
  return (
    <Box mb={4} pb={3} borderBottom="1px solid" borderColor={borderColor} {...props}>
      {children}
    </Box>
  );
};

/**
 * Card Body component
 */
export const CardBody = ({ children, ...props }: React.ComponentProps<typeof VStack>) => (
  <VStack align="stretch" gap={3} {...props}>
    {children}
  </VStack>
);

/**
 * Card Footer component
 */
export const CardFooter = ({ children, ...props }: React.ComponentProps<typeof Box>) => {
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  
  return (
    <Box mt={4} pt={3} borderTop="1px solid" borderColor={borderColor} {...props}>
      {children}
    </Box>
  );
};

