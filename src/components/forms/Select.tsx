import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { forwardRef } from 'react';

/**
 * Select component props
 */
export interface SelectProps extends React.ComponentProps<typeof NativeSelectField> {
  /** Invalid state */
  invalid?: boolean;
  /** Items to render */
  items?: Array<{ value: string; label: string }>;
}

/**
 * Select component with consistent focus ring
 * - Native select with custom styling
 * - Focus ring using semantic 'ring' token
 * - Invalid state styling
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ invalid, items, children, ...props }, ref) => {
    return (
      <NativeSelectRoot>
        <NativeSelectField
          ref={ref}
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
          {...props}
        >
          {items
            ? items.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))
            : children}
        </NativeSelectField>
      </NativeSelectRoot>
    );
  }
);

Select.displayName = 'Select';

