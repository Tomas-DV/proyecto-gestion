'use client';

import { useCallback } from 'react';
import { useTask } from './useTask';
import { useTaskStats } from './useTaskStats';
import { TaskRequest, TaskUpdateRequest } from '@/types/task';

export interface UseTaskWithStatsReturn {
  // Del hook useTask
  tasks: ReturnType<typeof useTask>['tasks'];
  loading: ReturnType<typeof useTask>['loading'];
  error: ReturnType<typeof useTask>['error'];
  refreshTasks: ReturnType<typeof useTask>['refreshTasks'];
  getTasksByStatus: ReturnType<typeof useTask>['getTasksByStatus'];
  getTasksByPriority: ReturnType<typeof useTask>['getTasksByPriority'];
  searchTasks: ReturnType<typeof useTask>['searchTasks'];
  getUpcomingTasks: ReturnType<typeof useTask>['getUpcomingTasks'];
  getOverdueTasks: ReturnType<typeof useTask>['getOverdueTasks'];
  clearError: ReturnType<typeof useTask>['clearError'];
  loadTasks: ReturnType<typeof useTask>['loadTasks'];
  
  // Del hook useTaskStats
  taskStats: ReturnType<typeof useTaskStats>['taskStats'];
  statsLoading: ReturnType<typeof useTaskStats>['loading'];
  statsError: ReturnType<typeof useTaskStats>['error'];
  refreshStats: ReturnType<typeof useTaskStats>['refreshStats'];
  clearStatsError: ReturnType<typeof useTaskStats>['clearError'];
  
  // Acciones CRUD que actualizan estadísticas automáticamente
  createTask: (taskData: TaskRequest) => Promise<ReturnType<typeof useTask>['createTask'] extends (...args: any[]) => Promise<infer T> ? T : never>;
  updateTask: (taskId: number, updates: TaskUpdateRequest) => Promise<ReturnType<typeof useTask>['updateTask'] extends (...args: any[]) => Promise<infer T> ? T : never>;
  deleteTask: (taskId: number) => Promise<boolean>;
  
  // Función para cargar ambos conjuntos de datos
  loadAllData: () => Promise<void>;
}

export const useTaskWithStats = (): UseTaskWithStatsReturn => {
  const taskHook = useTask();
  const statsHook = useTaskStats();

  // Wrapper para createTask que actualiza estadísticas
  const createTask = useCallback(async (taskData: TaskRequest) => {
    const result = await taskHook.createTask(taskData);
    if (result) {
      // Actualizar estadísticas después de crear una tarea
      await statsHook.refreshStats();
    }
    return result;
  }, [taskHook.createTask, statsHook.refreshStats]);

  // Wrapper para updateTask que actualiza estadísticas si cambió el estado
  const updateTask = useCallback(async (taskId: number, updates: TaskUpdateRequest) => {
    const result = await taskHook.updateTask(taskId, updates);
    if (result && updates.status) {
      // Actualizar estadísticas solo si cambió el estado
      await statsHook.refreshStats();
    }
    return result;
  }, [taskHook.updateTask, statsHook.refreshStats]);

  // Wrapper para deleteTask que actualiza estadísticas
  const deleteTask = useCallback(async (taskId: number) => {
    const result = await taskHook.deleteTask(taskId);
    if (result) {
      // Actualizar estadísticas después de eliminar una tarea
      await statsHook.refreshStats();
    }
    return result;
  }, [taskHook.deleteTask, statsHook.refreshStats]);

  // Función para cargar ambos conjuntos de datos
  const loadAllData = useCallback(async () => {
    await Promise.all([
      taskHook.loadTasks(),
      statsHook.refreshStats()
    ]);
  }, [taskHook.loadTasks, statsHook.refreshStats]);

  return {
    // Del hook useTask
    tasks: taskHook.tasks,
    loading: taskHook.loading,
    error: taskHook.error,
    refreshTasks: taskHook.refreshTasks,
    getTasksByStatus: taskHook.getTasksByStatus,
    getTasksByPriority: taskHook.getTasksByPriority,
    searchTasks: taskHook.searchTasks,
    getUpcomingTasks: taskHook.getUpcomingTasks,
    getOverdueTasks: taskHook.getOverdueTasks,
    clearError: taskHook.clearError,
    loadTasks: taskHook.loadTasks,
    
    // Del hook useTaskStats
    taskStats: statsHook.taskStats,
    statsLoading: statsHook.loading,
    statsError: statsHook.error,
    refreshStats: statsHook.refreshStats,
    clearStatsError: statsHook.clearError,
    
    // Acciones CRUD con actualización automática de estadísticas
    createTask,
    updateTask,
    deleteTask,
    
    // Función para cargar todo
    loadAllData,
  };
};
