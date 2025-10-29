import { defineConfig } from '@chakra-ui/react';

// ============================================================
// COLORS - Palet warna brand/secondary/accent
// ============================================================
const colors = {
  brand: {
    50: '#e5efe2',
    100: '#cfe1cb',
    200: '#b2d0ad',
    300: '#8fb887',
    400: '#679e5c',
    500: '#2b601e',
    600: '#25521a',
    700: '#1f4516',
    800: '#183712',
    900: '#122a0d',
  },
  secondary: {
    50: '#e6f1f3',
    100: '#cbe3e9',
    200: '#a6cfd9',
    300: '#7eb6c8',
    400: '#5a9bb2',
    500: '#1e4a60',
    600: '#183d50',
    700: '#133141',
    800: '#0f2633',
    900: '#0b1c26',
  },
  accent: {
    50: '#fff5e0',
    100: '#ffe8b8',
    200: '#ffd98f',
    300: '#ffc966',
    400: '#ffb941',
    500: '#e3aa1a',
    600: '#be8900',
    700: '#9d7100',
    800: '#7b5900',
    900: '#5a4000',
  },
};

// ============================================================
// THEME CONFIG
// ============================================================
const customTheme = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e5efe2' },
          100: { value: '#cfe1cb' },
          200: { value: '#b2d0ad' },
          300: { value: '#8fb887' },
          400: { value: '#679e5c' },
          500: { value: '#2b601e' },
          600: { value: '#25521a' },
          700: { value: '#1f4516' },
          800: { value: '#183712' },
          900: { value: '#122a0d' },
        },
        secondary: {
          50: { value: '#e6f1f3' },
          100: { value: '#cbe3e9' },
          200: { value: '#a6cfd9' },
          300: { value: '#7eb6c8' },
          400: { value: '#5a9bb2' },
          500: { value: '#1e4a60' },
          600: { value: '#183d50' },
          700: { value: '#133141' },
          800: { value: '#0f2633' },
          900: { value: '#0b1c26' },
        },
        accent: {
          50: { value: '#fff5e0' },
          100: { value: '#ffe8b8' },
          200: { value: '#ffd98f' },
          300: { value: '#ffc966' },
          400: { value: '#ffb941' },
          500: { value: '#e3aa1a' },
          600: { value: '#be8900' },
          700: { value: '#9d7100' },
          800: { value: '#7b5900' },
          900: { value: '#5a4000' },
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { base: '{colors.white}', _dark: '{colors.gray.900}' } },
        fg: { value: { base: '{colors.gray.800}', _dark: '{colors.gray.100}' } },
        muted: { value: { base: '{colors.gray.600}', _dark: '{colors.gray.400}' } },
        subtle: { value: { base: '{colors.gray.50}', _dark: '{colors.gray.800}' } },
        border: { value: { base: '{colors.gray.200}', _dark: '{colors.gray.700}' } },
        ring: { value: { base: '{colors.brand.500}', _dark: '{colors.brand.300}' } },
        primary: { value: { base: '{colors.brand.500}', _dark: '{colors.brand.300}' } },
        secondary: { value: { base: '{colors.secondary.500}', _dark: '{colors.secondary.300}' } },
        accent: { value: { base: '{colors.accent.500}', _dark: '{colors.accent.300}' } },
      },
    },
    recipes: {
      button: {
        base: {
          cursor: 'pointer',
          fontWeight: 600,
        },
        variants: {
          variant: {
            solid: {
              _light: {
                '&[data-color-palette="brand"]': {
                  bg: 'brand.600',
                  color: 'white',
                  _hover: { bg: 'brand.700' },
                  _active: { bg: 'brand.800' },
                },
                '&[data-color-palette="secondary"]': {
                  bg: 'secondary.600',
                  color: 'white',
                  _hover: { bg: 'secondary.700' },
                  _active: { bg: 'secondary.800' },
                },
                '&[data-color-palette="accent"]': {
                  bg: 'accent.600',
                  color: 'white',
                  _hover: { bg: 'accent.700' },
                  _active: { bg: 'accent.800' },
                },
              },
              _dark: {
                '&[data-color-palette="brand"]': {
                  bg: 'brand.400',
                  color: 'gray.900',
                  _hover: { bg: 'brand.300' },
                  _active: { bg: 'brand.500' },
                },
                '&[data-color-palette="secondary"]': {
                  bg: 'secondary.400',
                  color: 'gray.900',
                  _hover: { bg: 'secondary.300' },
                  _active: { bg: 'secondary.500' },
                },
                '&[data-color-palette="accent"]': {
                  bg: 'accent.400',
                  color: 'gray.900',
                  _hover: { bg: 'accent.300' },
                  _active: { bg: 'accent.500' },
                },
              },
            },
          },
        },
      },
    },
    globalCss: {
      body: {
        bg: 'bg',
        color: 'fg',
      },
    },
  },
});

export default customTheme;
export { colors };
