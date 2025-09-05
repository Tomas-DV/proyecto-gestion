'use client';

import { useState, useCallback } from 'react';
import { 
  Task, 
  TaskRequest, 
  TaskUpdateRequest, 
  TaskStatus, 
  TaskPriority 
} from '@/types/task';
import { apiRequest } from '@/services/api';

export interface UseTaskReturn {
  // Estado
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // Acciones CRUD
  createTask: (taskData: TaskRequest) => Promise<Task | null>;
  updateTask: (taskId: number, updates: TaskUpdateRequest) => Promise<Task | null>;
  deleteTask: (taskId: number) => Promise<boolean>;
  
  // Consultas
  refreshTasks: () => Promise<void>;
  getTasksByStatus: (status: TaskStatus) => Promise<Task[]>;
  getTasksByPriority: (priority: TaskPriority) => Promise<Task[]>;
  searchTasks: (query: string) => Promise<Task[]>;
  getUpcomingTasks: (days?: number) => Promise<Task[]>;
  getOverdueTasks: () => Promise<Task[]>;
  
  // Utilidades
  clearError: () => void;
  loadTasks: () => Promise<void>;
}

export const useTask = (): UseTaskReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: any) => {
    console.error('Task operation error:', err);
    setError(err.message || 'Ha ocurrido un error inesperado');
  }, []);

  // Obtener todas las tareas
  const refreshTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest<Task[]>('/tasks', {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        throw new Error(response.error || 'Error al cargar las tareas');
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);


  // Crear nueva tarea
  const createTask = useCallback(async (taskData: TaskRequest): Promise<Task | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      
      if (response.success && response.data) {
        // Agregar la nueva tarea al estado local
        setTasks(prev => [response.data!, ...prev]);
        return response.data;
      } else {
        throw new Error(response.error || 'Error al crear la tarea');
      }
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Actualizar tarea
  const updateTask = useCallback(async (taskId: number, updates: TaskUpdateRequest): Promise<Task | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest<Task>(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      if (response.success && response.data) {
        // Actualizar la tarea en el estado local
        setTasks(prev => prev.map(task => 
          task.id === taskId ? response.data! : task
        ));
        return response.data;
      } else {
        throw new Error(response.error || 'Error al actualizar la tarea');
      }
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Eliminar tarea
  const deleteTask = useCallback(async (taskId: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest(`/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      if (response.success) {
        // Remover la tarea del estado local
        setTasks(prev => prev.filter(task => task.id !== taskId));
        return true;
      } else {
        throw new Error(response.error || 'Error al eliminar la tarea');
      }
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Obtener tareas por estado
  const getTasksByStatus = useCallback(async (status: TaskStatus): Promise<Task[]> => {
    try {
      const response = await apiRequest<Task[]>(`/tasks/status/${status}`, {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error al filtrar tareas por estado');
      }
    } catch (err) {
      handleError(err);
      return [];
    }
  }, [handleError]);

  // Obtener tareas por prioridad
  const getTasksByPriority = useCallback(async (priority: TaskPriority): Promise<Task[]> => {
    try {
      const response = await apiRequest<Task[]>(`/tasks/priority/${priority}`, {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error al filtrar tareas por prioridad');
      }
    } catch (err) {
      handleError(err);
      return [];
    }
  }, [handleError]);

  // Buscar tareas
  const searchTasks = useCallback(async (query: string): Promise<Task[]> => {
    try {
      const response = await apiRequest<Task[]>(`/tasks/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error en la búsqueda de tareas');
      }
    } catch (err) {
      handleError(err);
      return [];
    }
  }, [handleError]);

  // Obtener tareas próximas
  const getUpcomingTasks = useCallback(async (days: number = 7): Promise<Task[]> => {
    try {
      const response = await apiRequest<Task[]>(`/tasks/upcoming?days=${days}`, {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error al obtener tareas próximas');
      }
    } catch (err) {
      handleError(err);
      return [];
    }
  }, [handleError]);

  // Obtener tareas vencidas
  const getOverdueTasks = useCallback(async (): Promise<Task[]> => {
    try {
      const response = await apiRequest<Task[]>('/tasks/overdue', {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Error al obtener tareas vencidas');
      }
    } catch (err) {
      handleError(err);
      return [];
    }
  }, [handleError]);

  // Función para cargar datos iniciales manualmente
  const loadTasks = useCallback(async () => {
    await refreshTasks();
  }, [refreshTasks]);

  return {
    // Estado
    tasks,
    loading,
    error,
    
    // Acciones CRUD
    createTask,
    updateTask,
    deleteTask,
    
    // Consultas
    refreshTasks,
    getTasksByStatus,
    getTasksByPriority,
    searchTasks,
    getUpcomingTasks,
    getOverdueTasks,
    
    // Utilidades
    clearError,
    loadTasks
  };
};
