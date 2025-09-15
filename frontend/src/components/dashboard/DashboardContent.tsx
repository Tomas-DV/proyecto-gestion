'use client';

import {
  Box,
  VStack,
  Text,
  SimpleGrid,
  HStack,
  Badge,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import { useTaskStats } from '@/hooks/useTaskStats';
import { useUserRole } from '@/hooks/useUserRole';
import { useColorModeValue } from '@/components/ui/color-mode';
import { useEffect } from 'react';

const DashboardContent = () => {
  const { user, isAuthenticated } = useAuth();
  const { taskStats, loading: statsLoading, error: statsError, refreshStats } = useTaskStats();
  
  // Colores adaptativos
  const cardBg = useColorModeValue('white', 'gray.800');
  const infoBg = useColorModeValue('blue.50', 'blue.900');
  const infoBorderColor = useColorModeValue('blue.200', 'blue.700');
  const infoTextColor = useColorModeValue('blue.700', 'blue.200');
  const redBg = useColorModeValue('red.50', 'red.900');
  const redBorderColor = useColorModeValue('red.200', 'red.700');
  
  // Colores de texto mejorados para mejor contraste
  const primaryTextColor = useColorModeValue('gray.800', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.200');
  const cardTitleColor = useColorModeValue('gray.800', 'white');
  const cardSubtitleColor = useColorModeValue('gray.600', 'gray.300');

  // Cargar estadísticas solo cuando el usuario está autenticado
  // Por ahora, intentamos cargar para todos los usuarios autenticados
  // Si falla por permisos, se mostrará un error apropiado
  useEffect(() => {
    if (isAuthenticated) {
      refreshStats();
    }
  }, [isAuthenticated, refreshStats]);

  return (
    <VStack spacing={6} align="stretch">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text fontSize="2xl" fontWeight="bold" color={primaryTextColor}>Panel de Control</Text>
        {isAuthenticated && user && (
          <HStack spacing={2}>
            <Text color={secondaryTextColor}>Bienvenido,</Text>
            <Text fontWeight="semibold" color={primaryTextColor}>{user.username}</Text>
            <Badge colorScheme={user.role === 'ADMIN' ? 'purple' : 'blue'}>
              {user.role}
            </Badge>
          </HStack>
        )}
      </Box>

      {isAuthenticated && user && (
        <>
          <Box bg={cardBg} p={6} borderRadius="md" boxShadow="lg">
            <Text fontSize="lg" fontWeight="semibold" mb={3} color={cardTitleColor}>Información de Usuario</Text>
            <VStack align="start" spacing={2}>
              <HStack>
                <Text fontWeight="medium" color={cardTitleColor}>Usuario:</Text>
                <Text color={primaryTextColor}>{user.username}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="medium" color={cardTitleColor}>Email:</Text>
                <Text color={primaryTextColor}>{user.email}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="medium" color={cardTitleColor}>Rol:</Text>
                <Badge colorScheme={user.role === 'ADMIN' ? 'purple' : 'blue'}>
                  {user.role}
                </Badge>
              </HStack>
              <HStack>
                <Text fontWeight="medium" color={cardTitleColor}>ID:</Text>
                <Text color={secondaryTextColor}>{user.id}</Text>
              </HStack>
            </VStack>
          </Box>
          <Divider />
        </>
      )}

      {/* Estadísticas de tareas */}
      {isAuthenticated && (
        <>
          {statsError && (
            <Alert status={statsError.includes('permisos') ? 'warning' : 'error'}>
              <AlertIcon />
              {statsError.includes('permisos') 
                ? 'Las estadísticas detalladas están disponibles para usuarios con permisos avanzados.'
                : `Error al cargar estadísticas: ${statsError}`
              }
            </Alert>
          )}
          
          {statsLoading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <Spinner size="lg" color="blue.500" />
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <Box bg={cardBg} p={6} borderRadius="md" boxShadow="lg">

                <Text fontSize="lg" fontWeight="semibold" mb={2} color={cardTitleColor}>Tareas Pendientes</Text>
                <Text fontSize="3xl" fontWeight="bold" color="orange.400">
                  {taskStats?.pendingTasks || 0}
                </Text>
                <Text color={cardSubtitleColor} fontSize="sm">Tareas por completar</Text>
              </Box>
              
              <Box bg={cardBg} p={6} borderRadius="md" boxShadow="lg">
                <Text fontSize="lg" fontWeight="semibold" mb={2} color={cardTitleColor}>En Progreso</Text>
                <Text fontSize="3xl" fontWeight="bold" color="blue.400">
                  {taskStats?.inProgressTasks || 0}
                </Text>
                <Text color={cardSubtitleColor} fontSize="sm">Tareas en desarrollo</Text>
              </Box>
              
              <Box bg={cardBg} p={6} borderRadius="md" boxShadow="lg">
                <Text fontSize="lg" fontWeight="semibold" mb={2} color={cardTitleColor}>Completadas</Text>
                <Text fontSize="3xl" fontWeight="bold" color="green.400">
                  {taskStats?.completedTasks || 0}
                </Text>
                <Text color={cardSubtitleColor} fontSize="sm">Tareas finalizadas</Text>
              </Box>
              
              <Box bg={cardBg} p={6} borderRadius="md" boxShadow="lg">
                <Text fontSize="lg" fontWeight="semibold" mb={2} color={cardTitleColor}>Total Tareas</Text>
                <Text fontSize="3xl" fontWeight="bold" color="purple.400">
                  {taskStats?.totalTasks || 0}
                </Text>
                <Text color={cardSubtitleColor} fontSize="sm">Total en el sistema</Text>
              </Box>
              
              {taskStats && taskStats.overdueTasks > 0 && (
                <Box bg={redBg} p={6} borderRadius="md" boxShadow="lg" border="2px" borderColor={redBorderColor}>
                  <Text fontSize="lg" fontWeight="semibold" mb={2} color={redBorderColor.includes('red.700') ? 'red.300' : 'red.600'}>⚠️ Tareas Vencidas</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="red.500">
                    {taskStats.overdueTasks}
                  </Text>
                  <Text color={redBorderColor.includes('red.700') ? 'red.300' : 'red.600'} fontSize="sm">Requieren atención</Text>
                </Box>
              )}
            </SimpleGrid>
          )}
        </>
      )}

      {!isAuthenticated && (
        <Box bg={infoBg} p={6} borderRadius="md" border="1px" borderColor={infoBorderColor}>
          <VStack spacing={3}>
            <Text fontSize="lg" fontWeight="semibold" color={infoTextColor}>
              🔐 Funcionalidades Completas Disponibles
            </Text>
            <Text color={infoTextColor} textAlign="center">
              Inicia sesión para acceder a todas las funcionalidades de gestión, 
              crear tareas personalizadas y sincronizar tus datos.
            </Text>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

export default DashboardContent;
