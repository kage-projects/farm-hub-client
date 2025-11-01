# 🌊 Farm Hub Client - Aquatic Farming Solutions

Modern web application untuk marine aquaculture management dengan ocean-inspired glassmorphism design.

## ✨ Features

- 🌊 **Ocean Theme** - Glassmorphism design dengan tema aquatic
- 🐟 **Marine Farming Focus** - Untuk fish, shrimp, lobster farming
- 🎨 **Glassmorphism UI** - Transparent blur effects di semua komponen
- ♿ **WCAG AA Compliant** - Aksesibilitas terjamin untuk semua pengguna
- 🌓 **Dark Mode** - Light (sky) / dark (deep ocean) mode
- 📦 **Component Library** - 15+ komponen reusable dengan glass variants
- ⚡ **Fast Development** - Hot Module Replacement dengan Vite
- 🎯 **TypeScript** - Full type safety dan auto-completion
- 🫧 **Animated Decorations** - Floating bubbles, waves, dan organic movements

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# atau
pnpm install
```

### 2. Run Development Server

```bash
npm run dev
# atau
pnpm run dev
```

### 3. Open Browser

Buka `http://localhost:5173` untuk melihat aplikasi dan UI Showcase.

## 📚 Documentation

Lihat [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) untuk dokumentasi lengkap tentang:
- Color palette
- Semantic tokens
- Component library
- Accessibility guidelines
- Usage examples

## 🎨 Ocean-Inspired Design System

### Glassmorphism Effect
Semua komponen menggunakan **true glassmorphism**:
- 🫧 Transparent backgrounds (rgba with alpha 0.4-0.9)
- ✨ Backdrop blur (12px - 24px)
- 🌈 Saturation boost (180%)
- 🌊 Ocean-tinted glass (cyan/teal tints)

### Color Palette
- **Brand Color** (#2b601e) - Forest green untuk actions
- **Ocean Accents** - Cyan/Teal borders dan shadows
- **Secondary** (#1e4a60) - Deep teal untuk navigation
- **Accent** (#e3aa1a) - Amber untuk warnings

### Background Gradients
- **Light Mode:** Sky blue → Cyan (morning ocean)
- **Dark Mode:** Deep ocean blue → Teal (night sea)

### Animated Elements
- 🫧 Floating bubbles rising from bottom
- 🌊 Layered wave decorations
- ☁️ Organic floating orb movements
- 🐟 Marine life emoji accents

Semua warna telah divalidasi untuk kontras WCAG AA (minimum 4.5:1).

📖 **[View Ocean Theme Documentation →](./OCEAN_THEME.md)**

## 📦 Tech Stack

- **React 19** - UI library terbaru
- **TypeScript 5** - Type safety
- **Vite 7** - Build tool modern dan cepat
- **Chakra UI v3** - Component library dengan aksesibilitas
- **Tailwind CSS v4** - Utility-first CSS
- **React Router v7** - Client-side routing

## 🎯 Component Library

Farm Hub includes a comprehensive, type-safe component library:

### Navigation
- **Navbar** - Responsive navbar dengan mobile drawer
- **Breadcrumbs** - Navigation breadcrumbs dengan truncation
- **Pagination** - Client-side pagination
- **Tabs** - Line & soft-rounded variants

### Forms
- **Input, Select, Textarea** - Consistent focus ring & validation
- **Checkbox, Radio, Switch** - Accessible form controls

### Feedback
- **Alert** - Status alerts (success/info/warning/error)
- **Toast** - Toast notifications wrapper
- **Tooltip** - Hover tooltips dengan arrow
- **Skeleton** - Loading placeholders
- **Spinner** - Loading indicators
- **EmptyState** - No data states

### Display
- **Button** - 4 variants × 4 intents × 3 sizes
- **Tag/Badge** - Status badges dengan 3 variants
- **Card** - Content containers
- **Table** - Sortable data tables

### Overlays
- **Modal** - Dialog modals
- **Drawer** - Slide-out panels
- **Menu** - Dropdown menus

📖 **[View Complete Component Documentation →](./COMPONENTS.md)**

## 🏗️ Project Structure

```
src/
├── components/              # Component library
│   ├── navbar/             # Navbar component
│   ├── button/             # Button component
│   ├── badges/             # Tag/Badge components
│   ├── forms/              # Form controls (Input, Select, etc)
│   ├── navigation/         # Tabs, Breadcrumbs, Pagination
│   ├── feedback/           # Alert, Toast, Tooltip, etc
│   ├── surfaces/           # Card component
│   ├── data/               # Table component
│   ├── overlays/           # Modal, Drawer
│   ├── menu/               # Menu component
│   ├── ui/                 # Chakra UI provider & utilities
│   ├── ColorSwatch.tsx     # Color contrast checker
│   └── index.ts            # Barrel exports
├── app/
│   └── ui-showcase/        # Comprehensive showcase page
├── theme.ts                # Custom theme & tokens
├── App.tsx                 # Root component
└── main.tsx                # Entry point
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎯 Component Examples

### Button

```tsx
import { Button } from '@chakra-ui/react';

<Button colorScheme="brand" size="md" variant="solid">
  Click me
</Button>
```

### Form Input

```tsx
import { Input, FormControl, FormLabel } from '@chakra-ui/react';

<FormControl>
  <FormLabel>Email</FormLabel>
  <Input type="email" placeholder="Enter your email" />
</FormControl>
```

### Card

```tsx
import { Card, Heading, Text } from '@chakra-ui/react';

<Card.Root>
  <Card.Header>
    <Heading size="md">Card Title</Heading>
  </Card.Header>
  <Card.Body>
    <Text>Card content goes here</Text>
  </Card.Body>
</Card.Root>
```

## ♿ Accessibility

Semua komponen telah diuji untuk:
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ Color contrast (WCAG AA)
- ✅ ARIA attributes

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License - lihat file LICENSE untuk detail.

---

## 📖 Additional Resources

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
