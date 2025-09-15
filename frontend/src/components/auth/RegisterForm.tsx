"use client";

import { useState } from "react";
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
} from "@chakra-ui/react";
import { useAuth } from "@/contexts/AuthContext";
import { useColorModeValue } from "@/components/ui/color-mode";

interface RegisterFormProps {
  onSectionChange: (section: string) => void;
}

const RegisterForm = ({ onSectionChange }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const { register } = useAuth();
  const toast = useToast();

  // Colores adaptativos
  const cardBg = useColorModeValue("white", "gray.800");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear API error
    if (apiError) {
      setApiError("");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio";
    } else if (formData.username.length < 3) {
      newErrors.username = "El usuario debe tener al menos 3 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "La confirmación de contraseña es obligatoria";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
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
    setApiError("");

    try {
      await register(formData);

      toast({
        title: "¡Registro exitoso!",
        description: "¡Bienvenido a la plataforma!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirect to dashboard after successful registration
      onSectionChange("dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error en el registro";
      setApiError(errorMessage);

      toast({
        title: "Error en el registro",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      bg={cardBg}
      maxW="400px"
      mx="auto"
      p={6}
      borderRadius="md"
      boxShadow="lg"
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Text
            color={useColorModeValue("black", "white")}
            fontSize="2xl"
            fontWeight="bold"
          >
            Crear Cuenta
          </Text>

          {apiError && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {apiError}
            </Alert>
          )}

          <FormControl isInvalid={!!errors.username}>
            <FormLabel
              color={useColorModeValue("black", "white")}
              fontSize="sm"
              fontWeight="medium"
            >
              Usuario
            </FormLabel>
            <Input
              color={useColorModeValue("black", "white")}
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Elige un nombre de usuario"
              disabled={isSubmitting}
            />
            <FormErrorMessage>{errors.username}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email}>
            <FormLabel
              color={useColorModeValue("black", "white")}
              fontSize="sm"
              fontWeight="medium"
            >
              Email
            </FormLabel>
            <Input
              color={useColorModeValue("black", "white")}
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
            <FormLabel color={useColorModeValue("black","white")} fontSize="sm" fontWeight="medium">
              Contraseña
            </FormLabel>
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

          <FormControl isInvalid={!!errors.confirmPassword}>
            <FormLabel color={useColorModeValue("black","white")} fontSize="sm" fontWeight="medium">
              Confirmar Contraseña
            </FormLabel>
            <Input
              color={useColorModeValue("black","white")}
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
            loadingText="Creando cuenta..."
          >
            Registrarse
          </Button>

          <Text color={useColorModeValue("black","white")} fontSize="sm" textAlign="center">
            ¿Ya tienes cuenta?{" "}
            <Button
              variant="link"
              colorScheme="blue"
              size="sm"
              onClick={() => onSectionChange("login")}
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
