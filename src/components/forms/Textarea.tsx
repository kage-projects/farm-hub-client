import { Textarea as ChakraTextarea } from '@chakra-ui/react';
import { forwardRef } from 'react';

/**
 * Textarea component props
 */
export interface TextareaProps extends React.ComponentProps<typeof ChakraTextarea> {
  /** Invalid state */
  invalid?: boolean;
}

/**
 * Textarea component with consistent focus ring
 * - Focus ring using semantic 'ring' token
 * - Invalid state styling
 * - Resizable by default
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ invalid, ...props }, ref) => {
    return (
      <ChakraTextarea
        ref={ref}
        variant="outline"
        borderColor={invalid ? 'red.500' : 'gray.300'}
        _hover={{
          borderColor: invalid ? 'red.600' : 'gray.400',
        }}
        _focus={{
          borderColor: invalid ? 'red.500' : 'brand.500',
          boxShadow: invalid 
            ? '0 0 0 3px rgba(239, 68, 68, 0.2)' 
            : '0 0 0 3px rgba(43, 96, 30, 0.2)',
          outline: 'none',
        }}
        _disabled={{
          opacity: 0.6,
          cursor: 'not-allowed',
          bg: 'gray.100',
        }}
        _placeholder={{
          color: 'gray.500',
        }}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

