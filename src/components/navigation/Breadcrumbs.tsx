import { Breadcrumb, Box, Link, Text } from '@chakra-ui/react';

/**
 * Breadcrumb item configuration
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

/**
 * Breadcrumbs component props
 */
export interface BreadcrumbsProps {
  /** Breadcrumb items to display */
  items: BreadcrumbItem[];
  /** Custom separator */
  separator?: React.ReactNode;
  /** Maximum label length before truncation */
  maxLength?: number;
}

/**
 * Breadcrumbs navigation component
 * - Separators between items
 * - Truncates long labels
 * - Highlights current page
 * - Accessible with aria-current
 */
export const Breadcrumbs = ({
  items,
  separator = '/',
  maxLength = 30,
}: BreadcrumbsProps) => {
  const truncateLabel = (label: string) => {
    if (label.length <= maxLength) return label;
    return `${label.slice(0, maxLength)}...`;
  };

  return (
    <Breadcrumb.Root separator={separator} fontSize="sm">
      <Breadcrumb.List>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.isCurrentPage || isLast;

          return (
            <Breadcrumb.Item key={index}>
              {isCurrent ? (
                <Breadcrumb.CurrentLink
                  color="gray.800"
                  fontWeight="600"
                >
                  {truncateLabel(item.label)}
                </Breadcrumb.CurrentLink>
              ) : (
                <Breadcrumb.Link
                  href={item.href}
                  color="brand.600"
                  _hover={{ textDecoration: 'underline' }}
                >
                  {truncateLabel(item.label)}
                </Breadcrumb.Link>
              )}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
};

