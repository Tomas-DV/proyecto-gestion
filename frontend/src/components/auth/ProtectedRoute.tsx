'use client';

import React from 'react';
import { Box, Spinner, Text, VStack, Button } from '@chakra-ui/react';
import { FiLock } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

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
      <Box bg="white" p={8} borderRadius="md" boxShadow="lg" textAlign="center">
        <VStack spacing={4}>
          <FiLock size={48} color="#E2E8F0" />
          <Text fontSize="xl" fontWeight="semibold">
            Acceso Restringido
          </Text>
          <Text color="gray.600">
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
