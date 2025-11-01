import { defineConfig } from '@chakra-ui/react';

/**
 * =============================================================================
 * DESIGN SYSTEM THEME
 * =============================================================================
 * Custom theme configuration untuk FarmHub - Aquatic Farming Management
 * 
 * Color Palette:
 * - Brand (Green): Primary color untuk farming & growth
 * - Secondary (Teal): Air & aquatic theme
 * - Accent (Amber): Warning & highlights
 * 
 * Semantic Tokens: Light/Dark mode support
 * Component Defaults: Brand colorScheme dengan WCAG AA compliance
 */

// =============================================================================
// COLOR PALETTE (50-900 shades)
// =============================================================================

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

// =============================================================================
// THEME CONFIGURATION
// =============================================================================

const theme = defineConfig({
  theme: {
    // -------------------------------------------------------------------------
    // COLOR TOKENS
    // -------------------------------------------------------------------------
    tokens: {
      colors: {
        // Brand colors
        brand: {
          50: { value: colors.brand[50] },
          100: { value: colors.brand[100] },
          200: { value: colors.brand[200] },
          300: { value: colors.brand[300] },
          400: { value: colors.brand[400] },
          500: { value: colors.brand[500] },
          600: { value: colors.brand[600] },
          700: { value: colors.brand[700] },
          800: { value: colors.brand[800] },
          900: { value: colors.brand[900] },
        },
        // Secondary colors (teal/aquatic)
        secondary: {
          50: { value: colors.secondary[50] },
          100: { value: colors.secondary[100] },
          200: { value: colors.secondary[200] },
          300: { value: colors.secondary[300] },
          400: { value: colors.secondary[400] },
          500: { value: colors.secondary[500] },
          600: { value: colors.secondary[600] },
          700: { value: colors.secondary[700] },
          800: { value: colors.secondary[800] },
          900: { value: colors.secondary[900] },
        },
        // Accent colors (amber)
        accent: {
          50: { value: colors.accent[50] },
          100: { value: colors.accent[100] },
          200: { value: colors.accent[200] },
          300: { value: colors.accent[300] },
          400: { value: colors.accent[400] },
          500: { value: colors.accent[500] },
          600: { value: colors.accent[600] },
          700: { value: colors.accent[700] },
          800: { value: colors.accent[800] },
          900: { value: colors.accent[900] },
        },
      },
    },

    // -------------------------------------------------------------------------
    // SEMANTIC TOKENS (Light/Dark mode)
    // -------------------------------------------------------------------------
    semanticTokens: {
      colors: {
        // Background colors
        bg: {
          value: {
            base: '{colors.white}',
            _dark: '{colors.gray.900}',
          },
        },
        // Foreground (primary text)
        fg: {
          value: {
            base: '{colors.gray.800}',
            _dark: '{colors.gray.100}',
          },
        },
        // Muted (secondary text)
        muted: {
          value: {
            base: '{colors.gray.600}',
            _dark: '{colors.gray.400}',
          },
        },
        // Subtle (subtle backgrounds)
        subtle: {
          value: {
            base: '{colors.gray.50}',
            _dark: '{colors.gray.800}',
          },
        },
        // Border colors
        border: {
          value: {
            base: '{colors.gray.200}',
            _dark: '{colors.gray.700}',
          },
        },
        // Focus ring
        ring: {
          value: {
            base: '{colors.brand.500}',
            _dark: '{colors.brand.300}',
          },
        },
        // Primary semantic color
        primary: {
          value: {
            base: '{colors.brand.600}',
            _dark: '{colors.brand.300}',
          },
        },
        // Secondary semantic color
        secondary: {
          value: {
            base: '{colors.secondary.600}',
            _dark: '{colors.secondary.300}',
          },
        },
        // Accent semantic color
        accent: {
          value: {
            base: '{colors.accent.600}',
            _dark: '{colors.accent.300}',
          },
        },
      },
    },

    // -------------------------------------------------------------------------
    // COMPONENT RECIPES (Default styles & variants)
    // -------------------------------------------------------------------------
    recipes: {
      // ========================================================================
      // BUTTON
      // ========================================================================
      button: {
        base: {
          fontWeight: 'semibold',
          borderRadius: 'md',
          transition: 'all 0.2s',
          _focusVisible: {
            outline: 'none',
            ring: '2px',
            ringColor: '{colors.ring}',
            ringOffset: '2px',
          },
        },
        variants: {
          solid: {
            brand: {
              bg: {
                base: '{colors.brand.600}',
                _dark: '{colors.brand.300}',
              },
              color: 'white',
              _hover: {
                bg: {
                  base: '{colors.brand.700}',
                  _dark: '{colors.brand.200}',
                },
              },
              _active: {
                bg: {
                  base: '{colors.brand.800}',
                  _dark: '{colors.brand.100}',
                },
              },
              _disabled: {
                opacity: 0.4,
                cursor: 'not-allowed',
              },
            },
            secondary: {
              bg: {
                base: '{colors.secondary.600}',
                _dark: '{colors.secondary.300}',
              },
              color: 'white',
              _hover: {
                bg: {
                  base: '{colors.secondary.700}',
                  _dark: '{colors.secondary.200}',
                },
              },
              _active: {
                bg: {
                  base: '{colors.secondary.800}',
                  _dark: '{colors.secondary.100}',
                },
              },
            },
            accent: {
              bg: {
                base: '{colors.accent.600}',
                _dark: '{colors.accent.300}',
              },
              color: 'white',
              _hover: {
                bg: {
                  base: '{colors.accent.700}',
                  _dark: '{colors.accent.200}',
                },
              },
              _active: {
                bg: {
                  base: '{colors.accent.800}',
                  _dark: '{colors.accent.100}',
                },
              },
            },
            destructive: {
              bg: {
                base: '{colors.red.600}',
                _dark: '{colors.red.400}',
              },
              color: 'white',
              _hover: {
                bg: {
                  base: '{colors.red.700}',
                  _dark: '{colors.red.300}',
                },
              },
              _active: {
                bg: {
                  base: '{colors.red.800}',
                  _dark: '{colors.red.200}',
                },
              },
            },
          },
          outline: {
            brand: {
              border: '1px solid',
              borderColor: {
                base: '{colors.brand.600}',
                _dark: '{colors.brand.300}',
              },
              color: {
                base: '{colors.brand.600}',
                _dark: '{colors.brand.300}',
              },
              bg: 'transparent',
              _hover: {
                bg: {
                  base: '{colors.brand.50}',
                  _dark: '{colors.brand.900}',
                },
              },
              _active: {
                bg: {
                  base: '{colors.brand.100}',
                  _dark: '{colors.brand.800}',
                },
              },
            },
            secondary: {
              border: '1px solid',
              borderColor: {
                base: '{colors.secondary.600}',
                _dark: '{colors.secondary.300}',
              },
              color: {
                base: '{colors.secondary.600}',
                _dark: '{colors.secondary.300}',
              },
              bg: 'transparent',
              _hover: {
                bg: {
                  base: '{colors.secondary.50}',
                  _dark: '{colors.secondary.900}',
                },
              },
            },
            accent: {
              border: '1px solid',
              borderColor: {
                base: '{colors.accent.600}',
                _dark: '{colors.accent.300}',
              },
              color: {
                base: '{colors.accent.600}',
                _dark: '{colors.accent.300}',
              },
              bg: 'transparent',
              _hover: {
                bg: {
                  base: '{colors.accent.50}',
                  _dark: '{colors.accent.900}',
                },
              },
            },
            destructive: {
              border: '1px solid',
              borderColor: {
                base: '{colors.red.600}',
                _dark: '{colors.red.400}',
              },
              color: {
                base: '{colors.red.600}',
                _dark: '{colors.red.400}',
              },
              bg: 'transparent',
              _hover: {
                bg: {
                  base: '{colors.red.50}',
                  _dark: '{colors.red.900}',
                },
              },
            },
          },
          ghost: {
            brand: {
              color: {
                base: '{colors.brand.600}',
                _dark: '{colors.brand.300}',
              },
              bg: 'transparent',
              _hover: {
                bg: {
                  base: '{colors.brand.50}',
                  _dark: '{colors.brand.900}',
                },
              },
              _active: {
                bg: {
                  base: '{colors.brand.100}',
                  _dark: '{colors.brand.800}',
                },
              },
            },
            secondary: {
              color: {
                base: '{colors.secondary.600}',
                _dark: '{colors.secondary.300}',
              },
              bg: 'transparent',
              _hover: {
                bg: {
                  base: '{colors.secondary.50}',
                  _dark: '{colors.secondary.900}',
                },
              },
            },
            accent: {
              color: {
                base: '{colors.accent.600}',
                _dark: '{colors.accent.300}',
              },
              bg: 'transparent',
              _hover: {
                bg: {
                  base: '{colors.accent.50}',
                  _dark: '{colors.accent.900}',
                },
              },
            },
            destructive: {
              color: {
                base: '{colors.red.600}',
                _dark: '{colors.red.400}',
              },
              bg: 'transparent',
              _hover: {
                bg: {
                  base: '{colors.red.50}',
                  _dark: '{colors.red.900}',
                },
              },
            },
          },
          link: {
            brand: {
              color: {
                base: '{colors.brand.600}',
                _dark: '{colors.brand.300}',
              },
              bg: 'transparent',
              textDecoration: 'underline',
              _hover: {
                color: {
                  base: '{colors.brand.700}',
                  _dark: '{colors.brand.200}',
                },
              },
            },
            secondary: {
              color: {
                base: '{colors.secondary.600}',
                _dark: '{colors.secondary.300}',
              },
              bg: 'transparent',
              textDecoration: 'underline',
              _hover: {
                color: {
                  base: '{colors.secondary.700}',
                  _dark: '{colors.secondary.200}',
                },
              },
            },
            accent: {
              color: {
                base: '{colors.accent.600}',
                _dark: '{colors.accent.300}',
              },
              bg: 'transparent',
              textDecoration: 'underline',
              _hover: {
                color: {
                  base: '{colors.accent.700}',
                  _dark: '{colors.accent.200}',
                },
              },
            },
            destructive: {
              color: {
                base: '{colors.red.600}',
                _dark: '{colors.red.400}',
              },
              bg: 'transparent',
              textDecoration: 'underline',
              _hover: {
                color: {
                  base: '{colors.red.700}',
                  _dark: '{colors.red.300}',
                },
              },
            },
          },
        },
        sizes: {
          sm: {
            px: 3,
            py: 1.5,
            fontSize: 'sm',
          },
          md: {
            px: 4,
            py: 2,
            fontSize: 'md',
          },
          lg: {
            px: 6,
            py: 3,
            fontSize: 'lg',
          },
        },
        defaultVariants: {
          colorPalette: 'brand',
          size: 'md',
          variant: 'solid',
        },
      },

      // ========================================================================
      // BADGE / TAG
      // ========================================================================
      badge: {
        base: {
          fontWeight: 'medium',
          borderRadius: 'md',
          px: 2,
          py: 1,
        },
        variants: {
          solid: {
            brand: {
              bg: {
                base: '{colors.brand.600}',
                _dark: '{colors.brand.300}',
              },
              color: 'white',
            },
            secondary: {
              bg: {
                base: '{colors.secondary.600}',
                _dark: '{colors.secondary.300}',
              },
              color: 'white',
            },
            accent: {
              bg: {
                base: '{colors.accent.600}',
                _dark: '{colors.accent.300}',
              },
              color: 'white',
            },
          },
          subtle: {
            brand: {
              bg: {
                base: '{colors.brand.50}',
                _dark: '{colors.brand.900}',
              },
              color: {
                base: '{colors.brand.700}',
                _dark: '{colors.brand.200}',
              },
            },
            secondary: {
              bg: {
                base: '{colors.secondary.50}',
                _dark: '{colors.secondary.900}',
              },
              color: {
                base: '{colors.secondary.700}',
                _dark: '{colors.secondary.200}',
              },
            },
            accent: {
              bg: {
                base: '{colors.accent.50}',
                _dark: '{colors.accent.900}',
              },
              color: {
                base: '{colors.accent.700}',
                _dark: '{colors.accent.200}',
              },
            },
          },
          outline: {
            brand: {
              border: '1px solid',
              borderColor: {
                base: '{colors.brand.600}',
                _dark: '{colors.brand.300}',
              },
              color: {
                base: '{colors.brand.600}',
                _dark: '{colors.brand.300}',
              },
              bg: 'transparent',
            },
            secondary: {
              border: '1px solid',
              borderColor: {
                base: '{colors.secondary.600}',
                _dark: '{colors.secondary.300}',
              },
              color: {
                base: '{colors.secondary.600}',
                _dark: '{colors.secondary.300}',
              },
              bg: 'transparent',
            },
            accent: {
              border: '1px solid',
              borderColor: {
                base: '{colors.accent.600}',
                _dark: '{colors.accent.300}',
              },
              color: {
                base: '{colors.accent.600}',
                _dark: '{colors.accent.300}',
              },
              bg: 'transparent',
            },
          },
        },
      },

      // ========================================================================
      // INPUT / SELECT / TEXTAREA
      // ========================================================================
      input: {
        base: {
          borderRadius: 'md',
          transition: 'all 0.2s',
          _focus: {
            outline: 'none',
            border: '1px solid',
            borderColor: '{colors.ring}',
            ring: '2px',
            ringColor: '{colors.ring}',
            ringOffset: '1px',
          },
          _invalid: {
            borderColor: '{colors.red.500}',
            _focus: {
              ringColor: '{colors.red.500}',
            },
          },
          _disabled: {
            opacity: 0.4,
            cursor: 'not-allowed',
          },
        },
        variants: {
          outline: {
            border: '1px solid',
            borderColor: '{colors.border}',
            bg: {
              base: 'white',
              _dark: '{colors.gray.900}',
            },
            color: '{colors.fg}',
          },
          filled: {
            border: '1px solid',
            borderColor: 'transparent',
            bg: '{colors.subtle}',
            color: '{colors.fg}',
            _focus: {
              bg: {
                base: 'white',
                _dark: '{colors.gray.900}',
              },
            },
          },
        },
        defaultVariants: {
          variant: 'outline',
        },
      },

      textarea: {
        base: {
          borderRadius: 'md',
          transition: 'all 0.2s',
          _focus: {
            outline: 'none',
            border: '1px solid',
            borderColor: '{colors.ring}',
            ring: '2px',
            ringColor: '{colors.ring}',
            ringOffset: '1px',
          },
          _invalid: {
            borderColor: '{colors.red.500}',
            _focus: {
              ringColor: '{colors.red.500}',
            },
          },
          _disabled: {
            opacity: 0.4,
            cursor: 'not-allowed',
          },
        },
        variants: {
          outline: {
            border: '1px solid',
            borderColor: '{colors.border}',
            bg: {
              base: 'white',
              _dark: '{colors.gray.900}',
            },
            color: '{colors.fg}',
          },
          filled: {
            border: '1px solid',
            borderColor: 'transparent',
            bg: '{colors.subtle}',
            color: '{colors.fg}',
            _focus: {
              bg: {
                base: 'white',
                _dark: '{colors.gray.900}',
              },
            },
          },
        },
        defaultVariants: {
          variant: 'outline',
        },
      },

      nativeSelect: {
        base: {
          borderRadius: 'md',
          transition: 'all 0.2s',
          _focus: {
            outline: 'none',
            border: '1px solid',
            borderColor: '{colors.ring}',
            ring: '2px',
            ringColor: '{colors.ring}',
            ringOffset: '1px',
          },
          _invalid: {
            borderColor: '{colors.red.500}',
            _focus: {
              ringColor: '{colors.red.500}',
            },
          },
          _disabled: {
            opacity: 0.4,
            cursor: 'not-allowed',
          },
        },
        variants: {
          outline: {
            border: '1px solid',
            borderColor: '{colors.border}',
            bg: {
              base: 'white',
              _dark: '{colors.gray.900}',
            },
            color: '{colors.fg}',
          },
          filled: {
            border: '1px solid',
            borderColor: 'transparent',
            bg: '{colors.subtle}',
            color: '{colors.fg}',
            _focus: {
              bg: {
                base: 'white',
                _dark: '{colors.gray.900}',
              },
            },
          },
        },
        defaultVariants: {
          variant: 'outline',
        },
      },

      // ========================================================================
      // CHECKBOX / RADIO / SWITCH
      // ========================================================================
      checkbox: {
        base: {
          _focusVisible: {
            ring: '2px',
            ringColor: '{colors.ring}',
            ringOffset: '2px',
          },
        },
        variants: {
          brand: {
            colorPalette: 'brand',
          },
          secondary: {
            colorPalette: 'secondary',
          },
          accent: {
            colorPalette: 'accent',
          },
        },
      },

      radio: {
        base: {
          _focusVisible: {
            ring: '2px',
            ringColor: '{colors.ring}',
            ringOffset: '2px',
          },
        },
        variants: {
          brand: {
            colorPalette: 'brand',
          },
          secondary: {
            colorPalette: 'secondary',
          },
          accent: {
            colorPalette: 'accent',
          },
        },
      },

      switch: {
        base: {
          _focusVisible: {
            ring: '2px',
            ringColor: '{colors.ring}',
            ringOffset: '2px',
          },
        },
        variants: {
          brand: {
            colorPalette: 'brand',
          },
          secondary: {
            colorPalette: 'secondary',
          },
          accent: {
            colorPalette: 'accent',
          },
        },
      },

      // ========================================================================
      // TABS
      // ========================================================================
      tabs: {
        variants: {
          line: {
            root: {
              borderBottom: '1px solid',
              borderColor: '{colors.border}',
            },
            list: {},
            trigger: {
              borderBottom: '2px solid',
              borderColor: 'transparent',
              color: '{colors.muted}',
              _selected: {
                borderColor: {
                  base: '{colors.brand.700}',
                  _dark: '{colors.brand.200}',
                },
                color: {
                  base: '{colors.brand.700}',
                  _dark: '{colors.brand.200}',
                },
              },
              _hover: {
                color: {
                  base: '{colors.brand.600}',
                  _dark: '{colors.brand.300}',
                },
              },
            },
          },
          'soft-rounded': {
            root: {},
            list: {},
            trigger: {
              borderRadius: 'md',
              color: '{colors.muted}',
              _selected: {
                bg: {
                  base: '{colors.brand.700}',
                  _dark: '{colors.brand.200}',
                },
                color: {
                  base: 'white',
                  _dark: '{colors.gray.900}',
                },
              },
              _hover: {
                bg: {
                  base: '{colors.brand.50}',
                  _dark: '{colors.brand.900}',
                },
              },
            },
          },
        },
        defaultVariants: {
          variant: 'line',
        },
      },

      // ========================================================================
      // CARD
      // ========================================================================
      card: {
        base: {
          borderRadius: 'xl',
          border: '1px solid',
          borderColor: '{colors.border}',
          bg: '{colors.subtle}',
          boxShadow: 'md',
        },
        variants: {
          default: {
            bg: '{colors.subtle}',
          },
          elevated: {
            bg: '{colors.subtle}',
            boxShadow: 'lg',
          },
          glass: {
            bg: {
              base: 'rgba(255, 255, 255, 0.8)',
              _dark: 'rgba(26, 32, 44, 0.8)',
            },
            backdropFilter: 'blur(10px)',
            borderColor: {
              base: 'rgba(255, 255, 255, 0.2)',
              _dark: 'rgba(255, 255, 255, 0.1)',
            },
          },
        },
        defaultVariants: {
          variant: 'default',
        },
      },

      // ========================================================================
      // TABLE
      // ========================================================================
      table: {
        base: {
          width: '100%',
        },
        variants: {
          default: {
            root: {},
            header: {
              bg: '{colors.subtle}',
              color: '{colors.fg}',
            },
            row: {
              borderBottom: '1px solid',
              borderColor: '{colors.border}',
              _hover: {
                bg: '{colors.subtle}',
              },
            },
            cell: {
              color: '{colors.fg}',
            },
          },
          striped: {
            root: {},
            header: {
              bg: '{colors.subtle}',
              color: '{colors.fg}',
            },
            row: {
              borderBottom: '1px solid',
              borderColor: '{colors.border}',
              _nthOfType: {
                '&:nth-of-type(even)': {
                  bg: '{colors.subtle}',
                },
              },
              _hover: {
                bg: {
                  base: '{colors.gray.100}',
                  _dark: '{colors.gray.700}',
                },
              },
            },
            cell: {
              color: '{colors.fg}',
            },
          },
        },
        defaultVariants: {
          variant: 'default',
        },
      },

      // ========================================================================
      // ALERT
      // ========================================================================
      alert: {
        base: {
          borderRadius: 'md',
        },
        variants: {
          subtle: {
            info: {
              bg: {
                base: '{colors.blue.50}',
                _dark: '{colors.blue.900}',
              },
              color: {
                base: '{colors.blue.800}',
                _dark: '{colors.blue.200}',
              },
            },
            success: {
              bg: {
                base: '{colors.green.50}',
                _dark: '{colors.green.900}',
              },
              color: {
                base: '{colors.green.800}',
                _dark: '{colors.green.200}',
              },
            },
            warning: {
              bg: {
                base: '{colors.yellow.50}',
                _dark: '{colors.yellow.900}',
              },
              color: {
                base: '{colors.yellow.800}',
                _dark: '{colors.yellow.200}',
              },
            },
            error: {
              bg: {
                base: '{colors.red.50}',
                _dark: '{colors.red.900}',
              },
              color: {
                base: '{colors.red.800}',
                _dark: '{colors.red.200}',
              },
            },
          },
          solid: {
            info: {
              bg: {
                base: '{colors.blue.600}',
                _dark: '{colors.blue.400}',
              },
              color: 'white',
            },
            success: {
              bg: {
                base: '{colors.green.600}',
                _dark: '{colors.green.400}',
              },
              color: 'white',
            },
            warning: {
              bg: {
                base: '{colors.yellow.600}',
                _dark: '{colors.yellow.400}',
              },
              color: 'white',
            },
            error: {
              bg: {
                base: '{colors.red.600}',
                _dark: '{colors.red.400}',
              },
              color: 'white',
            },
          },
        },
        defaultVariants: {
          variant: 'subtle',
          status: 'info',
        },
      },

      // ========================================================================
      // MODAL / DRAWER
      // ========================================================================
      modal: {
        base: {
          overlay: {
            bg: 'blackAlpha.700',
          },
          content: {
            borderRadius: 'xl',
            bg: '{colors.bg}',
            boxShadow: '2xl',
          },
          header: {
            borderBottom: '1px solid',
            borderColor: '{colors.border}',
            pb: 4,
            mb: 4,
          },
          body: {
            color: '{colors.fg}',
          },
          footer: {
            borderTop: '1px solid',
            borderColor: '{colors.border}',
            pt: 4,
            mt: 4,
          },
        },
      },

      drawer: {
        base: {
          overlay: {
            bg: 'blackAlpha.700',
          },
          content: {
            borderRadius: 'xl',
            bg: '{colors.bg}',
            boxShadow: '2xl',
          },
          header: {
            borderBottom: '1px solid',
            borderColor: '{colors.border}',
            pb: 4,
            mb: 4,
          },
          body: {
            color: '{colors.fg}',
          },
          footer: {
            borderTop: '1px solid',
            borderColor: '{colors.border}',
            pt: 4,
            mt: 4,
          },
        },
      },

      // ========================================================================
      // TOOLTIP
      // ========================================================================
      tooltip: {
        base: {
          bg: {
            base: '{colors.gray.900}',
            _dark: '{colors.gray.700}',
          },
          color: 'white',
          borderRadius: 'md',
          px: 2,
          py: 1,
          fontSize: 'sm',
          maxW: 'xs',
        },
      },

      // ========================================================================
      // MENU
      // ========================================================================
      menu: {
        base: {
          content: {
            borderRadius: 'md',
            bg: '{colors.bg}',
            border: '1px solid',
            borderColor: '{colors.border}',
            boxShadow: 'lg',
            py: 1,
          },
          item: {
            color: '{colors.fg}',
            _hover: {
              bg: {
                base: 'rgba(37, 82, 26, 0.08)', // transparentize(brand.600, 0.08)
                _dark: 'rgba(143, 184, 135, 0.08)', // transparentize(brand.300, 0.08)
              },
            },
            _active: {
              bg: {
                base: 'rgba(37, 82, 26, 0.12)', // transparentize(brand.600, 0.12)
                _dark: 'rgba(143, 184, 135, 0.12)', // transparentize(brand.300, 0.12)
              },
            },
          },
          divider: {
            borderColor: '{colors.border}',
            my: 1,
          },
        },
      },
    },

    // -------------------------------------------------------------------------
    // GLOBAL CSS
    // -------------------------------------------------------------------------
    globalCss: {
      body: {
        bg: 'bg',
        color: 'fg',
        lineHeight: '1.6',
      },
      '*::placeholder': {
        color: 'muted',
      },
      '*, *::before, *::after': {
        borderColor: 'border',
      },
    },
  },

  // ---------------------------------------------------------------------------
  // THEME CONFIG (Color mode settings)
  // ---------------------------------------------------------------------------
  globalCss: {
    ':root': {
      '--chakra-colors-chakra-body-bg': '{colors.bg}',
      '--chakra-colors-chakra-body-text': '{colors.fg}',
    },
  },
});

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Export custom theme
 * Usage: import theme from '@/design/theme'
 */
export default theme;

/**
 * Export colors for direct usage
 * Usage: import { colors } from '@/design/theme'
 */
export { colors };

/**
 * Type-safe color palette keys
 */
export type ColorPalette = 'brand' | 'secondary' | 'accent';
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * =============================================================================
 * USAGE EXAMPLES
 * =============================================================================
 * 
 * 1. Button with default brand color:
 *    <Button>Click Me</Button>
 * 
 * 2. Button with secondary color:
 *    <Button colorScheme="secondary">Secondary</Button>
 * 
 * 3. Using semantic tokens:
 *    <Box bg="bg" color="fg" borderColor="border">Content</Box>
 * 
 * 4. Direct color access:
 *    <Box bg="brand.600" color="white">Primary</Box>
 * 
 * 5. Responsive with color mode:
 *    <Text color={{ base: 'gray.800', _dark: 'gray.100' }}>Text</Text>
 * 
 * =============================================================================
 */



