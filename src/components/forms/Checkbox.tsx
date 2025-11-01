import { Box } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { useColorModeValue } from '../ui/color-mode';

/**
 * Checkbox component props
 */
export interface CheckboxProps {
  /** Color scheme */
  colorScheme?: 'brand' | 'secondary' | 'accent';
  /** Checkbox label/content */
  children?: React.ReactNode;
  /** Checked state */
  checked?: boolean;
  /** Default checked state */
  defaultChecked?: boolean;
  /** onChange handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Indeterminate state */
  indeterminate?: boolean;
}

/**
 * Checkbox component with focus ring
 * - Checked color follows colorScheme
 * - Focus-visible ring for keyboard navigation
 * - Supports indeterminate state
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ colorScheme = 'brand', children, checked, onChange, ...props }, ref) => {
    const colorPalette = colorScheme;
    const checkedColor = useColorModeValue(
      colorPalette === 'brand' ? '#25521a' : colorPalette === 'secondary' ? '#183d50' : '#be8900',
      colorPalette === 'brand' ? '#8fb887' : colorPalette === 'secondary' ? '#7eb6c8' : '#ffc966'
    );
    const ringColor = useColorModeValue(
      colorPalette === 'brand' ? 'rgba(43, 96, 30, 0.35)' : colorPalette === 'secondary' ? 'rgba(24, 61, 80, 0.35)' : 'rgba(190, 137, 0, 0.35)',
      colorPalette === 'brand' ? 'rgba(143, 184, 135, 0.35)' : colorPalette === 'secondary' ? 'rgba(126, 182, 200, 0.35)' : 'rgba(255, 201, 102, 0.35)'
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
    };

    return (
      <Box
        as="label"
        display="inline-flex"
        alignItems="center"
        gap={2}
        cursor={props.disabled ? 'not-allowed' : 'pointer'}
        opacity={props.disabled ? 0.6 : 1}
      >
        <Box
          position="relative"
          display="inline-flex"
          alignItems="center"
          css={{
            'input[type="checkbox"]:focusVisible ~ span': {
              boxShadow: `0 0 0 3px ${ringColor}`,
              outline: 'none',
            },
          }}
        >
          <Box
            as="input"
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={props.disabled}
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
            borderRadius="md"
            border="2px solid"
            borderColor={checked ? checkedColor : 'gray.400'}
            bg={checked ? checkedColor : 'transparent'}
            position="relative"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.2s"
          >
            {checked && (
              <Box
                as="span"
                position="absolute"
                width="4px"
                height="8px"
                border="2px solid white"
                borderTop="none"
                borderLeft="none"
                transform="rotate(45deg)"
                top="2px"
                left="5px"
              />
            )}
          </Box>
        </Box>
        {children && (
          <Box as="span" fontSize="sm">
            {children}
          </Box>
        )}
      </Box>
    );
  }
);

Checkbox.displayName = 'Checkbox';

