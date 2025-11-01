import * as React from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Link as ChakraLink,
  Text,
  Spacer,
  Drawer,
  VStack,
  Badge,
  Menu,
  Container,
} from "@chakra-ui/react";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { useColorModeValue, ColorModeButton } from "../ui/color-mode";
import { NotificationBell } from "../notifications/NotificationBell";

type ChildItem = {
  label: string;
  description?: string;
  href: string;
  badge?: string;
};

type NavItem = {
  label: string;
  href?: string;
  children?: ChildItem[];
};

export interface NavbarProps {
  logo?: React.ReactNode;
  links?: NavItem[];
  cta?: { label: string; href?: string; onClick?: () => void };
  activeHref?: string;
  sticky?: boolean;
  overHero?: boolean;
  user?: { name: string; avatarUrl?: string } | null;
  brandName?: string;
}

const DEFAULT_LINKS: NavItem[] = [
  {
    label: "Solutions",
    children: [
      {
        label: "On-Demand",
        description: "Private Charter yang fleksibel sesuai kebutuhan.",
        href: "/solutions/on-demand",
      },
      {
        label: "Memberships",
        description: "Akses layanan eksklusif lewat program keanggotaan.",
        href: "/solutions/memberships",
        badge: "New",
      },
      {
        label: "Aircraft Ownership",
        description: "Kepemilikan penuh atau fractional, lebih efisien.",
        href: "/solutions/ownership",
      },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  links = DEFAULT_LINKS,
  cta = { label: "Get Started", href: "/start", onClick: undefined },
  activeHref,
  sticky = true,
  user = null,
  brandName = "FarmHub",
}) => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // All color mode values at top level (no conditional hooks)
  const textColor = useColorModeValue("gray.800", "white");
  const mutedColor = useColorModeValue("gray.600", "gray.300");
  const accentColor = useColorModeValue("brand.600", "brand.400");
  const logoColor = useColorModeValue("gray.900", "white");
  const hoverBgLight = useColorModeValue("blackAlpha.50", "whiteAlpha.100");
  const menuBg = useColorModeValue(
    "rgba(255, 255, 255, 0.9)",
    "rgba(30, 58, 138, 0.9)"
  );
  const menuShadow = useColorModeValue(
    "0 10px 40px -15px rgba(6, 182, 212, 0.2)",
    "0 10px 40px -15px rgba(34, 211, 238, 0.3)"
  );
  const menuBorder = useColorModeValue(
    "rgba(6, 182, 212, 0.15)",
    "rgba(34, 211, 238, 0.2)"
  );
  const headerShadow = useColorModeValue(
    "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
    "0 1px 3px 0 rgba(0, 0, 0, 0.5)"
  );
  const drawerBg = useColorModeValue(
    "rgba(255, 255, 255, 0.95)",
    "rgba(30, 58, 138, 0.95)"
  );
  const drawerBorder = useColorModeValue("gray.100", "whiteAlpha.100");
  const backdropBg = useColorModeValue("blackAlpha.300", "blackAlpha.700");
  const userHoverBg = useColorModeValue("blackAlpha.100", "whiteAlpha.200");

  // Glass background based on scrolled state
  const glassBgLight = "rgba(255, 255, 255, 0.65)";
  const glassBgDark = "rgba(12, 74, 110, 0.4)";
  const glassBg = useColorModeValue(
    scrolled ? glassBgLight : "transparent",
    scrolled ? glassBgDark : "transparent"
  );

  const defaultLogo = (
    <Text fontWeight="700" fontSize="xl" color={logoColor} letterSpacing="tight">
      🌾 {brandName}
    </Text>
  );

  return (
    <Box
      as="header"
      position={sticky ? "sticky" : "relative"}
      top={0}
      left={0}
      right={0}
      width="100%"
      zIndex={1000}
      bg={glassBg}
      backdropFilter={scrolled ? "blur(24px) saturate(180%)" : "none"}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      borderBottom="none"
      boxShadow={scrolled ? headerShadow : "none"}
      css={{
        WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
      }}
    >
      <Container maxW="7xl">
        <Flex as="nav" h={20} align="center" gap={4}>
          {/* Logo */}
          <ChakraLink 
            href="/" 
            _hover={{ textDecoration: "none", opacity: 0.7 }}
            transition="opacity 0.2s"
          >
            {logo || defaultLogo}
          </ChakraLink>

          {/* Desktop Nav */}
          <HStack
            as="ul"
            listStyleType="none"
            gap={0.5}
            display={{ base: "none", lg: "flex" }}
            ml={8}
          >
            {links.map((item) =>
              item.children ? (
                <Box as="li" key={item.label}>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <Button
                        variant="ghost"
                        fontWeight={500}
                        fontSize="sm"
                        color={textColor}
                        _hover={{ 
                          bg: hoverBgLight,
                          color: accentColor 
                        }}
                        h={10}
                        px={3}
                      >
                        <HStack gap={1}>
                          <Text>{item.label}</Text>
                          <FiChevronDown size={14} />
                        </HStack>
                      </Button>
                    </Menu.Trigger>
                    <Menu.Positioner>
                      <Menu.Content
                        minW="sm"
                        bg={menuBg}
                        backdropFilter="blur(24px) saturate(180%)"
                        borderRadius="2xl"
                        boxShadow={menuShadow}
                        border="1px solid"
                        borderColor={menuBorder}
                        p={2}
                        css={{
                          WebkitBackdropFilter: "blur(24px) saturate(180%)",
                        }}
                      >
                        {item.children.map((child) => (
                          <Menu.Item key={child.label} value={child.href} asChild>
                            <ChakraLink
                              href={child.href}
                              display="block"
                              _hover={{ 
                                textDecoration: "none",
                                bg: hoverBgLight
                              }}
                              borderRadius="xl"
                              px={3}
                              py={3}
                              transition="all 0.2s"
                            >
                              <VStack align="start" gap={1}>
                                <HStack>
                                  <Text fontWeight={600} fontSize="sm" color={textColor}>
                                    {child.label}
                                  </Text>
                                  {child.badge && (
                                    <Badge
                                      size="sm"
                                      bg={accentColor}
                                      color="white"
                                      px={2}
                                      py={0.5}
                                      rounded="full"
                                      fontSize="2xs"
                                      fontWeight={600}
                                    >
                                      {child.badge}
                                    </Badge>
                                  )}
                                </HStack>
                                {child.description && (
                                  <Text fontSize="xs" color={mutedColor} lineHeight="1.5">
                                    {child.description}
                                  </Text>
                                )}
                              </VStack>
                            </ChakraLink>
                          </Menu.Item>
                        ))}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                </Box>
              ) : (
                <Box as="li" key={item.label}>
                  <NavLink
                    href={item.href ?? "#"}
                    label={item.label}
                    isActive={activeHref === item.href}
                  />
                </Box>
              )
            )}
          </HStack>

          <Spacer />

          {/* Right Actions */}
          <HStack gap={2} display={{ base: "none", md: "flex" }}>
            <ColorModeButton 
              variant="ghost" 
              size="md"
              _hover={{ bg: hoverBgLight }}
            />
            
            {user && (
              <HStack 
                gap={2} 
                px={3} 
                py={1.5} 
                rounded="full" 
                bg={hoverBgLight}
                transition="all 0.2s"
                _hover={{ bg: userHoverBg }}
              >
                <Text fontSize="sm" fontWeight={500} color={textColor}>
                  {user.name}
                </Text>
                <Box
                  w={8}
                  h={8}
                  rounded="full"
                  bg={accentColor}
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="600"
                  fontSize="xs"
                >
                  {user.name.charAt(0).toUpperCase()}
                </Box>
              </HStack>
            )}
            
            <NotificationBell />
            
            {cta.onClick ? (
              <Button 
                colorPalette="brand" 
                size="md"
                fontWeight={600}
                px={6}
                h={10}
                onClick={cta.onClick}
              >
                {cta.label}
              </Button>
            ) : (
              <ChakraLink href={cta.href || '#'} _hover={{ textDecoration: "none" }}>
                <Button 
                  colorPalette="brand" 
                  size="md"
                  fontWeight={600}
                  px={6}
                  h={10}
                >
                  {cta.label}
                </Button>
              </ChakraLink>
            )}
          </HStack>

          {/* Mobile */}
          <HStack display={{ base: "flex", lg: "none" }} gap={1}>
            <ColorModeButton 
              variant="ghost" 
              size="sm"
              _hover={{ bg: hoverBgLight }}
            />
            <NotificationBell />
            <IconButton
              aria-label="Menu"
              variant="ghost"
              onClick={isOpen ? onClose : onOpen}
              size="sm"
              _hover={{ bg: useColorModeValue("blackAlpha.50", "whiteAlpha.100") }}
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </IconButton>
          </HStack>
        </Flex>
      </Container>

      {/* Mobile Drawer with Glass Effect */}
      <Drawer.Root
        open={isOpen}
        onOpenChange={(e) => (e.open ? onOpen() : onClose())}
        placement="start"
      >
        <Drawer.Backdrop 
          bg={backdropBg}
          backdropFilter="blur(8px)"
        />
        <Drawer.Content 
          bg={drawerBg}
          backdropFilter="blur(24px) saturate(180%)"
          css={{
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
          }}
        >
          <Drawer.Header 
            borderBottom="1px solid" 
            borderColor={drawerBorder}
          >
            <Drawer.Title>
              <Text fontWeight="700" fontSize="lg">{brandName}</Text>
            </Drawer.Title>
            <Drawer.CloseTrigger />
          </Drawer.Header>

          <Drawer.Body p={0}>
            <VStack align="stretch" gap={1} py={4}>
              {links.map((item) =>
                item.children ? (
                  <Box key={item.label} px={4} py={2}>
                    <Text
                      fontSize="2xs"
                      textTransform="uppercase"
                      color={mutedColor}
                      fontWeight="700"
                      letterSpacing="wider"
                      mb={2}
                    >
                      {item.label}
                    </Text>
                    <VStack align="stretch" gap={1}>
                      {item.children.map((child) => (
                        <MobileLink key={child.label} href={child.href} onClick={onClose}>
                          <HStack justify="space-between" w="full">
                            <VStack align="start" gap={0.5} flex={1}>
                              <Text fontWeight={600} fontSize="sm">{child.label}</Text>
                              {child.description && (
                                <Text fontSize="xs" color={mutedColor} lineHeight="1.4">
                                  {child.description}
                                </Text>
                              )}
                            </VStack>
                            {child.badge && (
                              <Badge
                                size="sm"
                                bg={accentColor}
                                color="white"
                                px={2}
                                py={0.5}
                                rounded="full"
                                fontSize="2xs"
                                fontWeight={600}
                              >
                                {child.badge}
                              </Badge>
                            )}
                          </HStack>
                        </MobileLink>
                      ))}
                    </VStack>
                  </Box>
                ) : (
                  <Box key={item.label} px={4}>
                    <MobileLink href={item.href ?? "#"} onClick={onClose}>
                      <Text fontWeight={600} fontSize="sm">{item.label}</Text>
                    </MobileLink>
                  </Box>
                )
              )}

              <Box px={4} pt={4}>
                {cta.onClick ? (
                  <Button 
                    colorPalette="brand" 
                    size="md" 
                    w="full" 
                    onClick={() => {
                      onClose();
                      cta.onClick?.();
                    }}
                    fontWeight={600}
                  >
                    {cta.label}
                  </Button>
                ) : (
                  <ChakraLink href={cta.href || '#'} _hover={{ textDecoration: "none" }} display="block">
                    <Button 
                      colorPalette="brand" 
                      size="md" 
                      w="full" 
                      onClick={onClose}
                      fontWeight={600}
                    >
                      {cta.label}
                    </Button>
                  </ChakraLink>
                )}
              </Box>

              {user && (
                <Box 
                  px={4} 
                  pt={4} 
                  mt={4} 
                  borderTop="1px solid" 
                  borderColor={drawerBorder}
                >
                  <HStack gap={3}>
                    <Box
                      w={10}
                      h={10}
                      rounded="full"
                      bg={accentColor}
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="600"
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Box>
                    <VStack align="start" gap={0}>
                      <Text fontWeight={600} fontSize="sm">{user.name}</Text>
                      <Text fontSize="xs" color={mutedColor}>View Profile</Text>
                    </VStack>
                  </HStack>
                </Box>
              )}
            </VStack>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </Box>
  );
};

