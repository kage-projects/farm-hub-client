import { Box, VStack, Text, HStack } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import { Card, CardBody, CardHeader } from '../surfaces/Card';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  title?: string;
  data: ChartData[];
  type: 'line' | 'bar' | 'pie' | 'area';
  width?: number;
  height?: number;
  showLegend?: boolean;
  colorScheme?: 'brand' | 'secondary' | 'accent' | 'multi';
}

/**
 * Chart Component - Native SVG implementation
 * Supports Line, Bar, Pie, and Area charts
 */
export function Chart({
  title,
  data,
  type,
  width = 600,
  height = 300,
  showLegend = true,
  colorScheme = 'brand',
}: ChartProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const bgColor = useColorModeValue('white', 'gray.800');
  const gridColor = useColorModeValue('gray.200', 'gray.700');

  const getColor = (index: number, customColor?: string) => {
    if (customColor) return customColor;
    if (colorScheme === 'multi') {
      const colors = [
        useColorModeValue('#25521a', '#8fb887'), // brand
        useColorModeValue('#183d50', '#7eb6c8'), // secondary
        useColorModeValue('#be8900', '#ffc966'), // accent
        useColorModeValue('#dc2626', '#ef4444'), // red
        useColorModeValue('#ea580c', '#f97316'), // orange
        useColorModeValue('#ca8a04', '#eab308'), // yellow
      ];
      return colors[index % colors.length];
    }
    const baseColor =
      colorScheme === 'brand'
        ? useColorModeValue('#25521a', '#8fb887')
        : colorScheme === 'secondary'
        ? useColorModeValue('#183d50', '#7eb6c8')
        : useColorModeValue('#be8900', '#ffc966');
    // Generate shades for multi-value
    const opacity = 0.6 + (index % 3) * 0.15;
    return baseColor + Math.round(opacity * 255).toString(16).padStart(2, '0');
  };

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const renderLineChart = () => {
    const points = data.map(
      (d, i) =>
        `${padding + (i / (data.length - 1 || 1)) * chartWidth},${
          padding + chartHeight - (d.value / maxValue) * chartHeight
        }`
    );
    const path = `M ${points.join(' L ')}`;

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + (chartHeight / 4) * i}
            x2={padding + chartWidth}
            y2={padding + (chartHeight / 4) * i}
            stroke={gridColor}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}
        {/* Line */}
        <path
          d={path}
          fill="none"
          stroke={getColor(0)}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Points */}
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1 || 1)) * chartWidth;
          const y = padding + chartHeight - (d.value / maxValue) * chartHeight;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={4} fill={getColor(0)} />
              <text
                x={x}
                y={y - 8}
                fontSize="10"
                fill={textPrimary}
                textAnchor="middle"
              >
                {d.value}
              </text>
            </g>
          );
        })}
        {/* Labels */}
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1 || 1)) * chartWidth;
          return (
            <text
              key={i}
              x={x}
              y={height - padding + 15}
              fontSize="11"
              fill={textSecondary}
              textAnchor="middle"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    );
  };

  const renderBarChart = () => {
    const barWidth = chartWidth / data.length - 10;
    const gap = 10;

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + (chartHeight / 4) * i}
            x2={padding + chartWidth}
            y2={padding + (chartHeight / 4) * i}
            stroke={gridColor}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}
        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * chartHeight;
          const x = padding + i * (barWidth + gap);
          const y = padding + chartHeight - barHeight;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={getColor(i, d.color)}
                rx={4}
              />
              <text
                x={x + barWidth / 2}
                y={y - 5}
                fontSize="10"
                fill={textPrimary}
                textAnchor="middle"
              >
                {d.value}
              </text>
            </g>
          );
        })}
        {/* Labels */}
        {data.map((d, i) => {
          const x = padding + i * (barWidth + gap) + barWidth / 2;
          return (
            <text
              key={i}
              x={x}
              y={height - padding + 15}
              fontSize="11"
              fill={textSecondary}
              textAnchor="middle"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    );
  };

  const renderAreaChart = () => {
    const points = data.map(
      (d, i) =>
        `${padding + (i / (data.length - 1 || 1)) * chartWidth},${
          padding + chartHeight - (d.value / maxValue) * chartHeight
        }`
    );
    const areaPath = `M ${padding},${padding + chartHeight} L ${points.join(' L ')} L ${padding + chartWidth},${padding + chartHeight} Z`;
    const linePath = `M ${points.join(' L ')}`;

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + (chartHeight / 4) * i}
            x2={padding + chartWidth}
            y2={padding + (chartHeight / 4) * i}
            stroke={gridColor}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}
        {/* Area */}
        <path d={areaPath} fill={getColor(0) + '40'} />
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={getColor(0)}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Points */}
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1 || 1)) * chartWidth;
          const y = padding + chartHeight - (d.value / maxValue) * chartHeight;
          return (
            <circle key={i} cx={x} cy={y} r={3} fill={getColor(0)} />
          );
        })}
        {/* Labels */}
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1 || 1)) * chartWidth;
          return (
            <text
              key={i}
              x={x}
              y={height - padding + 15}
              fontSize="11"
              fill={textSecondary}
              textAnchor="middle"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    );
  };

  const renderPieChart = () => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - padding;

    let currentAngle = -90; // Start from top
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {data.map((d, i) => {
          const sliceAngle = (d.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;

          const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
          const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
          const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
          const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

          const largeArc = sliceAngle > 180 ? 1 : 0;

          const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

          currentAngle = endAngle;

          return (
            <path
              key={i}
              d={path}
              fill={getColor(i, d.color)}
              stroke={bgColor}
              strokeWidth={2}
            />
          );
        })}
        {/* Labels */}
        {data.map((d, i) => {
          const sliceAngle = (d.value / total) * 360;
          const startAngle = -90 + data.slice(0, i).reduce((sum, item) => sum + (item.value / total) * 360, 0);
          const midAngle = startAngle + sliceAngle / 2;
          const labelRadius = radius * 0.7;
          const x = centerX + labelRadius * Math.cos((midAngle * Math.PI) / 180);
          const y = centerY + labelRadius * Math.sin((midAngle * Math.PI) / 180);
          return (
            <text
              key={i}
              x={x}
              y={y}
              fontSize="11"
              fill={textPrimary}
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="semibold"
            >
              {Math.round((d.value / total) * 100)}%
            </text>
          );
        })}
      </svg>
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
          {showLegend && (
            <HStack wrap="wrap" gap={3} justify="center">
              {data.map((d, i) => (
                <HStack key={i} gap={2}>
                  <Box
                    w={3}
                    h={3}
                    borderRadius="sm"
                    bg={getColor(i, d.color)}
                  />
                  <Text fontSize="sm" color={textSecondary}>
                    {d.label}: {d.value}
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

