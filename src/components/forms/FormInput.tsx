import { Box, VStack, Text } from '@chakra-ui/react';
import { Input } from './Input';
import { forwardRef } from 'react';
import { useColorModeValue } from '../ui/color-mode';

export type FormInputProps = React.ComponentProps<typeof Input> & {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
};

/**
 * Form Input wrapper dengan label, error message, dan helper text
 * - Consistent styling
 * - Validation error display
 * - Required indicator
 * - Compatible with Chakra UI v3 (using VStack instead of FormControl)
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, helperText, id, invalid, ...props }, ref) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    const textColor = useColorModeValue('gray.700', 'gray.300');
    const errorColor = useColorModeValue('red.600', 'red.400');
    const helperColor = useColorModeValue('gray.600', 'gray.400');

    return (
      <VStack align="stretch" gap={1}>
        {label && (
          <Box
            fontSize="sm"
            fontWeight="medium"
            color={textColor}
            display="block"
            mb={1}
            onClick={() => {
              const input = document.getElementById(inputId);
              input?.focus();
            }}
            cursor="pointer"
          >
            {label}
            {required && (
              <Box as="span" color="red.500" ml={1}>
                *
              </Box>
            )}
          </Box>
        )}
        <Input
          ref={ref}
          id={inputId}
          invalid={invalid || !!error}
          aria-label={label}
          {...props}
        />
        {error && (
          <Text fontSize="xs" color={errorColor} mt={1}>
            {error}
          </Text>
        )}
        {helperText && !error && (
          <Text fontSize="xs" color={helperColor} mt={1}>
            {helperText}
          </Text>
        )}
      </VStack>
    );
  }
);

FormInput.displayName = 'FormInput';

