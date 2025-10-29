import { Checkbox as ChakraCheckbox } from '@chakra-ui/react';
import { forwardRef } from 'react';

/**
 * Checkbox component props
 */
export interface CheckboxProps extends React.ComponentProps<typeof ChakraCheckbox> {
  /** Color scheme */
  colorScheme?: 'brand' | 'secondary' | 'accent';
}

/**
 * Checkbox component with focus ring
 * - Checked color follows colorScheme
 * - Focus-visible ring for keyboard navigation
 * - Supports indeterminate state
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ colorScheme = 'brand', ...props }, ref) => {
    const colorPalette = colorScheme;

    return (
      <ChakraCheckbox
        ref={ref}
        colorPalette={colorPalette}
        css={{
          '& [data-scope="checkbox"][data-part="control"]': {
            borderColor: 'var(--chakra-colors-gray-400)',
          },
          '& [data-scope="checkbox"][data-part="control"][data-checked]': {
            backgroundColor: `var(--chakra-colors-${colorPalette}-600)`,
            borderColor: `var(--chakra-colors-${colorPalette}-600)`,
          },
          '& [data-scope="checkbox"][data-part="control"]:focus-visible': {
            boxShadow: '0 0 0 3px rgba(43, 96, 30, 0.35)',
            outline: 'none',
          },
          '& [data-scope="checkbox"][data-part="control"][data-disabled]': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
        }}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';

