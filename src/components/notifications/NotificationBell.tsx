import { Box, Badge } from '@chakra-ui/react';
import { IconButton as ChakraIconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { mockNotifications } from '../../data/mockNotifications';
import { useDisclosure } from '@chakra-ui/react';
import { Drawer } from '@chakra-ui/react';

import { NotificationCenter } from './NotificationCenter';

export interface NotificationBellProps {
  onClick?: () => void;
}

/**
 * Notification Bell Component
 * - Icon dengan badge unread count
 * - Drawer dengan notification center (mobile-friendly)
 */
export function NotificationBell({ onClick }: NotificationBellProps) {
  const { open: isOpen, onOpen, onClose } = useDisclosure();

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <>
      <Box position="relative" onClick={onOpen}>
        <ChakraIconButton
          variant="ghost"
          size="sm"
          onClick={() => {
            onOpen();
            onClick?.();
          }}
          aria-label="Notifications"
        >
          <FiBell size={20} />
        </ChakraIconButton>
        {unreadCount > 0 && (
          <Badge
            position="absolute"
            top="-4px"
            right="-4px"
            colorScheme="red"
            variant="solid"
            borderRadius="full"
            minW="18px"
            h="18px"
            fontSize="xs"
            p={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Box>

      <Drawer.Root open={isOpen} onOpenChange={(e) => (e.open ? onOpen() : onClose())} placement="end">
        <Drawer.Backdrop />
        <Drawer.Content maxW="420px" w="full">
          <Drawer.Header>
            <Box fontSize="md" fontWeight="semibold">
              Notifikasi
            </Box>
          </Drawer.Header>
          <Drawer.Body p={0}>
            <Box p={4}>
              <NotificationCenter />
            </Box>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}

