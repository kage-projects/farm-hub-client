import { HStack, VStack, Badge, Text, Heading, IconButton, Box } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '../surfaces/Card';
import { Button } from '../button/Button';
import { useColorModeValue } from '../ui/color-mode';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

export interface ProjectCardProps {
  id: string;
  name: string;
  location: string;
  fishType: string;
  status: 'draft' | 'generating' | 'completed';
  createdAt: Date | string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

/**
 * Project Card untuk menampilkan project di dashboard
 * - Project info (name, location, fish type)
 * - Status badge
 * - Action buttons (view, edit, delete)
 */
export function ProjectCard({
  id,
  name,
  location,
  fishType,
  status,
  createdAt,
  onView,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const iconColor = useColorModeValue('gray.600', 'gray.300');

  const statusConfig = {
    draft: { label: 'Draft', color: 'gray' as const },
    generating: { label: 'Generating', color: 'blue' as const },
    completed: { label: 'Completed', color: 'green' as const },
  };

  const statusInfo = statusConfig[status];
  const dateStr = typeof createdAt === 'string' ? createdAt : new Date(createdAt).toLocaleDateString('id-ID');

  return (
    <Card variant="elevated">
      <CardHeader>
        <HStack justify="space-between" align="start">
          <VStack align="start" gap={1} flex={1}>
            <Heading fontSize="lg" fontWeight="semibold" color={textPrimary}>
              {name}
            </Heading>
            <Text fontSize="sm" color={textSecondary}>
              {location}
            </Text>
          </VStack>
          <Badge colorPalette={statusInfo.color} variant="subtle">
            {statusInfo.label}
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="start" gap={2}>
          <HStack>
            <Text fontSize="sm" fontWeight="medium" color={textSecondary}>
              Jenis Ikan:
            </Text>
            <Text fontSize="sm" color={textPrimary}>
              {fishType}
            </Text>
          </HStack>
          <Text fontSize="xs" color={textSecondary}>
            Dibuat: {dateStr}
          </Text>
        </VStack>
      </CardBody>
      <CardFooter>
        <HStack gap={2} w="full" justify="flex-end">
          {onView && (
            <IconButton
              aria-label="View project"
              variant="ghost"
              size="sm"
              onClick={() => onView(id)}
              color={iconColor}
              _hover={{
                bg: useColorModeValue('gray.100', 'whiteAlpha.200'),
                color: useColorModeValue('gray.700', 'white'),
              }}
            >
              <FiEye />
            </IconButton>
          )}
          {onEdit && (
            <IconButton
              aria-label="Edit project"
              variant="ghost"
              size="sm"
              onClick={() => onEdit(id)}
              color={iconColor}
              _hover={{
                bg: useColorModeValue('gray.100', 'whiteAlpha.200'),
                color: useColorModeValue('gray.700', 'white'),
              }}
            >
              <FiEdit2 />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              aria-label="Delete project"
              variant="ghost"
              size="sm"
              colorPalette="red"
              onClick={() => onDelete(id)}
              _hover={{
                bg: useColorModeValue('red.50', 'red.900'),
                color: useColorModeValue('red.600', 'red.300'),
              }}
            >
              <FiTrash2 />
            </IconButton>
          )}
          {onView && (
            <Button
              variant="solid"
              colorScheme="brand"
              size="sm"
              onClick={() => onView(id)}
            >
              Lihat Detail
            </Button>
          )}
        </HStack>
      </CardFooter>
    </Card>
  );
}

