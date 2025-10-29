import { Button as ChakraButton, Spinner } from '@chakra-ui/react';
import { forwardRef } from 'react';

/**
 * Button variants
 */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';

/**
 * Button color schemes (intents)
 */
export type ButtonColorScheme = 'brand' | 'secondary' | 'accent' | 'destructive';

/**
 * Button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button component props
 */
export interface ButtonProps extends Omit<React.ComponentProps<typeof ChakraButton>, 'variant' | 'colorScheme' | 'size'> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Color scheme / intent */
  colorScheme?: ButtonColorScheme;
  /** Button size */
  size?: ButtonSize;
  /** Loading state */
  loading?: boolean;
  /** Loading text to show */
  loadingText?: string;
}

/**
 * Custom Button wrapper around Chakra UI Button
 * - Typed variants: solid, outline, ghost, link
 * - Intents: brand, secondary, accent, destructive
 * - Sizes: sm, md, lg
 * - Proper contrast ratios (WCAG AA)
 * - Loading state with spinner
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      colorScheme = 'brand',
      size = 'md',
      loading = false,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Map our colorScheme to Chakra's colorPalette
    const colorPalette = colorScheme === 'destructive' ? 'red' : colorScheme;

    return (
      <ChakraButton
        ref={ref}
        variant={variant}
        colorPalette={colorPalette}
        size={size}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Spinner
            size={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'}
            mr={loadingText || children ? 2 : 0}
          />
        )}
        {loading && loadingText ? loadingText : children}
      </ChakraButton>
    );
  }
);

Button.displayName = 'Button';

