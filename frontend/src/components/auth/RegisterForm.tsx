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

interface RegisterFormProps {
  onSectionChange: (section: string) => void;
}

const RegisterForm = ({ onSectionChange }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const { register } = useAuth();
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
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Password confirmation is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await register(formData);
      
      toast({
        title: 'Registration successful!',
        description: 'Welcome to the platform!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Redirect to dashboard after successful registration
      onSectionChange('dashboard');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setApiError(errorMessage);
      
      toast({
        title: 'Registration failed',
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
          <Text fontSize="2xl" fontWeight="bold">Crear Cuenta</Text>
          
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
              placeholder="Choose a username"
              disabled={isSubmitting}
            />
            <FormErrorMessage>{errors.username}</FormErrorMessage>
          </FormControl>
          
          <FormControl isInvalid={!!errors.email}>
            <FormLabel fontSize="sm" fontWeight="medium">Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              disabled={isSubmitting}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
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
          
          <FormControl isInvalid={!!errors.confirmPassword}>
            <FormLabel fontSize="sm" fontWeight="medium">Confirmar Contraseña</FormLabel>
            <Input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isSubmitting}
            />
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          </FormControl>
          
          <Button
            type="submit"
            colorScheme="green"
            w="100%"
            isLoading={isSubmitting}
            loadingText="Creating account..."
          >
            Registrarse
          </Button>
          
          <Text fontSize="sm" textAlign="center">
            ¿Ya tienes cuenta?{' '}
            <Button
              variant="link"
              colorScheme="blue"
              size="sm"
              onClick={() => onSectionChange('login')}
            >
              Inicia sesión aquí
            </Button>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterForm;
