import { Box, VStack, HStack, Text, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useColorModeValue } from '../ui/color-mode';
import { Card } from '../surfaces/Card';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  colorScheme?: 'green' | 'red' | 'yellow' | 'brand' | 'secondary' | 'accent';
  variant?: 'elevated' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Stat Card untuk menampilkan metrics/statistics
 * - Label, value, optional icon
 * - Trend indicator (optional)
 * - Multiple variants & sizes
 */
export function StatCard({
  label,
  value,
  icon,
  trend,
  colorScheme,
  variant,
  size = 'md',
}: StatCardProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  
  // Determine trend color
  const getTrendColor = () => {
    if (colorScheme === 'green') return useColorModeValue('green.600', 'green.400');
    if (colorScheme === 'red') return useColorModeValue('red.600', 'red.400');
    if (colorScheme === 'yellow') return useColorModeValue('yellow.600', 'yellow.400');
    if (trend === 'up') return useColorModeValue('green.600', 'green.400');
    if (trend === 'down') return useColorModeValue('red.600', 'red.400');
    return useColorModeValue('gray.600', 'gray.400');
  };
  
  const trendColor = getTrendColor();

  const sizeStyles = {
    sm: { padding: 3, fontSize: 'lg' },
    md: { padding: 4, fontSize: 'xl' },
    lg: { padding: 6, fontSize: '2xl' },
  };

  return (
    <Card variant={variant || 'elevated'}>
      <VStack align="stretch" gap={3}>
        <HStack justify="space-between" w="full">
          <Text fontSize="sm" color={textSecondary} fontWeight="medium">
            {label}
          </Text>
          {icon && <Box fontSize="xl">{icon}</Box>}
        </HStack>
        <Heading 
          fontSize={size === 'sm' ? 'lg' : size === 'lg' ? '2xl' : 'xl'} 
          fontWeight="bold"
          color={textPrimary}
        >
          {value}
        </Heading>
        {trend && trend !== 'neutral' && (
          <HStack gap={1}>
            <Text fontSize="xs" color={trendColor} fontWeight="semibold">
              {trend === 'up' ? '↑' : '↓'} {trend === 'up' ? 'Naik' : 'Turun'}
            </Text>
          </HStack>
        )}
      </VStack>
    </Card>
  );
}

