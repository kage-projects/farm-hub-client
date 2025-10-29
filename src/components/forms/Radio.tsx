import { RadioGroup as ChakraRadioGroup, Radio as ChakraRadio } from '@chakra-ui/react';
import { forwardRef } from 'react';

/**
 * Radio component props
 */
export interface RadioProps extends React.ComponentProps<typeof ChakraRadio> {
  /** Color scheme */
  colorScheme?: 'brand' | 'secondary' | 'accent';
}

/**
 * Radio component with focus ring
 * - Checked color follows colorScheme
 * - Focus-visible ring for keyboard navigation
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ colorScheme = 'brand', ...props }, ref) => {
    const colorPalette = colorScheme;

    return (
      <ChakraRadio
        ref={ref}
        colorPalette={colorPalette}
        css={{
          '& [data-scope="radio"][data-part="control"]': {
            borderColor: 'var(--chakra-colors-gray-400)',
          },
          '& [data-scope="radio"][data-part="control"][data-checked]': {
            backgroundColor: `var(--chakra-colors-${colorPalette}-600)`,
            borderColor: `var(--chakra-colors-${colorPalette}-600)`,
          },
          '& [data-scope="radio"][data-part="control"]:focus-visible': {
            boxShadow: '0 0 0 3px rgba(43, 96, 30, 0.35)',
            outline: 'none',
          },
          '& [data-scope="radio"][data-part="control"][data-disabled]': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
        }}
        {...props}
      />
    );
  }
);

Radio.displayName = 'Radio';

/**
 * RadioGroup component
 */
export const RadioGroup = ChakraRadioGroup;

