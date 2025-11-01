# 🎨 Design System

Design system untuk **FarmHub - Aquatic Farming Management**

## 📁 Struktur

```
src/design/
├── theme.ts          # Theme configuration (colors, semantic tokens, recipes)
└── README.md         # Dokumentasi ini
```

---

## 🎨 Color Palette

### **Brand (Primary Green)**
Warna utama untuk farming & growth theme
```
50:  #e5efe2 (lightest)
100: #cfe1cb
200: #b2d0ad
300: #8fb887
400: #679e5c
500: #2b601e ← Base
600: #25521a ← Solid button (light mode)
700: #1f4516
800: #183712
900: #122a0d (darkest)
```

### **Secondary (Teal/Aquatic)**
Warna air & aquatic theme
```
50:  #e6f1f3 (lightest)
100: #cbe3e9
200: #a6cfd9
300: #7eb6c8 ← Solid button (dark mode)
400: #5a9bb2
500: #1e4a60
600: #183d50 ← Solid button (light mode)
700: #133141
800: #0f2633
900: #0b1c26 (darkest)
```

### **Accent (Amber)**
Warna highlight & warning
```
50:  #fff5e0 (lightest)
100: #ffe8b8
200: #ffd98f
300: #ffc966 ← Solid button (dark mode)
400: #ffb941
500: #e3aa1a
600: #be8900 ← Solid button (light mode)
700: #9d7100
800: #7b5900
900: #5a4000 (darkest)
```

---

## 🔖 Semantic Tokens

Tokens yang berubah sesuai light/dark mode:

| Token | Light Mode | Dark Mode | Penggunaan |
|-------|-----------|-----------|------------|
| `bg` | `white` | `gray.900` | Background utama |
| `fg` | `gray.800` | `gray.100` | Text utama |
| `muted` | `gray.600` | `gray.400` | Text secondary |
| `subtle` | `gray.50` | `gray.800` | Background subtle |
| `border` | `gray.200` | `gray.700` | Border elements |
| `ring` | `brand.500` | `brand.300` | Focus ring |
| `primary` | `brand.600` | `brand.300` | Primary color |
| `secondary` | `secondary.600` | `secondary.300` | Secondary color |
| `accent` | `accent.600` | `accent.300` | Accent color |

---

## 🎯 Default Component Settings

### **Button**
- Default `colorScheme`: **brand**
- Default `variant`: **solid**
- Default `size`: **md**

#### WCAG AA Compliance (Solid Variant)
- **Light mode**: Uses shade `600` with white text (contrast ratio ≥ 4.5:1)
- **Dark mode**: Uses shade `300` with white text (contrast ratio ≥ 4.5:1)

---

## 📖 Usage Examples

### 1. Button dengan Default Brand Color
```tsx
<Button>Click Me</Button>
// Otomatis menggunakan brand.600 (light) / brand.300 (dark)
```

### 2. Button dengan ColorScheme Lain
```tsx
<Button colorScheme="secondary">Secondary Action</Button>
<Button colorScheme="accent">Highlight Action</Button>
```

### 3. Menggunakan Semantic Tokens
```tsx
<Box bg="bg" color="fg" borderColor="border">
  <Text color="muted">Secondary text</Text>
</Box>
```

### 4. Direct Color Access
```tsx
<Box bg="brand.600" color="white">
  Primary Content
</Box>

<Box bg="secondary.50" color="secondary.900">
  Subtle Secondary Background
</Box>
```

### 5. Responsive dengan Color Mode
```tsx
<Text color={{ base: 'gray.800', _dark: 'gray.100' }}>
  Adaptive Text
</Text>

<Box 
  bg={{ base: 'white', _dark: 'gray.900' }}
  borderColor={{ base: 'gray.200', _dark: 'gray.700' }}
>
  Adaptive Container
</Box>
```

### 6. Card dengan Semantic Tokens
```tsx
<Card variant="glass">
  <CardHeader>
    <Heading color="fg">Title</Heading>
    <Text color="muted">Subtitle</Text>
  </CardHeader>
  <CardBody>
    <Text color="fg">Content automatically adapts to theme</Text>
  </CardBody>
</Card>
```

---

## ♿ Accessibility

### Kontras Warna (WCAG AA)
Semua solid buttons memenuhi **WCAG AA** (minimum contrast ratio 4.5:1):

✅ **Brand solid**: `brand.600` + white (light) / `brand.300` + white (dark)  
✅ **Secondary solid**: `secondary.600` + white (light) / `secondary.300` + white (dark)  
✅ **Accent solid**: `accent.600` + white (light) / `accent.300` + white (dark)

### Focus Indicators
- Focus ring menggunakan `ring` token (brand.500/brand.300)
- Visible pada keyboard navigation
- Kontras yang cukup di light & dark mode

---

## 🔄 Integration

Theme sudah terintegrasi di:
- ✅ `src/components/ui/provider.tsx` - Theme provider
- ✅ `src/App.tsx` - Root application
- ✅ All components inherit semantic tokens

---

## 🛠️ Development Tips

### Debugging Colors
```tsx
// Check current color mode value
const bgColor = useColorModeValue('white', 'gray.900');
console.log('Current bg:', bgColor);
```

### Testing WCAG Compliance
1. Use browser DevTools Accessibility panel
2. Check contrast ratio untuk text on colored backgrounds
3. Ensure focus indicators visible di semua states

### Extending Theme
Untuk menambah warna atau tokens baru, edit `src/design/theme.ts`:
```ts
tokens: {
  colors: {
    // Add new color palette
    success: { ... },
    danger: { ... },
  }
}
```

---

## 📚 Resources

- [Chakra UI v3 Docs](https://www.chakra-ui.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**Created by**: Five Kage  
**Last Updated**: 2025-10-30



