/**
 * Design System Barrel Export
 * 
 * Centralized exports untuk design system
 */

// Theme configuration
import theme from './theme';
export { default as theme, colors, type ColorPalette, type ColorShade } from './theme';

// Default export untuk import langsung
export default theme;

/**
 * Usage:
 * 
 * import theme, { colors, type ColorPalette } from '@/design';
 * 
 * OR
 * 
 * import theme from '@/design/theme';
 * import { colors } from '@/design';
 */

