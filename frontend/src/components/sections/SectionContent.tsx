'use client';

import {
  Box,
  VStack,
  Text,
  SimpleGrid,
  Button,
  Input,
  HStack,
  Select,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiTrash2, FiDownload, FiSearch, FiFilter } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardContent from '@/components/dashboard/DashboardContent';
import ApiTestComponent from '@/components/api/ApiTestComponent';
import TaskCard from '@/components/tasks/TaskCard';
import TaskModal from '@/components/tasks/TaskModal';
import ApiDebug from '@/components/debug/ApiDebug';
import { useTask } from '@/hooks/useTask';
import { Task, TaskStatus, TaskPriority, TaskRequest, TaskUpdateRequest } from '@/types/task';

interface SectionContentProps {
  section: string;
  onSectionChange: (section: string) => void;
}

const TaskManagement = () => {
  // Colores adaptativos
  const titleColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const noTasksTextColor = useColorModeValue('gray.500', 'gray.400');
  
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    clearError,
    loadTasks,
  } = useTask();

  // Cargar tareas solo cuando se monta el componente TaskManagement
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');

  // Filtrar tareas según los criterios
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateTask = () => {
    setEditingTask(null);
    onModalOpen();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    onModalOpen();
  };

  const handleSaveTask = async (data: TaskRequest | TaskUpdateRequest) => {
    if (editingTask) {
      return await updateTask(editingTask.id, data as TaskUpdateRequest);
    } else {
      return await createTask(data as TaskRequest);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header con título y botón crear */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={4}>
        <Text fontSize="2xl" fontWeight="bold" color={titleColor}>Gestión de Tareas</Text>
        <Button colorScheme="blue" onClick={handleCreateTask}>
          <FiPlus style={{ marginRight: '8px' }} />
          Nueva Tarea
        </Button>
      </Box>

      {/* Filtros y búsqueda */}
      <Box bg={cardBg} p={4} borderRadius="md" boxShadow="sm">
        <VStack spacing={4}>
          <HStack spacing={4} width="100%" flexWrap="wrap">
            <Box flex={1} minW="250px">
              <HStack>
                <FiSearch />
                <Input
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </HStack>
            </Box>
            
            <Select
              placeholder="Filtrar por estado"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus)}
              maxW="200px"
            >
              <option value={TaskStatus.PENDING}>Pendiente</option>
              <option value={TaskStatus.IN_PROGRESS}>En Progreso</option>
              <option value={TaskStatus.COMPLETED}>Completada</option>
              <option value={TaskStatus.CANCELLED}>Cancelada</option>
            </Select>
            
            <Select
              placeholder="Filtrar por prioridad"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TaskPriority)}
              maxW="200px"
            >
              <option value={TaskPriority.LOW}>Baja</option>
              <option value={TaskPriority.MEDIUM}>Media</option>
              <option value={TaskPriority.HIGH}>Alta</option>
              <option value={TaskPriority.URGENT}>Urgente</option>
            </Select>
            
            {(searchTerm || statusFilter || priorityFilter) && (
              <Button size="sm" variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
          </HStack>
        </VStack>
      </Box>

      {/* Mostrar errores */}
      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
          <Button ml="auto" size="sm" variant="ghost" onClick={clearError}>
            Cerrar
          </Button>
        </Alert>
      )}

      {/* Loading state */}
      {loading && (
        <Box display="flex" justifyContent="center" py={8}>
          <Spinner size="lg" color="blue.500" />
        </Box>
      )}

      {/* Lista de tareas */}
      {!loading && (
        <VStack spacing={4}>
          {filteredTasks.length === 0 ? (
            <Box
              bg={cardBg}
              p={8}
              borderRadius="md"
              boxShadow="sm"
              w="100%"
              textAlign="center"
            >
              <Text color={noTasksTextColor}>
                {tasks.length === 0 
                  ? 'No tienes tareas aún. ¡Crea tu primera tarea!' 
                  : 'No se encontraron tareas con los filtros aplicados.'}
              </Text>
            </Box>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={deleteTask}
                loading={loading}
              />
            ))
          )}
        </VStack>
      )}

      {/* Modal para crear/editar tareas */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        onSave={handleSaveTask}
        task={editingTask}
        loading={loading}
      />
    </VStack>
  );
};

const SectionContent = ({ section, onSectionChange }: SectionContentProps) => {
  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'login': return 'Login';
      case 'register': return 'Registro';
      case 'dashboard': return 'Dashboard';
      case 'tasks': return 'Gestión de Tareas / Inventario';
      case 'components': return 'Componentes';
      case 'api': return 'API - Conexión con Spring Boot';
      default: return 'Bienvenido a tu App de Gestión';
    }
  };

  const renderContent = () => {
    switch (section) {
      case 'login':
        return <LoginForm onSectionChange={onSectionChange} />;

      case 'register':
        return <RegisterForm onSectionChange={onSectionChange} />;

      case 'dashboard':
        return <DashboardContent />;

      case 'tasks':
        return (
          <ProtectedRoute 
            requireAuth={true} 
            onRedirectToLogin={() => onSectionChange('login')}
          >
            <TaskManagement />
          </ProtectedRoute>
        );

      case 'components':
        return (
          <VStack spacing={6} align="stretch">
            <Text fontSize="2xl" fontWeight="bold">Componentes del Sistema</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box bg="white" p={6} borderRadius="md" boxShadow="lg">
                <Text fontSize="lg" fontWeight="semibold" mb={3}>Componentes UI</Text>
                <VStack align="start" spacing={2}>
                  <Text>• Sidebar Navigation</Text>
                  <Text>• Header Bar</Text>
                  <Text>• Card Components</Text>
                  <Text>• Form Controls</Text>
                  <Text>• Button Variants</Text>
                </VStack>
              </Box>
              <Box bg="white" p={6} borderRadius="md" boxShadow="lg">
                <Text fontSize="lg" fontWeight="semibold" mb={3}>Funcionalidades</Text>
                <VStack align="start" spacing={2}>
                  <Text>• Autenticación</Text>
                  <Text>• Gestión de Datos</Text>
                  <Text>• API Integration</Text>
                  <Text>• Theme Toggle</Text>
                  <Text>• Responsive Design</Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </VStack>
        );

      case 'api':
        return <ApiTestComponent />;

      case 'debug':
        return <ApiDebug />;

      default:
        return (
          <Box bg="white" p={8} borderRadius="md" boxShadow="lg">
            <VStack spacing={4}>
              <Text fontSize="2xl" fontWeight="bold">Bienvenido a tu App de Gestión</Text>
              <Text textAlign="center" color="gray.600">
                Esta es una aplicación de gestión personal/empresarial construida con Spring Boot y Next.js.
                Utiliza el menú lateral para navegar entre las diferentes secciones.
              </Text>
            </VStack>
          </Box>
        );
    }
  };

  return (
    <Box>
      {renderContent()}
    </Box>
  );
};

export default SectionContent;
