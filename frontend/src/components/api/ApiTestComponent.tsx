'use client';

import { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Alert,
  AlertIcon,
  Code,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { FiPlay, FiCheck, FiX } from 'react-icons/fi';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const ApiTestComponent = () => {
  const [results, setResults] = useState<Record<string, { success: boolean; data: string; error?: string }>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { isAuthenticated } = useAuth();

  const testEndpoint = async (name: string, apiCall: () => Promise<string>) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    
    try {
      const data = await apiCall();
      setResults(prev => ({
        ...prev,
        [name]: { success: true, data }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: { 
          success: false, 
          data: '', 
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const endpoints = [
    {
      name: 'public',
      label: 'Public Endpoint',
      description: 'GET /api/test/public',
      call: () => apiService.getPublicData(),
      requireAuth: false,
    },
    {
      name: 'protected',
      label: 'Protected Endpoint',
      description: 'GET /api/test/protected',
      call: () => apiService.getProtectedData(),
      requireAuth: true,
    },
    {
      name: 'admin',
      label: 'Admin Endpoint',
      description: 'GET /api/test/admin',
      call: () => apiService.getAdminData(),
      requireAuth: true,
    },
  ];

  return (
    <VStack spacing={6} align="stretch">
      <Text fontSize="2xl" fontWeight="bold">API - Spring Boot Connection</Text>
      
      <Alert status="info">
        <AlertIcon />
        Prueba la conexión con el backend y la autenticación JWT.
      </Alert>
      
      <VStack spacing={4}>
        {endpoints.map((endpoint) => (
          <Box key={endpoint.name} bg="white" p={6} borderRadius="md" boxShadow="lg" w="100%">
            <VStack align="start" spacing={3}>
              <HStack justify="space-between" w="100%">
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Text fontWeight="semibold">{endpoint.label}</Text>
                    {endpoint.requireAuth && (
                      <Badge colorScheme="orange">Requires Auth</Badge>
                    )}
                  </HStack>
                  <Code colorScheme="gray">{endpoint.description}</Code>
                </VStack>
                <Button
                  leftIcon={<FiPlay />}
                  onClick={() => testEndpoint(endpoint.name, endpoint.call)}
                  isLoading={loading[endpoint.name]}
                  colorScheme="blue"
                  size="sm"
                  isDisabled={endpoint.requireAuth && !isAuthenticated}
                >
                  Test
                </Button>
              </HStack>
              
              {endpoint.requireAuth && !isAuthenticated && (
                <Alert status="warning" size="sm">
                  <AlertIcon />
                  Necesitas iniciar sesión para probar este endpoint
                </Alert>
              )}
              
              {results[endpoint.name] && (
                <Box w="100%" mt={2}>
                  <HStack mb={2}>
                    {results[endpoint.name].success ? (
                      <FiCheck color="green" />
                    ) : (
                      <FiX color="red" />
                    )}
                    <Text fontSize="sm" fontWeight="medium">
                      {results[endpoint.name].success ? 'Success' : 'Error'}
                    </Text>
                  </HStack>
                  <Box bg="gray.50" p={3} borderRadius="md" borderLeft="4px" borderColor={results[endpoint.name].success ? "green.400" : "red.400"}>
                    <Code fontSize="sm" colorScheme={results[endpoint.name].success ? "green" : "red"}>
                      {results[endpoint.name].success 
                        ? results[endpoint.name].data 
                        : results[endpoint.name].error
                      }
                    </Code>
                  </Box>
                </Box>
              )}
            </VStack>
          </Box>
        ))}
      </VStack>
      
      <Box bg="white" p={6} borderRadius="md" boxShadow="lg">
        <Text fontSize="lg" fontWeight="semibold" mb={3}>Estado de la Conexión</Text>
        <VStack align="start" spacing={2}>
          <Text>🟢 Backend URL: http://localhost:8080</Text>
          <Text>🟢 Database: MySQL</Text>
          <Text>🟢 Auth Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default ApiTestComponent;
