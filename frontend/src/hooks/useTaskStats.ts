'use client';

import { useState, useCallback } from 'react';
import { TaskStats } from '@/types/task';
import { apiRequest } from '@/services/api';

export interface UseTaskStatsReturn {
  taskStats: TaskStats | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
  clearError: () => void;
}

export const useTaskStats = (): UseTaskStatsReturn => {
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: any) => {
    console.error('Task stats error:', err);
    
    // Si es un error de permisos (403), mostrar mensaje más amigable
    if (err.message && err.message.includes('permisos')) {
      setError('No tienes permisos para ver las estadísticas detalladas.');
    } else {
      setError(err.message || 'Ha ocurrido un error inesperado');
    }
  }, []);

  // Obtener estadísticas
  const refreshStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest<TaskStats>('/tasks/stats', {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        setTaskStats(response.data);
      } else {
        throw new Error(response.error || 'Error al cargar las estadísticas');
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  return {
    taskStats,
    loading,
    error,
    refreshStats,
    clearError,
  };
};