const NavLink: React.FC<{
  href: string;
  label: string;
  isActive?: boolean;
}> = ({ href, label, isActive }) => {
  const textColor = useColorModeValue("gray.800", "white");
  const accentColor = useColorModeValue("brand.600", "brand.400");
  const hoverBg = useColorModeValue("blackAlpha.50", "whiteAlpha.100");

  return (
    <ChakraLink
      href={href}
      px={3}
      py={2}
      rounded="lg"
      color={isActive ? accentColor : textColor}
      _hover={{ 
        textDecoration: "none", 
        color: accentColor, 
        bg: hoverBg 
      }}
      aria-current={isActive ? "page" : undefined}
      position="relative"
      fontWeight={isActive ? 600 : 500}
      fontSize="sm"
      display="block"
      transition="all 0.2s"
    >
      {label}
      {isActive && (
        <Box
          position="absolute"
          left={3}
          right={3}
          bottom={1}
          height="2px"
          bg={accentColor}
          borderRadius="full"
        />
      )}
    </ChakraLink>
  );
};

const MobileLink: React.FC<
  React.PropsWithChildren<{ href: string; onClick?: () => void }>
> = ({ href, children, onClick }) => {
  const hoverBg = useColorModeValue("blackAlpha.50", "whiteAlpha.100");
  
  return (
    <ChakraLink
      href={href}
      p={3}
      borderRadius="xl"
      display="block"
      _hover={{ textDecoration: "none", bg: hoverBg }}
      onClick={onClick}
      transition="all 0.2s"
    >
      {children}
    </ChakraLink>
  );
};

export default Navbar;
