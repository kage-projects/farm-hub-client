import { Box, HStack } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { useColorModeValue } from '../ui/color-mode';

export interface SliderProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorScheme?: 'brand' | 'secondary' | 'accent';
}

/**
 * Custom Slider component (range input)
 * - Styled range input
 * - Focus ring support
 * - Color scheme support
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ value, min, max, step = 1, onChange, colorScheme = 'brand', ...props }, ref) => {
    const trackColor = useColorModeValue(
      colorScheme === 'brand' ? 'brand.200' : colorScheme === 'secondary' ? 'secondary.200' : 'accent.200',
      colorScheme === 'brand' ? 'brand.700' : colorScheme === 'secondary' ? 'secondary.700' : 'accent.700'
    );
    const thumbColor = useColorModeValue(
      colorScheme === 'brand' ? 'brand.600' : colorScheme === 'secondary' ? 'secondary.600' : 'accent.600',
      colorScheme === 'brand' ? 'brand.400' : colorScheme === 'secondary' ? 'secondary.400' : 'accent.400'
    );
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <Box position="relative" w="full">
        <Box
          as="input"
          ref={ref}
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={onChange}
          css={{
            width: '100%',
            height: '6px',
            borderRadius: 'full',
            background: useColorModeValue('#e2e8f0', '#475569'),
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            '&::-webkit-slider-thumb': {
              appearance: 'none',
              WebkitAppearance: 'none',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: thumbColor,
              cursor: 'pointer',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            },
            '&::-moz-range-thumb': {
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: thumbColor,
              cursor: 'pointer',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            },
            '&::-webkit-slider-runnable-track': {
              width: '100%',
              height: '6px',
              borderRadius: 'full',
              background: `linear-gradient(to right, ${trackColor} ${percentage}%, ${useColorModeValue('#e2e8f0', '#475569')} ${percentage}%)`,
            },
            '&::-moz-range-track': {
              width: '100%',
              height: '6px',
              borderRadius: 'full',
              background: useColorModeValue('#e2e8f0', '#475569'),
            },
            '&:focus': {
              outline: 'none',
              '&::-webkit-slider-thumb': {
                boxShadow: `0 0 0 3px ${useColorModeValue('rgba(43, 96, 30, 0.2)', 'rgba(143, 184, 135, 0.2)')}`,
              },
            },
          }}
          {...props}
        />
      </Box>
    );
  }
);

Slider.displayName = 'Slider';

