import { Box } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';

/**
 * Ocean-themed gradient background with floating decorations
 * Fixed background that stays behind all content
 */
export const OceanBackground = ({ children }: { children: React.ReactNode }) => {
  const bgGradient = useColorModeValue(
    "linear(to-br, sky.100, cyan.200, blue.200)",
    "linear(to-br, blue.900, cyan.900, teal.900)"
  );

  const orb1Gradient = useColorModeValue(
    'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)'
  );

  const orb2Gradient = useColorModeValue(
    'radial-gradient(circle, rgba(14, 116, 144, 0.25) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)'
  );

  const floatingOrbGradient = useColorModeValue(
    'radial(cyan.300, transparent)',
    'radial(cyan.600, transparent)'
  );

  return (
    <>
      {/* Fixed Background Layer */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={-1}
        bgGradient={bgGradient}
        overflow="hidden"
        css={{
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
            '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          },
        }}
      >
        {/* Top Left Floating Orb */}
        <Box
          position="absolute"
          top="-10%"
          left="-5%"
          width="60%"
          height="60%"
          background={orb1Gradient}
          borderRadius="50%"
          filter="blur(60px)"
          pointerEvents="none"
          css={{
            animation: 'float 20s ease-in-out infinite',
          }}
        />

        {/* Bottom Right Floating Orb */}
        <Box
          position="absolute"
          bottom="-10%"
          right="-5%"
          width="50%"
          height="50%"
          background={orb2Gradient}
          borderRadius="50%"
          filter="blur(60px)"
          pointerEvents="none"
          css={{
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />

        {/* Small Floating Decoration */}
        <Box
          position="absolute"
          top="20%"
          right="10%"
          width="300px"
          height="300px"
          bgGradient={floatingOrbGradient}
          opacity={0.3}
          filter="blur(60px)"
          pointerEvents="none"
        />
      </Box>

      {/* Content Layer */}
      {children}
    </>
  );
};