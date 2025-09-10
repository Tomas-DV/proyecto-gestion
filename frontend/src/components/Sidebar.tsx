'use client';

import {
  Box,
  VStack,
  Text,
  HStack,
  Button,
} from '@chakra-ui/react';
import {
  FiHome,
  FiCheckSquare,
  FiTool,
} from 'react-icons/fi';
import { useUserRole } from '@/hooks/useUserRole';
import { useColorModeValue } from '@/components/ui/color-mode';

interface SidebarProps {
  onSectionChange: (section: string) => void;
  currentSection: string;
}

const Sidebar = ({ onSectionChange, currentSection }: SidebarProps) => {
  const { isAdmin } = useUserRole();
  
  // Colores adaptativos para modo claro/oscuro

const bgColor = useColorModeValue("gray.50", "gray.900");
const borderColor = useColorModeValue("gray.200", "gray.700");

// Text colors
const textColor = useColorModeValue("gray.700", "gray.100"); // inactive items
const activeColor = useColorModeValue("blue.600", "blue.200"); // active item
const hoverColor = useColorModeValue("blue.600", "blue.200"); // hover

// Background colors
const activeBg = useColorModeValue("blue.50", "blue.800"); // active item bg
const hoverBg = useColorModeValue("blue.50", "blue.800"); // hover bg


  const baseMenuItems = [
    { id: 'dashboard', label: 'Tablero', icon: FiHome },
    { id: 'tasks', label: 'Tareas / Inventario', icon: FiCheckSquare },
  ];

  const adminMenuItems = [
    { id: 'debug', label: 'Debug API', icon: FiTool },
  ];

  // Solo mostrar items de admin si el usuario es admin
  const menuItems = isAdmin ? [...baseMenuItems, ...adminMenuItems] : baseMenuItems;

  return (
    <Box
      w="300px"
      h="100vh"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      p={4}
      position="fixed"
      left={0}
      top={0}
      overflowY="auto"
    >
      <Text
        fontSize="xl"
        fontWeight="bold"
        mb={6}
        color={activeColor}
      >
        Planifica
      </Text>

      <VStack spacing={4} align="stretch">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;

          return (
            <Button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              variant="ghost"
              justifyContent="flex-start"
              h="auto"
              p={4}
              bg={isActive ? activeBg : 'transparent'}
              color={isActive ? activeColor : textColor}
              _hover={{
                bg: hoverBg,
                color: hoverColor,
              }}
            >
              <HStack spacing={3} w="100%">
                <Icon size={18} />
                <Text fontSize="sm" color={isActive ? activeColor : textColor} textAlign="left" flex={1}>
                  {item.label}
                </Text>
              </HStack>
            </Button>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Sidebar;
