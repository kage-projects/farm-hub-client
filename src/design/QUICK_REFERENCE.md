# 🚀 Theme Quick Reference

Cheat sheet untuk development dengan design system baru.

---

## 🎨 Colors

### Brand (Primary Green)
```tsx
// Solid background
<Box bg="brand.600" color="white">Light mode optimal</Box>
<Box bg="brand.300" color="white">Dark mode optimal</Box>

// Subtle background
<Box bg="brand.50">Very light green</Box>
<Box bg="brand.100">Light green</Box>
```

### Secondary (Teal)
```tsx
<Box bg="secondary.600" color="white">Teal dark</Box>
<Box bg="secondary.300" color="white">Teal light</Box>
```

### Accent (Amber)
```tsx
<Box bg="accent.600" color="white">Amber dark</Box>
<Box bg="accent.300" color="white">Amber light</Box>
```

---

## 🔖 Semantic Tokens

```tsx
// Auto-adapts to light/dark mode
<Box bg="bg">           {/* white / gray.900 */}
<Text color="fg">       {/* gray.800 / gray.100 */}
<Text color="muted">    {/* gray.600 / gray.400 */}
<Box bg="subtle">       {/* gray.50 / gray.800 */}
<Box borderColor="border"> {/* gray.200 / gray.700 */}

// Brand colors
<Box bg="primary">      {/* brand.600 / brand.300 */}
<Box bg="secondary">    {/* secondary.600 / secondary.300 */}
<Box bg="accent">       {/* accent.600 / accent.300 */}
```

---

## 🎯 Buttons

```tsx
// Default (brand)
<Button>Click Me</Button>

// Color schemes
<Button colorScheme="brand">Brand</Button>
<Button colorScheme="secondary">Secondary</Button>
<Button colorScheme="accent">Accent</Button>

// Variants
<Button variant="solid">Solid</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

---

## 💡 Common Patterns

### Card with Semantic Tokens
```tsx
<Box bg="bg" borderWidth="1px" borderColor="border" rounded="xl" p={6}>
  <Heading color="fg">Title</Heading>
  <Text color="muted">Subtitle</Text>
</Box>
```

### Subtle Background Section
```tsx
<Box bg="subtle" p={8} rounded="lg">
  <Text color="fg">Content</Text>
</Box>
```

### Primary Action Card
```tsx
<Box bg="primary" color="white" p={6} rounded="xl">
  <Heading>Primary Action</Heading>
  <Button colorScheme="whiteAlpha">Click</Button>
</Box>
```

### Text Hierarchy
```tsx
<VStack align="start">
  <Heading color="fg">Main Title</Heading>
  <Text color="fg">Body text</Text>
  <Text color="muted">Secondary info</Text>
</VStack>
```

---

## 🌓 Color Mode Specific

```tsx
// Using useColorModeValue
const bg = useColorModeValue('white', 'gray.900');
const text = useColorModeValue('gray.800', 'gray.100');

<Box bg={bg} color={text}>Adaptive</Box>

// Using object syntax
<Box 
  bg={{ base: 'white', _dark: 'gray.900' }}
  color={{ base: 'gray.800', _dark: 'gray.100' }}
>
  Adaptive
</Box>
```

---

## ✅ WCAG AA Compliant Combinations

```tsx
// Light mode
<Box bg="brand.600" color="white">✅ AA Pass</Box>
<Box bg="secondary.600" color="white">✅ AA Pass</Box>
<Box bg="accent.600" color="white">✅ AA Pass</Box>

// Dark mode
<Box bg="brand.300" color="white">✅ AA Pass</Box>
<Box bg="secondary.300" color="white">✅ AA Pass</Box>
<Box bg="accent.300" color="white">✅ AA Pass</Box>
```

---

## 🚫 Common Mistakes to Avoid

```tsx
// ❌ Don't use shade 500 for solid buttons (insufficient contrast)
<Button bg="brand.500" color="white">Bad contrast</Button>

// ✅ Use shade 600 (light) / 300 (dark)
<Button colorScheme="brand">Good contrast</Button>

// ❌ Don't hardcode light/dark colors
<Box bg="white" color="gray.800">Only works in light</Box>

// ✅ Use semantic tokens
<Box bg="bg" color="fg">Works in both modes</Box>

// ❌ Don't mix direct and semantic tokens randomly
<Box bg="brand.600" color="muted">Inconsistent</Box>

// ✅ Be consistent
<Box bg="primary" color="white">Consistent</Box>
```

---

## 🎨 Import Colors Object

```tsx
import { colors } from '@/design/theme';

// Access raw hex values
const brandGreen = colors.brand[600]; // '#25521a'
const tealBlue = colors.secondary[300]; // '#7eb6c8'
```

---

## 📦 Complete Import Example

```tsx
import { 
  Box, 
  Button, 
  Text, 
  Heading,
  VStack,
  HStack 
} from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { colors } from '@/design/theme';

function MyComponent() {
  const bg = useColorModeValue('white', 'gray.900');
  
  return (
    <Box bg={bg} p={6}>
      <Heading color="fg">Title</Heading>
      <Text color="muted">Subtitle</Text>
      <Button colorScheme="brand">Action</Button>
    </Box>
  );
}
```

---

## 🔗 Resources

- Full docs: `src/design/README.md`
- Theme file: `src/design/theme.ts`
- Visual showcase: `src/pages/ThemeShowcase.tsx`

---

**Last Updated:** 2025-10-30



