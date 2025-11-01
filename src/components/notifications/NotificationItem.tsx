import { HStack, VStack, Text, Box, Badge } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import type { Notification } from '../../data/mockNotifications';
import { getNotificationIcon, getNotificationColor } from '../../data/mockNotifications';
import { Button } from '../button/Button';
import { useNavigate } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';

export interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
  onAction?: (notification: Notification) => void;
}

/**
 * Notification Item Component
 * - Display single notification
 * - Read/unread indicator
 * - Action button
 */
export function NotificationItem({ notification, onRead, onAction }: NotificationItemProps) {
  const navigate = useNavigate();
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const unreadBg = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const icon = getNotificationIcon(notification.type);
  const priorityColor = getNotificationColor(notification.priority);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} menit lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam lalu`;
    } else {
      return `${diffDays} hari lalu`;
    }
  };

  const handleClick = () => {
    if (!notification.read && onRead) {
      onRead(notification.id);
    }
    if (notification.actionUrl && onAction) {
      onAction(notification);
      navigate(notification.actionUrl);
    }
  };

  return (
    <Box
      p={4}
      borderRadius="md"
      border="1px solid"
      borderColor={borderColor}
      bg={!notification.read ? unreadBg : 'transparent'}
      cursor="pointer"
      onClick={handleClick}
      _hover={{
        bg: useColorModeValue('gray.50', 'gray.800'),
      }}
      position="relative"
    >
      {!notification.read && (
        <Box
          position="absolute"
          top={2}
          right={2}
          w={2}
          h={2}
          borderRadius="full"
          bg="blue.500"
        />
      )}
      
      <HStack align="start" gap={3}>
        <Box fontSize="2xl">{icon}</Box>
        <VStack align="start" gap={2} flex={1}>
          <HStack justify="space-between" w="full" align="start">
            <VStack align="start" gap={1} flex={1}>
              <HStack gap={2}>
                <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>
                  {notification.title}
                </Text>
                <Badge colorScheme={priorityColor} variant="subtle" fontSize="xs">
                  {notification.priority}
                </Badge>
              </HStack>
              <Text fontSize="xs" color={textSecondary} lineHeight="tall">
                {notification.message}
              </Text>
            </VStack>
          </HStack>

          <HStack justify="space-between" w="full" fontSize="xs" color={textSecondary}>
            <HStack gap={1}>
              <FiClock size={12} />
              <Text>{formatTimeAgo(notification.timestamp)}</Text>
            </HStack>
            {notification.actionUrl && notification.actionLabel && (
              <Button
                variant="link"
                colorScheme="brand"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAction) onAction(notification);
                  navigate(notification.actionUrl!);
                }}
              >
                {notification.actionLabel} →
              </Button>
            )}
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
}

