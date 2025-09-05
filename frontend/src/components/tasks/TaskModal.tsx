'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  Select,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Task, TaskRequest, TaskUpdateRequest, TaskPriority, TaskStatus } from '@/types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TaskRequest | TaskUpdateRequest) => Promise<Task | null>;
  task?: Task | null; // Si se pasa, es modo edición
  loading?: boolean;
}

const TaskModal = ({ isOpen, onClose, onSave, task, loading = false }: TaskModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.PENDING,
    dueDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  // Cargar datos de la tarea si estamos editando
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.PENDING,
        dueDate: '',
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length > 255) {
      newErrors.title = 'El título no puede exceder 255 caracteres';
    }
    
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const taskData: TaskRequest | TaskUpdateRequest = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
    };

    // Si estamos editando, incluir el status
    if (task) {
      (taskData as TaskUpdateRequest).status = formData.status;
    }

    const result = await onSave(taskData);
    
    if (result) {
      toast({
        title: task ? 'Tarea actualizada' : 'Tarea creada',
        description: task ? 'La tarea ha sido actualizada exitosamente' : 'La nueva tarea ha sido creada exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {task ? 'Editar Tarea' : 'Nueva Tarea'}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel>Título</FormLabel>
              <Input
                placeholder="Título de la tarea"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.description}>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                placeholder="Descripción de la tarea (opcional)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>

            <HStack spacing={4} width="100%">
              <FormControl>
                <FormLabel>Prioridad</FormLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value as TaskPriority)}
                >
                  <option value={TaskPriority.LOW}>Baja</option>
                  <option value={TaskPriority.MEDIUM}>Media</option>
                  <option value={TaskPriority.HIGH}>Alta</option>
                  <option value={TaskPriority.URGENT}>Urgente</option>
                </Select>
              </FormControl>

              {task && (
                <FormControl>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as TaskStatus)}
                  >
                    <option value={TaskStatus.PENDING}>Pendiente</option>
                    <option value={TaskStatus.IN_PROGRESS}>En Progreso</option>
                    <option value={TaskStatus.COMPLETED}>Completada</option>
                    <option value={TaskStatus.CANCELLED}>Cancelada</option>
                  </Select>
                </FormControl>
              )}
            </HStack>

            <FormControl>
              <FormLabel>Fecha límite (opcional)</FormLabel>
              <Input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit}
            isLoading={loading}
            loadingText={task ? 'Actualizando...' : 'Creando...'}
          >
            {task ? 'Actualizar' : 'Crear'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;
