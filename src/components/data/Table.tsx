import { Table as ChakraTable, Box, HStack } from '@chakra-ui/react';
import { useState } from 'react';
import { useColorModeValue } from '../ui/color-mode';

/**
 * Table column configuration
 */
export interface TableColumn<T = any> {
  /** Column header */
  header: string;
  /** Key to access data */
  accessor: keyof T | ((row: T) => React.ReactNode);
  /** Enable sorting for this column */
  sortable?: boolean;
  /** Numeric column (right-aligned) */
  isNumeric?: boolean;
}

/**
 * Table component props
 */
export interface TableProps<T = any> {
  /** Column definitions */
  columns: TableColumn<T>[];
  /** Table data */
  data: T[];
  /** Table variant */
  variant?: 'simple' | 'striped';
  /** Enable row hover */
  hoverable?: boolean;
}

/**
 * Table component with client-side sorting
 * - Simple and striped variants
 * - Sortable columns (click header)
 * - Row hover effects
 * - Semantic header styling
 */
export function Table<T extends Record<string, any>>({
  columns,
  data,
  variant = 'simple',
  hoverable = true,
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (accessor: keyof T | ((row: T) => React.ReactNode)) => {
    if (typeof accessor === 'function') return;

    if (sortColumn === accessor) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(accessor);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;

    const aVal = a[sortColumn];
    const bVal = b[sortColumn];

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getCellValue = (row: T, accessor: keyof T | ((row: T) => React.ReactNode)) => {
    return typeof accessor === 'function' ? accessor(row) : row[accessor];
  };

  // Color mode aware styling
  const headerBg = useColorModeValue('gray.100', 'gray.800');
  const headerHoverBg = useColorModeValue('gray.200', 'gray.700');
  const headerTextColor = useColorModeValue('gray.900', 'gray.50');
  const rowHoverBg = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cellTextColor = useColorModeValue('gray.800', 'gray.200');

  return (
    <Box overflowX="auto">
      <ChakraTable.Root variant={variant}>
        <ChakraTable.Header>
          <ChakraTable.Row bg={headerBg}>
            {columns.map((column, index) => {
              const accessor = column.accessor;
              const isSortable = column.sortable && typeof accessor !== 'function';
              const isSorted = sortColumn === accessor;

              return (
                <ChakraTable.ColumnHeader
                  key={index}
                  textAlign={column.isNumeric ? 'end' : 'start'}
                  fontWeight="600"
                  textTransform="none"
                  borderColor={borderColor}
                  color={headerTextColor}
                  cursor={isSortable ? 'pointer' : 'default'}
                  onClick={() => isSortable && handleSort(accessor as keyof T)}
                  _hover={isSortable ? { bg: headerHoverBg } : undefined}
                >
                  <HStack justify={column.isNumeric ? 'flex-end' : 'flex-start'} gap={2}>
                    <span>{column.header}</span>
                    {isSortable && (
                      <span style={{ fontSize: '0.75rem', opacity: isSorted ? 1 : 0.3 }}>
                        {isSorted && sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </HStack>
                </ChakraTable.ColumnHeader>
              );
            })}
          </ChakraTable.Row>
        </ChakraTable.Header>
        <ChakraTable.Body>
          {sortedData.map((row, rowIndex) => (
            <ChakraTable.Row
              key={rowIndex}
              _hover={hoverable ? { bg: rowHoverBg } : undefined}
            >
              {columns.map((column, colIndex) => (
                <ChakraTable.Cell
                  key={colIndex}
                  textAlign={column.isNumeric ? 'end' : 'start'}
                  borderColor={borderColor}
                  color={cellTextColor}
                >
                  {getCellValue(row, column.accessor)}
                </ChakraTable.Cell>
              ))}
            </ChakraTable.Row>
          ))}
        </ChakraTable.Body>
      </ChakraTable.Root>
    </Box>
  );
}

