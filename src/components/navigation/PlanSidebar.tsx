import { VStack, HStack, Box, Text } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import * as React from 'react';
import { useColorModeValue } from '../ui/color-mode';
import {
  FiFileText,
  FiSettings,
  FiMap,
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiMapPin,
} from 'react-icons/fi';

export interface PlanMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

export interface PlanSidebarProps {
  currentSection?: string;
}

const getMenuItems = (): PlanMenuItem[] => [
  { id: 'ringkasan', label: 'Ringkasan', icon: React.createElement(FiFileText), href: '#ringkasan' },
  { id: 'spesifikasi', label: 'Spesifikasi Teknis', icon: React.createElement(FiSettings), href: '#spesifikasi' },
  { id: 'roadmap', label: 'Tahapan Pelaksanaan', icon: React.createElement(FiCalendar), href: '#roadmap' },
  { id: 'modal', label: 'Modal', icon: React.createElement(FiDollarSign), href: '#modal' },
  { id: 'supplier', label: 'Peta Supplier', icon: React.createElement(FiMapPin), href: '#supplier' },
];

const getModalSubItems = (): PlanMenuItem[] => [
  { id: 'modal-awal', label: 'Simulasi Modal Awal', icon: React.createElement(FiDollarSign), href: '#modal-awal' },
  { id: 'operasional', label: 'Biaya Operasional', icon: React.createElement(FiTrendingUp), href: '#operasional' },
  { id: 'pendapatan', label: 'Proyeksi Pendapatan', icon: React.createElement(FiTrendingUp), href: '#pendapatan' },
  { id: 'roi', label: 'ROI dengan Grafik', icon: React.createElement(FiTrendingUp), href: '#roi' },
];

/**
 * Sidebar navigation untuk halaman Plan
 * - Menu utama dengan icons
 * - Submenu Modal (expandable)
 * - Active state indicator
 */
export function PlanSidebar({ currentSection }: PlanSidebarProps) {
  const textPrimary = useColorModeValue('gray.900', 'gray.50');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');
  const bgHover = useColorModeValue('gray.50', 'gray.800');
  const bgActive = useColorModeValue('brand.50', 'brand.900');
  const borderActive = useColorModeValue('brand.500', 'brand.400');

  const location = useLocation();

  const isActive = (href: string) => {
    const hash = location.hash || '#ringkasan';
    return hash === href;
  };

  const [showModalSubmenu, setShowModalSubmenu] = React.useState(
    isActive('#modal') || isActive('#modal-awal') || isActive('#operasional') || isActive('#pendapatan') || isActive('#roi')
  );

  const handleHashClick = (href: string, isModal?: boolean) => {
    if (isModal) {
      setShowModalSubmenu(!showModalSubmenu);
    }
    // Update hash without reload
    window.history.pushState(null, '', href);
    // Trigger hash change event manually
    const hashChangeEvent = new Event('hashchange') as HashChangeEvent;
    window.dispatchEvent(hashChangeEvent);
    // Scroll to element
    const hash = href.substring(1);
    const element = document.getElementById(hash);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  };

  return (
    <Box
      w="240px"
      minH="100vh"
      borderRight="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      p={4}
      position="sticky"
      top={0}
      alignSelf="flex-start"
    >
      <VStack align="stretch" gap={1}>
        <Text fontSize="lg" fontWeight="bold" color={textPrimary} mb={2}>
          Navigasi
        </Text>

        {getMenuItems().map((item) => {
          const active = isActive(item.href);
          const isModal = item.id === 'modal';

          return (
            <Box key={item.id}>
              <HStack
                as="a"
                href={item.href}
                px={3}
                py={2}
                borderRadius="md"
                cursor="pointer"
                bg={active ? bgActive : 'transparent'}
                borderLeft={active ? '3px solid' : '3px solid transparent'}
                borderColor={active ? borderActive : 'transparent'}
                color={active ? textPrimary : textSecondary}
                _hover={{ bg: bgHover }}
                onClick={(e) => {
                  e.preventDefault();
                  handleHashClick(item.href, isModal);
                }}
              >
                <Box fontSize="lg">{item.icon}</Box>
                <Text fontSize="sm" fontWeight={active ? 'semibold' : 'normal'}>
                  {item.label}
                </Text>
              </HStack>

              {isModal && showModalSubmenu && (
                <VStack align="stretch" gap={1} ml={4} mt={1}>
                  {getModalSubItems().map((subItem) => {
                    const subActive = isActive(subItem.href);
                    return (
                      <HStack
                        key={subItem.id}
                        as="a"
                        href={subItem.href}
                        px={3}
                        py={1.5}
                        borderRadius="md"
                        cursor="pointer"
                        bg={subActive ? bgActive : 'transparent'}
                        borderLeft={subActive ? '3px solid' : '3px solid transparent'}
                        borderColor={subActive ? borderActive : 'transparent'}
                        color={subActive ? textPrimary : textSecondary}
                        _hover={{ bg: bgHover }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleHashClick(subItem.href);
                        }}
                      >
                        <Box fontSize="sm">{subItem.icon}</Box>
                        <Text fontSize="xs" fontWeight={subActive ? 'semibold' : 'normal'}>
                          {subItem.label}
                        </Text>
                      </HStack>
                    );
                  })}
                </VStack>
              )}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

