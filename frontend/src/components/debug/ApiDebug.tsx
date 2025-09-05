'use client';

import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Button,
  Text,
  Box,
  Alert,
  AlertIcon,
  Code,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/services/api';

const ApiDebug: React.FC = () => {
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();

  const testEndpoint = async (endpoint: string, method: 'GET' | 'POST' = 'GET') => {
    setLoading(true);
    setResponse('');
    
    try {
      const result = await apiRequest(endpoint, {
        method,
      });
      
      setResponse(JSON.stringify(result, null, 2));
      
      if (result.success) {
        toast({
          title: 'Éxito',
          description: `Endpoint ${endpoint} funcionó correctamente`,
          status: 'success',
          duration: 3000,
        });
      } else {
        toast({
          title: 'Error en API',
          description: result.error || 'Error desconocido',
          status: 'error',
          duration: 5000,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setResponse(`Error: ${errorMessage}`);
      toast({
        title: 'Error de Red',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const testPublicEndpoint = () => testEndpoint('/api/test/public');
  const testTaskStats = () => testEndpoint('/api/tasks/stats');
  const testAllTasks = () => testEndpoint('/api/tasks');
  const testProtectedEndpoint = () => testEndpoint('/api/test/protected');

  const checkAuthToken = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('authUser');
    
    const debugInfo: any = {
      hasToken: !!token,
      hasUser: !!user,
      tokenLength: token?.length || 0,
      tokenStart: token?.substring(0, 50) + '...' || 'N/A',
      user: user ? JSON.parse(user) : null,
      localStorage: {
        authToken: !!localStorage.getItem('authToken'),
        authUser: !!localStorage.getItem('authUser'),
      }
    };
    
    if (token) {
      try {
        // Decodificar el payload del JWT (sin verificar la firma)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        const now = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp < now;
        
        debugInfo.jwtPayload = payload;
        debugInfo.isExpired = isExpired;
        debugInfo.expiresAt = new Date(payload.exp * 1000).toLocaleString();
        debugInfo.currentTime = new Date().toLocaleString();
        debugInfo.timeUntilExpiry = payload.exp - now;
        
      } catch (error) {
        debugInfo.tokenError = `Error al decodificar token: ${error}`;
      }
    }
    
    setResponse(JSON.stringify(debugInfo, null, 2));
  };

  const testRawFetch = async () => {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch('http://localhost:8080/api/tasks/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        body: response.ok ? await response.json() : await response.text()
      };
      
      setResponse(JSON.stringify(result, null, 2));
      
    } catch (error) {
      setResponse(`Error en fetch: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch" p={6}>
      <Text fontSize="2xl" fontWeight="bold">🔧 API Debug Tool</Text>
      
      <Alert status="info">
        <AlertIcon />
        <Text>
          Estado de autenticación: {isAuthenticated ? '✅ Autenticado' : '❌ No autenticado'}
          {user && ` (${user.username})`}
        </Text>
      </Alert>

      <Box bg="gray.50" p={4} borderRadius="md">
        <Text fontWeight="bold" mb={3}>Pruebas de Endpoints:</Text>
        <HStack spacing={3} flexWrap="wrap">
          <Button 
            colorScheme="green" 
            onClick={testPublicEndpoint} 
            isLoading={loading}
          >
            🌐 Endpoint Público
          </Button>
          
          <Button 
            colorScheme="blue" 
            onClick={testTaskStats} 
            isLoading={loading}
            isDisabled={!isAuthenticated}
          >
            📊 Estadísticas de Tareas
          </Button>
          
          <Button 
            colorScheme="blue" 
            onClick={testAllTasks} 
            isLoading={loading}
            isDisabled={!isAuthenticated}
          >
            📋 Todas las Tareas
          </Button>
          
          <Button 
            colorScheme="purple" 
            onClick={testProtectedEndpoint} 
            isLoading={loading}
            isDisabled={!isAuthenticated}
          >
            🔒 Endpoint Protegido
          </Button>
          
          <Button 
            colorScheme="orange" 
            onClick={checkAuthToken}
          >
            🔑 Verificar Token
          </Button>
          
          <Button 
            colorScheme="red" 
            onClick={testRawFetch}
            isLoading={loading}
            isDisabled={!isAuthenticated}
          >
            🧪 Test Fetch Directo
          </Button>
        </HStack>
      </Box>

      <Box>
        <Text fontWeight="bold" mb={2}>Respuesta:</Text>
        <Textarea
          value={response}
          readOnly
          minHeight="300px"
          fontFamily="mono"
          fontSize="sm"
          placeholder="La respuesta aparecerá aquí..."
        />
      </Box>

      {response && (
        <Box>
          <Text fontWeight="bold" mb={2}>Respuesta Formateada:</Text>
          <Code display="block" whiteSpace="pre" p={4} borderRadius="md">
            {response}
          </Code>
        </Box>
      )}
    </VStack>
  );
};

export default ApiDebug;
