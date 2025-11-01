import { Box } from '@chakra-ui/react';
import { forwardRef } from 'react';

/**
 * Tag/Badge variants
 */
export type TagVariant = 'solid' | 'subtle' | 'outline';

/**
 * Tag/Badge color schemes
 */
export type TagColorScheme = 'brand' | 'secondary' | 'accent' | 'neutral' | 'success' | 'info' | 'warning' | 'error';

/**
 * Tag/Badge sizes
 */
export type TagSize = 'sm' | 'md' | 'lg';

/**
 * Tag component props
 */
export interface TagProps extends Omit<React.ComponentProps<typeof Box>, 'size'> {
  /** Visual style variant */
  variant?: TagVariant;
  /** Color scheme */
  colorScheme?: TagColorScheme;
  /** Tag size */
  size?: TagSize;
  /** Tag content */
  children: React.ReactNode;
}

/**
 * Tag/Badge component with typed variants
 * - Variants: solid, subtle, outline
 * - Color schemes: brand, secondary, accent, neutral, status colors
 * - Sizes: sm, md, lg
 */
export const Tag = forwardRef<HTMLDivElement, TagProps>(
  ({ variant = 'subtle', colorScheme = 'brand', size = 'md', children, ...props }, ref) => {
    // Map status colors
    const colorMap: Record<string, string> = {
      success: 'brand',
      info: 'secondary',
      warning: 'accent',
      error: 'red',
      neutral: 'gray',
    };

    const actualColor = colorMap[colorScheme] || colorScheme;

    // Size styles
    const sizeStyles = {
      sm: { px: 2, py: 0.5, fontSize: 'xs', fontWeight: 600 },
      md: { px: 2.5, py: 1, fontSize: 'sm', fontWeight: 600 },
      lg: { px: 3, py: 1.5, fontSize: 'md', fontWeight: 600 },
    };

    // Variant styles
    const getVariantStyles = () => {
      switch (variant) {
        case 'solid':
          return {
            bg: `${actualColor}.600`,
            color: 'white',
          };
        case 'subtle':
          return {
            bg: `${actualColor}.50`,
            color: `${actualColor}.700`,
          };
        case 'outline':
          return {
            color: `${actualColor}.700`,
            border: '1px solid',
            borderColor: `${actualColor}.600`,
            bg: 'transparent',
          };
        default:
          return {};
      }
    };

    return (
      <Box
        ref={ref}
        display="inline-flex"
        alignItems="center"
        rounded="md"
        textTransform="none"
        {...sizeStyles[size]}
        {...getVariantStyles()}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

Tag.displayName = 'Tag';

/**
 * Badge alias for Tag component
 */
export const Badge = Tag;

