import { Box, Grid, Text, Badge, VStack, HStack } from '@chakra-ui/react';

interface ColorSwatchProps {
  name: string;
  palette: Record<string, string>;
}

// Helper function to calculate relative luminance
const getLuminance = (hex: string): number => {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Calculate contrast ratio
const getContrastRatio = (fg: string, bg: string): number => {
  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

// Check WCAG AA compliance (4.5:1 for normal text)
const checkContrast = (fg: string, bg: string): boolean => {
  const ratio = getContrastRatio(fg, bg);
  return ratio >= 4.5;
};

export const ColorSwatch = ({ name, palette }: ColorSwatchProps) => {
  const shades = Object.keys(palette).sort((a, b) => Number(a) - Number(b));

  return (
    <VStack align="stretch" gap={3}>
      <Text fontSize="xl" fontWeight="bold" textTransform="capitalize">
        {name}
      </Text>
      <Grid templateColumns="repeat(auto-fit, minmax(100px, 1fr))" gap={2}>
        {shades.map((shade) => {
          const color = palette[shade];
          const whiteContrast = checkContrast('#ffffff', color);
          const blackContrast = checkContrast('#000000', color);

          return (
            <VStack key={shade} align="stretch" gap={1}>
              <Box
                bg={color}
                h="80px"
                rounded="md"
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                gap={1}
              >
                <HStack>
                  <Badge
                    size="sm"
                    bg="whiteAlpha.900"
                    color="gray.800"
                    fontSize="xs"
                    px={1.5}
                  >
                    {whiteContrast ? '✓ AA' : '✗ Fail'}
                  </Badge>
                </HStack>
                <HStack>
                  <Badge
                    size="sm"
                    bg="blackAlpha.700"
                    color="white"
                    fontSize="xs"
                    px={1.5}
                  >
                    {blackContrast ? '✓ AA' : '✗ Fail'}
                  </Badge>
                </HStack>
              </Box>
              <VStack align="stretch" gap={0}>
                <Text fontSize="sm" fontWeight="600">
                  {shade}
                </Text>
                <Text fontSize="xs" color="muted" fontFamily="mono">
                  {color}
                </Text>
              </VStack>
            </VStack>
          );
        })}
      </Grid>
    </VStack>
  );
};

