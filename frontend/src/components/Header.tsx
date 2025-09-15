'use client';

import {
  Box,
  Flex,
  Text,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useToast,
} from '@chakra-ui/react';
import { FiUser, FiLogIn, FiUserPlus, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { ColorModeButton, useColorModeValue } from '@/components/ui/color-mode';

interface HeaderProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const Header = ({ currentSection, onSectionChange }: HeaderProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const toast = useToast();
  
  // Colores adaptativos para modo claro/oscuro
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');
  const buttonTextColor = useColorModeValue('gray.700', 'gray.200');

  const handleLogout = () => {
    logout();
    toast({
      title: 'Sesión cerrada exitosamente',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    onSectionChange('dashboard');
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'login':
        return 'Iniciar Sesión';
      case 'register':
        return 'Registro';
      case 'dashboard':
        return 'Tablero';
      case 'tasks':
        return 'Gestión de Tareas / Inventario';
      default:
        return 'Gestión Personal / Empresa';
    }
  };

  return (
    <Box
      position="fixed"
      top={0}
      left="300px"
      right={0}
      h="60px"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      zIndex={999}
    >
      <Flex
        h="100%"
        alignItems="center"
        justifyContent="space-between"
        px={6}
      >
        <Text
          fontSize="lg"
          fontWeight="semibold"
          color={textColor}
        >
          {getSectionTitle(currentSection)}
        </Text>

        <HStack spacing={3}>
          {/* Conditional Auth Section */}
          {isAuthenticated ? (
            <>
              {/* User Menu */}
              <Menu>
                <MenuButton as={Button} rightIcon={<FiChevronDown />} size="sm" variant="ghost">
                  <HStack spacing={2}>
                    <Avatar size="xs" name={user?.username} />
                    <Text color={buttonTextColor}>{user?.username}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FiUser />} onClick={() => onSectionChange('profile')}>
                    Perfil
                  </MenuItem>
                  <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                    Cerrar Sesión
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              {/* Login/Register Buttons */}
              <Button
                leftIcon={<FiLogIn />}
                onClick={() => onSectionChange('login')}
                variant={currentSection === 'login' ? 'solid' : 'outline'}
                colorScheme="blue"
                size="sm"
              >
                Iniciar Sesión
              </Button>
              <Button
                leftIcon={<FiUserPlus />}
                onClick={() => onSectionChange('register')}
                variant={currentSection === 'register' ? 'solid' : 'outline'}
                colorScheme="blue"
                size="sm"
              >
                Registrarse
              </Button>
            </>
          )}
          
          {/* Divider */}
          <Box w="1px" h="20px" bg={dividerColor} />
          
          {/* Color Mode Toggle */}
          <ColorModeButton />
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
