import { Box, Text } from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';

/**
 * Floating bubble decoration for ocean theme
 */
export const FloatingBubbles = () => {
  const bubbleColor = useColorModeValue('rgba(6, 182, 212, 0.2)', 'rgba(34, 211, 238, 0.15)');
  const bubbleBorder = useColorModeValue('rgba(6, 182, 212, 0.3)', 'rgba(34, 211, 238, 0.25)');

  return (
    <>
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          position="absolute"
          borderRadius="full"
          bg={bubbleColor}
          border="1px solid"
          borderColor={bubbleBorder}
          backdropFilter="blur(2px)"
          pointerEvents="none"
          opacity={0.6}
          css={{
            left: `${15 + i * 15}%`,
            bottom: '-20px',
            width: `${30 + i * 10}px`,
            height: `${30 + i * 10}px`,
            animation: `bubble ${5 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
      <style>
        {`
          @keyframes bubble {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 0.6;
            }
            90% {
              opacity: 0.3;
            }
            100% {
              transform: translateY(-100vh) scale(1.5);
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  );
};

/**
 * Wave decoration for ocean theme
 */
export const WaveDecoration = () => {
  const waveColor1 = useColorModeValue('rgba(6, 182, 212, 0.1)', 'rgba(6, 182, 212, 0.05)');
  const waveColor2 = useColorModeValue('rgba(14, 116, 144, 0.08)', 'rgba(14, 116, 144, 0.04)');

  return (
    <Box position="absolute" bottom={0} left={0} right={0} overflow="hidden" pointerEvents="none">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '80px', transform: 'scaleY(-1)' }}
      >
        <path
          d="M0,0 C150,60 350,0 600,40 C850,80 1050,20 1200,60 L1200,120 L0,120 Z"
          fill={waveColor1}
        />
        <path
          d="M0,20 C200,80 400,20 600,60 C800,100 1000,40 1200,80 L1200,120 L0,120 Z"
          fill={waveColor2}
          style={{ opacity: 0.7 }}
        />
      </svg>
    </Box>
  );
};

/**
 * Fish/Marine life decorative element
 */
export const MarineDecor = () => {
  return (
    <Box position="absolute" top="40%" right="5%" opacity={0.15} pointerEvents="none" zIndex={0}>
      <Text fontSize="8xl" transform="rotate(-15deg)">
        🐠
      </Text>
    </Box>
  );
};

