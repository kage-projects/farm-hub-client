import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  Button as ChakraButton,
} from '@chakra-ui/react';
import { ColorSwatch } from '../../components/ColorSwatch';
import { colors } from '../../theme';
import { Button } from '../../components/button/Button';
import { Tag } from '../../components/badges/Tag';
import { Input } from '../../components/forms/Input';
import { Navbar } from '../../components/navbar/Navbar';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/surfaces/Card';
import { Alert } from '../../components/feedback/Alert';
import { useColorModeValue } from '../../components/ui/color-mode';
import { FloatingBubbles, WaveDecoration } from '../../components/OceanDecorations';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const borderColor = useColorModeValue('brand.600', 'brand.400');
  
  return (
    <VStack align="stretch" gap={6} py={8}>
      <Box borderBottom="3px solid" borderColor={borderColor} pb={2}>
        <Heading size="xl">{title}</Heading>
      </Box>
      {children}
    </VStack>
  );
};

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const titleColor = useColorModeValue('brand.700', 'brand.400');
  
  return (
    <VStack align="stretch" gap={4}>
      <Text fontSize="lg" fontWeight="700" color={titleColor}>
        {title}
      </Text>
      {children}
    </VStack>
  );
};

export default function UIShowcasePage() {
  const [inputValue, setInputValue] = useState('');
  
  // Dark mode aware colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const sectionBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('brand.700', 'brand.400');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <Box 
      minH="100vh"
      position="relative"
      overflow="hidden"
      bg={useColorModeValue(
        'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)',
        'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0e7490 100%)'
      )}
      _before={{
        content: '""',
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '60%',
        height: '60%',
        background: useColorModeValue(
          'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
          'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)'
        ),
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        animation: 'float 20s ease-in-out infinite',
      }}
      _after={{
        content: '""',
        position: 'absolute',
        bottom: '-10%',
        right: '-5%',
        width: '50%',
        height: '50%',
        background: useColorModeValue(
          'radial-gradient(circle, rgba(14, 116, 144, 0.25) 0%, transparent 70%)',
          'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)'
        ),
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        animation: 'float 25s ease-in-out infinite reverse',
      }}
      sx={{
        '@keyframes float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      }}
    >
      {/* Ocean Decorations */}
      <FloatingBubbles />
      <WaveDecoration />
      
      {/* Navbar Demo */}
      <Navbar
        links={navLinks}
        cta={{ label: 'Get Started', href: '/start' }}
        user={{ name: 'John Doe' }}
        brandName="Farm Hub"
        overHero={true}
      />

      <Container maxW="7xl" py={8} position="relative" zIndex={1}>
        <VStack align="stretch" gap={8}>
          {/* Hero Header */}
          <Box textAlign="center" py={12} position="relative">
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              width="400px"
              height="400px"
              bg={useColorModeValue(
                'radial-gradient(circle, rgba(8, 145, 178, 0.1) 0%, transparent 70%)',
                'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)'
              )}
              filter="blur(40px)"
              pointerEvents="none"
              zIndex={0}
            />
            <VStack gap={4} position="relative" zIndex={1}>
              <HStack fontSize="5xl" gap={4} opacity={0.9}>
                <Text>🐟</Text>
                <Text>🦐</Text>
                <Text>🦀</Text>
              </HStack>
              <Heading 
                size="3xl" 
                fontWeight="800"
                bgGradient={useColorModeValue(
                  'linear(to-r, cyan.700, cyan.900, teal.800)',
                  'linear(to-r, cyan.300, cyan.100, teal.200)'
                )}
                bgClip="text"
                letterSpacing="tight"
              >
                Farm Hub
              </Heading>
              <Heading size="xl" fontWeight="400" color={mutedColor}>
                🌊 Aquatic Farming Solutions
              </Heading>
              <Text fontSize="lg" color={mutedColor} maxW="2xl" textAlign="center">
                Modern component library for marine aquaculture management
              </Text>
              <HStack gap={2} mt={4}>
                <Tag colorScheme="info" variant="subtle" size="md">🐠 Fish Farming</Tag>
                <Tag colorScheme="info" variant="subtle" size="md">🦐 Shrimp</Tag>
                <Tag colorScheme="info" variant="subtle" size="md">🦞 Lobster</Tag>
              </HStack>
            </VStack>
          </Box>

          <Box borderBottom="2px solid" borderColor={borderColor} />

          {/* Color Palette */}
          <Section title="🎨 Color Palette - Ocean Inspired">
            <VStack align="stretch" gap={8}>
              <ColorSwatch name="Brand (Primary)" palette={colors.brand} />
              <ColorSwatch name="Secondary (Teal)" palette={colors.secondary} />
              <ColorSwatch name="Accent (Amber)" palette={colors.accent} />
            </VStack>
          </Section>

          <Box borderBottom="2px solid" borderColor={borderColor} />

          {/* Buttons */}
          <Section title="🔘 Buttons">
            <SubSection title="Button Variants - Solid">
              <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" fontWeight="600">Brand</Text>
                  <HStack>
                    <Button colorScheme="brand" size="sm">Small</Button>
                    <Button colorScheme="brand" size="md">Medium</Button>
                    <Button colorScheme="brand" size="lg">Large</Button>
                  </HStack>
                </VStack>

                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" fontWeight="600">Secondary</Text>
                  <HStack>
                    <Button colorScheme="secondary" size="sm">Small</Button>
                    <Button colorScheme="secondary" size="md">Medium</Button>
                    <Button colorScheme="secondary" size="lg">Large</Button>
                  </HStack>
                </VStack>

                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" fontWeight="600">Accent</Text>
                  <HStack>
                    <Button colorScheme="accent" size="sm">Small</Button>
                    <Button colorScheme="accent" size="md">Medium</Button>
                    <Button colorScheme="accent" size="lg">Large</Button>
                  </HStack>
                </VStack>

                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" fontWeight="600">Destructive</Text>
                  <HStack>
                    <Button colorScheme="destructive" size="sm">Small</Button>
                    <Button colorScheme="destructive" size="md">Medium</Button>
                    <Button colorScheme="destructive" size="lg">Large</Button>
                  </HStack>
                </VStack>
              </Grid>
            </SubSection>

            <SubSection title="Button Variants - Outline">
              <HStack wrap="wrap" gap={3}>
                <Button colorScheme="brand" variant="outline">Brand</Button>
                <Button colorScheme="secondary" variant="outline">Secondary</Button>
                <Button colorScheme="accent" variant="outline">Accent</Button>
                <Button colorScheme="destructive" variant="outline">Destructive</Button>
              </HStack>
            </SubSection>

            <SubSection title="Button Variants - Ghost">
              <HStack wrap="wrap" gap={3}>
                <Button colorScheme="brand" variant="ghost">Brand</Button>
                <Button colorScheme="secondary" variant="ghost">Secondary</Button>
                <Button colorScheme="accent" variant="ghost">Accent</Button>
                <Button colorScheme="destructive" variant="ghost">Destructive</Button>
              </HStack>
            </SubSection>

            <SubSection title="Button States">
              <HStack wrap="wrap" gap={4}>
                <Button>Normal</Button>
                <Button loading>Loading</Button>
                <Button loading loadingText="Processing">Loading Text</Button>
                <Button disabled>Disabled</Button>
              </HStack>
            </SubSection>
          </Section>

          <Box borderBottom="2px solid" borderColor={borderColor} />

          {/* Badges */}
          <Section title="🏷️ Badges & Tags">
            <SubSection title="Solid Variant">
              <HStack wrap="wrap" gap={3}>
                <Tag variant="solid" colorScheme="brand">Brand</Tag>
                <Tag variant="solid" colorScheme="secondary">Secondary</Tag>
                <Tag variant="solid" colorScheme="accent">Accent</Tag>
                <Tag variant="solid" colorScheme="success">Success</Tag>
                <Tag variant="solid" colorScheme="error">Error</Tag>
              </HStack>
            </SubSection>

            <SubSection title="Subtle Variant">
              <HStack wrap="wrap" gap={3}>
                <Tag variant="subtle" colorScheme="brand">Brand</Tag>
                <Tag variant="subtle" colorScheme="secondary">Secondary</Tag>
                <Tag variant="subtle" colorScheme="accent">Accent</Tag>
                <Tag variant="subtle" colorScheme="success">Success</Tag>
                <Tag variant="subtle" colorScheme="error">Error</Tag>
              </HStack>
            </SubSection>

            <SubSection title="Outline Variant">
              <HStack wrap="wrap" gap={3}>
                <Tag variant="outline" colorScheme="brand">Brand</Tag>
                <Tag variant="outline" colorScheme="secondary">Secondary</Tag>
                <Tag variant="outline" colorScheme="accent">Accent</Tag>
              </HStack>
            </SubSection>

            <SubSection title="Sizes">
              <HStack wrap="wrap" gap={3}>
                <Tag size="sm">Small</Tag>
                <Tag size="md">Medium</Tag>
                <Tag size="lg">Large</Tag>
              </HStack>
            </SubSection>
          </Section>

          <Box borderBottom="2px solid" borderColor={borderColor} />

          {/* Form Controls */}
          <Section title="📝 Form Controls">
            <SubSection title="Input Examples">
              <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4}>
                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" fontWeight="600">Normal Input</Text>
                  <Input 
                    placeholder="Enter text..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </VStack>

                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" fontWeight="600">Disabled</Text>
                  <Input placeholder="Disabled" disabled />
                </VStack>

                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" fontWeight="600">Invalid</Text>
                  <Input placeholder="Invalid" invalid />
                </VStack>
              </Grid>
            </SubSection>
          </Section>

          <Box borderBottom="2px solid" borderColor={borderColor} />

          {/* Cards */}
          <Section title="🎴 Cards">
            <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4}>
              <Card variant="glass">
                <CardHeader>
                  <Heading size="md">Glass Card</Heading>
                </CardHeader>
                <CardBody>
                  <Text color={mutedColor}>
                    Glass card with blur effect and transparency.
                  </Text>
                </CardBody>
                <CardFooter>
                  <ChakraButton size="sm" colorPalette="brand">
                    Action
                  </ChakraButton>
                </CardFooter>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <Heading size="md">Elevated Glass</Heading>
                </CardHeader>
                <CardBody>
                  <Text color={mutedColor}>
                    Elevated with stronger glass effect and shadow.
                  </Text>
                </CardBody>
                <CardFooter>
                  <HStack>
                    <ChakraButton size="sm" variant="outline" colorPalette="brand">
                      Cancel
                    </ChakraButton>
                    <ChakraButton size="sm" colorPalette="brand">
                      Confirm
                    </ChakraButton>
                  </HStack>
                </CardFooter>
              </Card>
            </Grid>
          </Section>

          <Box borderBottom="2px solid" borderColor={borderColor} />

          {/* Alerts */}
          <Section title="⚠️ Alerts">
            <SubSection title="Subtle Variant">
              <VStack align="stretch" gap={3}>
                <Alert
                  status="success"
                  variant="subtle"
                  title="Success!"
                  description="Your changes have been saved successfully."
                />
                <Alert
                  status="info"
                  variant="subtle"
                  title="Info"
                  description="New features are available."
                />
                <Alert
                  status="warning"
                  variant="subtle"
                  title="Warning"
                  description="Your session will expire soon."
                />
                <Alert
                  status="error"
                  variant="subtle"
                  title="Error"
                  description="Something went wrong."
                />
              </VStack>
            </SubSection>

            <SubSection title="Solid Variant">
              <VStack align="stretch" gap={3}>
                <Alert status="success" variant="solid" title="Success - Solid" />
                <Alert status="info" variant="solid" title="Info - Solid" />
                <Alert status="warning" variant="solid" title="Warning - Solid" />
                <Alert status="error" variant="solid" title="Error - Solid" />
              </VStack>
            </SubSection>
          </Section>

          {/* Footer */}
          <Box 
            py={12} 
            textAlign="center" 
            position="relative"
            mt={8}
          >
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              height="1px"
              bg={useColorModeValue(
                'linear-gradient(90deg, transparent, cyan.300, transparent)',
                'linear-gradient(90deg, transparent, cyan.600, transparent)'
              )}
              opacity={0.5}
            />
            <VStack gap={3} position="relative" zIndex={1}>
              <HStack fontSize="2xl" gap={3} opacity={0.7}>
                <Text>🐙</Text>
                <Text>🐚</Text>
                <Text>🌊</Text>
              </HStack>
              <Heading 
                size="lg"
                bgGradient={useColorModeValue(
                  'linear(to-r, cyan.600, teal.600)',
                  'linear(to-r, cyan.300, teal.300)'
                )}
                bgClip="text"
              >
                Farm Hub - Aquatic Solutions
              </Heading>
              <Text color={mutedColor} fontSize="sm">
                Built with Chakra UI v3 • TypeScript • Glassmorphism Design
              </Text>
              <Text fontSize="xs" color={mutedColor} opacity={0.8}>
                🌓 Toggle dark/light mode • 🌊 Ocean-inspired design • ♿ WCAG AA
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}












