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
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
        title: 'Login successful!',
        description: 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Redirect to dashboard after successful login
      onSectionChange('dashboard');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setApiError(errorMessage);
      
      toast({
        title: 'Login failed',
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
          <Text fontSize="2xl" fontWeight="bold">Iniciar Sesión</Text>
          
          {apiError && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {apiError}
            </Alert>
          )}
          
          <FormControl isInvalid={!!errors.username}>
            <FormLabel fontSize="sm" fontWeight="medium">Username</FormLabel>
            <Input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              disabled={isSubmitting}
            />
            <FormErrorMessage>{errors.username}</FormErrorMessage>
          </FormControl>
          
          <FormControl isInvalid={!!errors.password}>
            <FormLabel fontSize="sm" fontWeight="medium">Contraseña</FormLabel>
            <Input
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
            loadingText="Signing in..."
          >
            Ingresar
          </Button>
          
          <Text fontSize="sm" textAlign="center">
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
