import { Input as ChakraInput } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { useColorModeValue } from '../ui/color-mode';

/**
 * Input component props
 */
export interface InputProps extends React.ComponentProps<typeof ChakraInput> {
  /** Invalid state */
  invalid?: boolean;
}

/**
 * Input component with consistent focus ring
 * - Outline and filled variants
 * - Focus ring using semantic 'ring' token
 * - Invalid state styling
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid, ...props }, ref) => {
    const glassBg = useColorModeValue('rgba(255, 255, 255, 0.6)', 'rgba(30, 58, 138, 0.3)');
    const borderColor = useColorModeValue('rgba(6, 182, 212, 0.3)', 'rgba(34, 211, 238, 0.3)');
    const focusBorder = useColorModeValue('cyan.500', 'cyan.400');
    const placeholderColor = useColorModeValue('gray.500', 'gray.400');
    
    return (
      <ChakraInput
        ref={ref}
        variant="outline"
        bg={glassBg}
        backdropFilter="blur(12px)"
        WebkitBackdropFilter="blur(12px)"
        borderColor={invalid ? 'red.400' : borderColor}
        rounded="xl"
        h={12}
        fontSize="sm"
        _hover={{
          borderColor: invalid ? 'red.500' : useColorModeValue('cyan.400', 'cyan.500'),
          bg: useColorModeValue('rgba(255, 255, 255, 0.75)', 'rgba(30, 58, 138, 0.4)'),
        }}
        _focus={{
          borderColor: invalid ? 'red.500' : focusBorder,
          boxShadow: invalid 
            ? '0 0 0 3px rgba(239, 68, 68, 0.15)' 
            : useColorModeValue(
                '0 0 0 3px rgba(6, 182, 212, 0.15)',
                '0 0 0 3px rgba(34, 211, 238, 0.15)'
              ),
          outline: 'none',
          bg: useColorModeValue('rgba(255, 255, 255, 0.85)', 'rgba(30, 58, 138, 0.5)'),
        }}
        _disabled={{
          opacity: 0.5,
          cursor: 'not-allowed',
          bg: useColorModeValue('rgba(255, 255, 255, 0.4)', 'rgba(30, 58, 138, 0.2)'),
        }}
        _placeholder={{
          color: placeholderColor,
        }}
        transition="all 0.2s"
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

