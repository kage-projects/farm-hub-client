import { Box, VStack, Text } from '@chakra-ui/react';
import { Textarea } from './Textarea';
import { forwardRef } from 'react';
import { useColorModeValue } from '../ui/color-mode';

export type FormTextareaProps = React.ComponentProps<typeof Textarea> & {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
};

/**
 * Form Textarea wrapper dengan label, error message, dan helper text
 */
export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, required, helperText, id, invalid, ...props }, ref) => {
    const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;
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
              const textarea = document.getElementById(textareaId);
              textarea?.focus();
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
        <Textarea
          ref={ref}
          id={textareaId}
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

FormTextarea.displayName = 'FormTextarea';


