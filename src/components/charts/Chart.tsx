import { Box, VStack, Text, HStack } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
  [key: string]: unknown; // Allow additional properties for multi-series data
}

export interface ChartProps {
  title?: string;
  data: ChartData[];
  type: 'line' | 'bar' | 'pie' | 'area';
  width?: number | string;
  height?: number;
  showLegend?: boolean;
  colorScheme?: 'brand' | 'secondary' | 'accent' | 'multi';
  xAxisKey?: string; // Key for X axis (default: 'label')
  yAxisKey?: string; // Key for Y axis (default: 'value')
  dataKey?: string; // Key for data series (default: 'value')
}

/**
 * Chart Component using Recharts
 * Supports Line, Bar, Pie, and Area charts
 * 
 * Install recharts: npm install recharts
 */
export function Chart({
  title,
  data,
  type,
  width = '100%',
  height = 300,
  showLegend = true,
  colorScheme = 'brand',
  xAxisKey = 'label',
  yAxisKey = 'value',
  dataKey = 'value',
}: ChartProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const gridColor = useColorModeValue('#E2E8F0', '#4A5568');

  // Color palettes based on theme
  const getColors = (): string[] => {
    if (colorScheme === 'multi') {
      return [
        useColorModeValue('#25521a', '#8fb887'), // brand
        useColorModeValue('#183d50', '#7eb6c8'), // secondary
        useColorModeValue('#be8900', '#ffc966'), // accent
        useColorModeValue('#dc2626', '#ef4444'), // red
        useColorModeValue('#ea580c', '#f97316'), // orange
        useColorModeValue('#ca8a04', '#eab308'), // yellow
      ];
    }
    
    const baseColor =
      colorScheme === 'brand'
        ? useColorModeValue('#25521a', '#8fb887')
        : colorScheme === 'secondary'
        ? useColorModeValue('#183d50', '#7eb6c8')
        : useColorModeValue('#be8900', '#ffc966');
    
    // Generate shades for same color scheme
    return [baseColor, baseColor + 'CC', baseColor + '99', baseColor + '66'];
  };

  const colors = getColors();

  // Format data for Recharts
  const chartData = data.map((item, index) => ({
    ...item,
    fill: item.color || colors[index % colors.length],
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          borderRadius="md"
          p={2}
          boxShadow="md"
        >
          <Text fontSize="sm" fontWeight="semibold" color={textPrimary} mb={1}>
            {payload[0].payload.label || payload[0].payload[xAxisKey]}
          </Text>
          {payload.map((entry: any, index: number) => (
            <Text key={index} fontSize="xs" color={textSecondary}>
              {entry.name || dataKey}: {entry.value?.toLocaleString('id-ID') || entry.value}
            </Text>
          ))}
        </Box>
      );
    }
    return null;
  };

  const renderLineChart = () => (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
          dataKey={xAxisKey}
          stroke={textSecondary}
          fontSize={12}
        />
        <YAxis 
          stroke={textSecondary}
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={colors[0]}
          strokeWidth={2}
          dot={{ fill: colors[0], r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
          dataKey={xAxisKey}
          stroke={textSecondary}
          fontSize={12}
        />
        <YAxis 
          stroke={textSecondary}
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderAreaChart = () => (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
          dataKey={xAxisKey}
          stroke={textSecondary}
          fontSize={12}
        />
        <YAxis 
          stroke={textSecondary}
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        {showLegend && <Legend />}
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={colors[0]}
          fill={colors[0]}
          fillOpacity={0.6}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => {
    return (
      <ResponsiveContainer width={width} height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      case 'area':
        return renderAreaChart();
      case 'pie':
        return renderPieChart();
      default:
        return null;
    }
  };

  return (
    <Card variant="elevated">
      {title && (
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
            {title}
          </Text>
        </CardHeader>
      )}
      <CardBody>
        <VStack gap={4}>
          <Box w="full" overflowX="auto">
            {renderChart()}
          </Box>
          {showLegend && type !== 'pie' && (
            <HStack wrap="wrap" gap={3} justify="center">
              {data.map((d, i) => (
                <HStack key={i} gap={2}>
                  <Box
                    w={3}
                    h={3}
                    borderRadius="sm"
                    bg={d.color || colors[i % colors.length]}
                  />
                  <Text fontSize="sm" color={textSecondary}>
                    {d.label}: {d.value.toLocaleString('id-ID')}
                  </Text>
                </HStack>
              ))}
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
}
