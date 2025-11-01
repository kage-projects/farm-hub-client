import { IconButton as ChakraIconButton } from '@chakra-ui/react';
import { forwardRef } from 'react';

/**
 * IconButton component props
 */
export interface IconButtonProps extends React.ComponentProps<typeof ChakraIconButton> {
  /** Color scheme */
  colorScheme?: 'brand' | 'secondary' | 'accent';
  /** Variant */
  variant?: 'solid' | 'outline' | 'ghost';
}

/**
 * IconButton component
 * - Wrapper around Chakra UI IconButton
 * - Consistent styling
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ colorScheme = 'brand', variant = 'ghost', ...props }, ref) => {
    return (
      <ChakraIconButton
        ref={ref}
        colorPalette={colorScheme}
        variant={variant}
        {...props}
      />
    );
  }
);

IconButton.displayName = 'IconButton';


