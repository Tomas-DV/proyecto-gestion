'use client';

import React from 'react';
import { Box, Spinner, Text, VStack, Button } from '@chakra-ui/react';
import { FiLock } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useColorModeValue } from "@/components/ui/color-mode";
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'USER' | 'ADMIN';
  onRedirectToLogin?: () => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  onRedirectToLogin,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="200px"
      >
        <Spinner size="lg" color="blue.500" />
      </Box>
    );
  }

  // If authentication is not required, render children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return (
      // eslint-disable-next-line react-hooks/rules-of-hooks
      <Box bg={useColorModeValue("blue.50","blue.900")} p={8} borderRadius="md" boxShadow="lg" textAlign="center">
        <VStack spacing={4}>
          
          <Text color={useColorModeValue("blue.700","blue.200")} fontSize="xl" fontWeight="semibold">
           🔐 Acceso Restringido
          </Text>
          <Text color={useColorModeValue("blue.700","blue.200")}>
            Necesitas iniciar sesión para acceder a esta sección.
          </Text>
          {onRedirectToLogin && (
            <Button
              colorScheme="blue"
              onClick={onRedirectToLogin}
              leftIcon={<FiLock />}
            >
              Iniciar Sesión
            </Button>
          )}
        </VStack>
      </Box>
    );
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    return (
      <Box bg="white" p={8} borderRadius="md" boxShadow="lg" textAlign="center">
        <VStack spacing={4}>
          <FiLock size={48} color="#E2E8F0" />
          <Text fontSize="xl" fontWeight="semibold">
            Acceso Denegado
          </Text>
          <Text color="gray.600">
            No tienes permisos suficientes para acceder a esta sección.
          </Text>
          <Text fontSize="sm" color="gray.500">
            Rol requerido: {requiredRole} | Tu rol: {user.role}
          </Text>
        </VStack>
      </Box>
    );
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
