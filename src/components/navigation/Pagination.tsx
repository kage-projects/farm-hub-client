import { HStack, Button, Text, Box } from '@chakra-ui/react';

/**
 * Pagination component props
 */
export interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Number of page buttons to show (default: 5) */
  siblingCount?: number;
}

/**
 * Pagination component
 * - Previous/Next buttons
 * - Page number buttons
 * - Current page highlighted in brand solid
 * - Ellipsis for large page counts
 */
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) => {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Always show first page
    pages.push(1);

    // Left dots
    if (shouldShowLeftDots) {
      pages.push('...');
    }

    // Middle pages
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Right dots
    if (shouldShowRightDots) {
      pages.push('...');
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <HStack gap={1}>
      {/* Previous Button */}
      <Button
        size="sm"
        variant="outline"
        colorPalette="brand"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Prev
      </Button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <Box key={`dots-${index}`} px={2}>
              <Text color="gray.500">...</Text>
            </Box>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Button
            key={pageNum}
            size="sm"
            variant={isActive ? 'solid' : 'ghost'}
            colorPalette="brand"
            onClick={() => onPageChange(pageNum)}
            fontWeight={isActive ? 600 : 400}
            minW="8"
          >
            {pageNum}
          </Button>
        );
      })}

      {/* Next Button */}
      <Button
        size="sm"
        variant="outline"
        colorPalette="brand"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next →
      </Button>
    </HStack>
  );
};

