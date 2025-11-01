import { FormInput } from './FormInput';
import type { FormInputProps } from './FormInput';
import { forwardRef, useState, useEffect } from 'react';

export interface FormCurrencyInputProps extends Omit<FormInputProps, 'value' | 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
  currency?: 'IDR' | 'USD';
}

/**
 * Currency Input dengan formatting Rupiah/USD
 * - Auto format dengan separator
 * - Parsing number value
 * - Display currency symbol
 */
export const FormCurrencyInput = forwardRef<HTMLInputElement, FormCurrencyInputProps>(
  ({ value, onChange, currency = 'IDR', ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
      if (value !== undefined && value !== null) {
        const formatted = formatCurrency(value, currency);
        setDisplayValue(formatted);
      }
    }, [value, currency]);

    const formatCurrency = (num: number, curr: string): string => {
      if (isNaN(num)) return '';
      if (curr === 'IDR') {
        return new Intl.NumberFormat('id-ID', {
          style: 'decimal',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(num);
      }
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: curr,
      }).format(num);
    };

    const parseCurrency = (str: string): number => {
      // Remove all non-digit characters except decimal
      const cleaned = str.replace(/[^\d]/g, '');
      return cleaned ? parseInt(cleaned, 10) : 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const parsed = parseCurrency(inputValue);
      
      // Update display with formatted value
      if (parsed === 0) {
        setDisplayValue('');
      } else {
        setDisplayValue(formatCurrency(parsed, currency));
      }

      // Call onChange with numeric value
      onChange?.(parsed);
    };

    const currencySymbol = currency === 'IDR' ? 'Rp' : '$';
    const prefix = displayValue ? `${currencySymbol} ` : '';

    return (
      <FormInput
        ref={ref}
        value={prefix + displayValue}
        onChange={handleChange}
        placeholder={props.placeholder || `Masukkan jumlah (${currency})`}
        {...props}
      />
    );
  }
);

FormCurrencyInput.displayName = 'FormCurrencyInput';

