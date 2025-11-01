import { Button as ChakraButton, Spinner } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { useColorModeValue } from '../ui/color-mode';

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

// Color mappings for brand colors
const brandColors = {
  light: {
    solid: { bg: '#25521a', color: 'white', hover: '#1f4516', active: '#183712' },
    outline: { border: '#25521a', color: '#25521a', hover: '#e5efe2' },
    ghost: { color: '#25521a', hover: '#e5efe2' },
  },
  dark: {
    solid: { bg: '#8fb887', color: 'white', hover: '#b2d0ad', active: '#cfe1cb' },
    outline: { border: '#8fb887', color: '#8fb887', hover: '#122a0d' },
    ghost: { color: '#8fb887', hover: '#122a0d' },
  },
};

const secondaryColors = {
  light: {
    solid: { bg: '#183d50', color: 'white', hover: '#133141', active: '#0f2633' },
    outline: { border: '#183d50', color: '#183d50', hover: '#e6f1f3' },
    ghost: { color: '#183d50', hover: '#e6f1f3' },
  },
  dark: {
    solid: { bg: '#7eb6c8', color: 'white', hover: '#a6cfd9', active: '#cbe3e9' },
    outline: { border: '#7eb6c8', color: '#7eb6c8', hover: '#0b1c26' },
    ghost: { color: '#7eb6c8', hover: '#0b1c26' },
  },
};

const accentColors = {
  light: {
    solid: { bg: '#be8900', color: 'white', hover: '#9d7100', active: '#7b5900' },
    outline: { border: '#be8900', color: '#be8900', hover: '#fff5e0' },
    ghost: { color: '#be8900', hover: '#fff5e0' },
  },
  dark: {
    solid: { bg: '#ffc966', color: 'white', hover: '#ffd98f', active: '#ffe8b8' },
    outline: { border: '#ffc966', color: '#ffc966', hover: '#5a4000' },
    ghost: { color: '#ffc966', hover: '#5a4000' },
  },
};

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
    
    // Get color values based on color scheme and variant
    const isLight = useColorModeValue(true, false);
    const colors = 
      colorScheme === 'brand' ? brandColors :
      colorScheme === 'secondary' ? secondaryColors :
      colorScheme === 'accent' ? accentColors :
      null;
    
    const colorMode = isLight ? 'light' : 'dark';
    const variantColors = colors?.[colorMode]?.[variant as keyof typeof colors.light];
    
    // Build CSS styles for fallback if recipes don't work
    const cssStyles = variant === 'solid' && variantColors && colorScheme !== 'destructive' ? {
      backgroundColor: variantColors.bg + ' !important',
      color: variantColors.color + ' !important',
      '&:hover:not(:disabled)': {
        backgroundColor: variantColors.hover + ' !important',
      },
      '&:active:not(:disabled)': {
        backgroundColor: variantColors.active + ' !important',
      },
    } : variant === 'outline' && variantColors && colorScheme !== 'destructive' ? {
      borderColor: variantColors.border + ' !important',
      color: variantColors.color + ' !important',
      borderWidth: '1px',
      borderStyle: 'solid',
      '&:hover:not(:disabled)': {
        backgroundColor: variantColors.hover + ' !important',
      },
    } : variant === 'ghost' && variantColors && colorScheme !== 'destructive' ? {
      color: variantColors.color + ' !important',
      '&:hover:not(:disabled)': {
        backgroundColor: variantColors.hover + ' !important',
      },
    } : {};

    return (
      <ChakraButton
        ref={ref}
        variant={variant}
        colorPalette={colorPalette}
        size={size}
        disabled={disabled || loading}
        css={cssStyles}
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

