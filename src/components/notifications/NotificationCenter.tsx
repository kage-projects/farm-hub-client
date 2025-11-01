import { VStack, HStack, Text, Box, Badge, Button } from '@chakra-ui/react';
import { Card, CardBody, CardHeader } from '../surfaces/Card';
import { useColorModeValue } from '../ui/color-mode';
import { NotificationItem } from './NotificationItem';
import type { Notification } from '../../data/mockNotifications';
import { mockNotifications } from '../../data/mockNotifications';
import { useState, useMemo } from 'react';
import { FiBell, FiCheck } from 'react-icons/fi';

export interface NotificationCenterProps {
  onNotificationClick?: (notification: Notification) => void;
}

/**
 * Notification Center Component
 * - List all notifications
 * - Mark as read
 * - Filter by type/priority
 */
export function NotificationCenter({ onNotificationClick }: NotificationCenterProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const handleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleAction = (notification: Notification) => {
    if (!notification.read) {
      handleRead(notification.id);
    }
    onNotificationClick?.(notification);
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <HStack justify="space-between" align="center">
          <HStack gap={2}>
            <Box fontSize="lg" color="brand.600">
              <FiBell />
            </Box>
            <VStack align="start" gap={0}>
              <Text fontSize="md" fontWeight="semibold" color={textPrimary}>
                Notifikasi
              </Text>
              {unreadCount > 0 && (
                <Badge colorScheme="blue" variant="solid" fontSize="xs">
                  {unreadCount} belum dibaca
                </Badge>
              )}
            </VStack>
          </HStack>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              leftIcon={<FiCheck />}
            >
              Tandai Semua Dibaca
            </Button>
          )}
        </HStack>
      </CardHeader>
      <CardBody p={0}>
        {notifications.length === 0 ? (
          <Box textAlign="center" py={8} px={4}>
            <Text fontSize="sm" color={textSecondary}>
              Tidak ada notifikasi
            </Text>
          </Box>
        ) : (
          <VStack align="stretch" gap={0}>
            {notifications.map((notification) => (
              <Box key={notification.id} px={4} py={2}>
                <NotificationItem
                  notification={notification}
                  onRead={handleRead}
                  onAction={handleAction}
                />
              </Box>
            ))}
          </VStack>
        )}
      </CardBody>
    </Card>
  );
}

