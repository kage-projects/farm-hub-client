import { Switch as ChakraSwitch } from '@chakra-ui/react';
import { forwardRef } from 'react';

/**
 * Switch component props
 */
export interface SwitchProps extends React.ComponentProps<typeof ChakraSwitch> {
  /** Color scheme */
  colorScheme?: 'brand' | 'secondary' | 'accent';
}

/**
 * Switch component (toggle)
 * - Checked color follows colorScheme
 * - Focus-visible ring for keyboard navigation
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ colorScheme = 'brand', ...props }, ref) => {
    const colorPalette = colorScheme;

    return (
      <ChakraSwitch
        ref={ref}
        colorPalette={colorPalette}
        css={{
          '& [data-scope="switch"][data-part="control"]': {
            backgroundColor: 'var(--chakra-colors-gray-300)',
          },
          '& [data-scope="switch"][data-part="control"][data-checked]': {
            backgroundColor: `var(--chakra-colors-${colorPalette}-600)`,
          },
          '& [data-scope="switch"][data-part="control"]:focus-visible': {
            boxShadow: '0 0 0 3px rgba(43, 96, 30, 0.35)',
            outline: 'none',
          },
          '& [data-scope="switch"][data-part="control"][data-disabled]': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
        }}
        {...props}
      />
    );
  }
);

Switch.displayName = 'Switch';

