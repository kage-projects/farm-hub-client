import { RadioGroup, Box } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { useColorModeValue } from '../ui/color-mode';

/**
 * Radio component props - compatible with standalone Radio usage
 */
export interface RadioProps {
  /** Color scheme */
  colorScheme?: 'brand' | 'secondary' | 'accent';
  /** Checked state (for standalone usage) */
  checked?: boolean;
  /** Value */
  value?: string;
  /** Name for form grouping */
  name?: string;
  /** onChange handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Children content */
  children?: React.ReactNode;
}

/**
 * Radio component - standalone Radio dengan native input
 * Untuk penggunaan di dalam RadioGroup.Root, gunakan RadioGroup.Item langsung
 * - Checked color follows colorScheme
 * - Focus-visible ring for keyboard navigation
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ colorScheme = 'brand', checked, value, name, onChange, disabled, children, ...props }, ref) => {
    const colorPalette = colorScheme;
    const checkedColor = useColorModeValue(
      colorPalette === 'brand' ? '#25521a' : colorPalette === 'secondary' ? '#183d50' : '#be8900',
      colorPalette === 'brand' ? '#8fb887' : colorPalette === 'secondary' ? '#7eb6c8' : '#ffc966'
    );
    const ringColor = useColorModeValue(
      colorPalette === 'brand' ? 'rgba(43, 96, 30, 0.35)' : colorPalette === 'secondary' ? 'rgba(24, 61, 80, 0.35)' : 'rgba(190, 137, 0, 0.35)',
      colorPalette === 'brand' ? 'rgba(143, 184, 135, 0.35)' : colorPalette === 'secondary' ? 'rgba(126, 182, 200, 0.35)' : 'rgba(255, 201, 102, 0.35)'
    );

    return (
      <Box position="relative" display="inline-flex" alignItems="center" gap={2}>
        <Box
          as="input"
          ref={ref}
          type="radio"
          checked={checked}
          value={value}
          name={name}
          onChange={onChange}
          disabled={disabled}
          position="absolute"
          opacity={0}
          width={0}
          height={0}
          {...props}
        />
        <Box
          as="span"
          w={4}
          h={4}
          borderRadius="full"
          border="2px solid"
          borderColor={checked ? checkedColor : 'gray.400'}
          bg={checked ? checkedColor : 'transparent'}
          position="relative"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          cursor={disabled ? 'not-allowed' : 'pointer'}
          opacity={disabled ? 0.6 : 1}
          _before={{
            content: '""',
            w: checked ? '8px' : '0',
            h: checked ? '8px' : '0',
            borderRadius: 'full',
            bg: 'white',
            transition: 'all 0.2s',
          }}
          _focusVisible={{
            boxShadow: `0 0 0 3px ${ringColor}`,
            outline: 'none',
          }}
          css={{
            '[type="radio"]:focus-visible + &': {
              boxShadow: `0 0 0 3px ${ringColor}`,
              outline: 'none',
            },
          }}
        />
        {children && <Box>{children}</Box>}
      </Box>
    );
  }
);

Radio.displayName = 'Radio';

/**
 * RadioGroup component - re-export from Chakra UI v3
 */
export { RadioGroup };

