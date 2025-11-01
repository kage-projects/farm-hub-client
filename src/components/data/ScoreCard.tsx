import { VStack, HStack, Text, Box } from '@chakra-ui/react';
import { Card, CardBody } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';

export interface ScoreCardProps {
  score: number;
  label?: string;
  breakdown?: Array<{ label: string; score: number; maxScore: number }>;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Circular Progress Component - Custom implementation
 */
function CircularProgress({
  value,
  size,
  color,
  bgColor,
  thickness = 8,
  children,
}: {
  value: number;
  size: number;
  color: string;
  bgColor?: string;
  thickness?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const defaultBgColor = bgColor || useColorModeValue('gray.200', 'gray.700');

  return (
    <Box position="relative" width={size} height={size}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={defaultBgColor}
          strokeWidth={thickness}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />
      </svg>
      {children && (
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {children}
        </Box>
      )}
    </Box>
  );
}

/**
 * Score Card untuk menampilkan skor kelayakan (0-100)
 * - Circular progress indicator
 * - Color coding (red/yellow/green)
 * - Optional breakdown per aspek
 */
export function ScoreCard({
  score,
  label = 'Skor Kelayakan',
  breakdown,
  size = 'md',
}: ScoreCardProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  // Determine color based on score
  const getScoreColor = (sc: number) => {
    if (sc < 50) return useColorModeValue('red.500', 'red.400');
    if (sc < 70) return useColorModeValue('yellow.500', 'yellow.400');
    return useColorModeValue('green.500', 'green.400');
  };

  const getScoreColorName = (sc: number) => {
    if (sc < 50) return 'red';
    if (sc < 70) return 'yellow';
    return 'green';
  };

  const scoreColor = getScoreColor(score);
  const sizeValue = size === 'sm' ? 120 : size === 'lg' ? 200 : 160;

  return (
    <Card variant="elevated">
      <CardBody>
        <VStack gap={4}>
          <VStack gap={2}>
            <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
              {label}
            </Text>
            <CircularProgress
              value={score}
              size={sizeValue}
              color={scoreColor as string}
              bgColor={useColorModeValue('gray.200', 'gray.700')}
              thickness={8}
            >
              <Text fontSize="2xl" fontWeight="bold" color={textPrimary}>
                {score}
              </Text>
            </CircularProgress>
          </VStack>

          {breakdown && breakdown.length > 0 && (
            <VStack align="stretch" gap={2} w="full">
              <Text fontSize="sm" fontWeight="medium" color={textSecondary} mb={2}>
                Breakdown:
              </Text>
              {breakdown.map((item, index) => (
                <HStack key={index} justify="space-between" align="center">
                  <Text fontSize="sm" color={textSecondary}>
                    {item.label}
                  </Text>
                  <HStack gap={2}>
                    <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                      {item.score}/{item.maxScore}
                    </Text>
                    <Box
                      w="100px"
                      h="6px"
                      bg={useColorModeValue('gray.200', 'gray.700')}
                      borderRadius="full"
                      overflow="hidden"
                    >
                      <Box
                        w={`${(item.score / item.maxScore) * 100}%`}
                        h="100%"
                        bg={`${getScoreColorName((item.score / item.maxScore) * 100)}.500`}
                      />
                    </Box>
                  </HStack>
                </HStack>
              ))}
            </VStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}

