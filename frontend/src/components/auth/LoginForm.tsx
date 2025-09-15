'use client';

import { useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import { useColorModeValue } from '@/components/ui/color-mode';

interface LoginFormProps {
  onSectionChange: (section: string) => void;
}

const LoginForm = ({ onSectionChange }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const { login } = useAuth();
  const toast = useToast();
  
  // Colores adaptativos
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear API error
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El usuario es obligatorio';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      await login(formData);
      
      toast({
        title: '¡Inicio de sesión exitoso!',
        description: '¡Bienvenido de vuelta!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Redirect to dashboard after successful login
      onSectionChange('dashboard');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      setApiError(errorMessage);
      
      toast({
        title: 'Error al iniciar sesión',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box bg={cardBg} maxW="400px" mx="auto" p={6} borderRadius="md" boxShadow="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Text fontSize="2xl" color={useColorModeValue("black","white")} fontWeight="bold">Iniciar Sesión</Text>
          
          {apiError && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {apiError}
            </Alert>
          )}
          
          <FormControl isInvalid={!!errors.username}>
            <FormLabel color={useColorModeValue("black","white")} fontSize="sm" fontWeight="medium">Usuario</FormLabel>
            <Input
              color={useColorModeValue("black","white")}
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ingresa tu usuario"
              disabled={isSubmitting}
            />
            <FormErrorMessage>{errors.username}</FormErrorMessage>
          </FormControl>
          
          <FormControl isInvalid={!!errors.password}>
            <FormLabel color={useColorModeValue("black","white")} fontSize="sm" fontWeight="medium">Contraseña</FormLabel>
            <Input
              color={useColorModeValue("black","white")}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isSubmitting}
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          
          <Button
            type="submit"
            colorScheme="blue"
            w="100%"
            isLoading={isSubmitting}
            loadingText="Iniciando sesión..."
          >
            Ingresar
          </Button>
          
          <Text color={useColorModeValue("black","white")} fontSize="sm" textAlign="center">
            ¿No tienes cuenta?{' '}
            <Button
              variant="link"
              colorScheme="blue"
              size="sm"
              onClick={() => onSectionChange('register')}
            >
              Regístrate aquí
            </Button>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default LoginForm;
