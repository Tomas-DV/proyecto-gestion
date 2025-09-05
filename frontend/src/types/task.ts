export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // ISO string
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  userId: number;
  username: string;
}

export interface TaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string; // ISO string
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string; // ISO string
}

export interface TaskStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  cancelledTasks: number;
  overdueTasks: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
}

// Utilidades para UI
export const getStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.PENDING:
      return 'orange';
    case TaskStatus.IN_PROGRESS:
      return 'blue';
    case TaskStatus.COMPLETED:
      return 'green';
    case TaskStatus.CANCELLED:
      return 'red';
    default:
      return 'gray';
  }
};

export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case TaskPriority.LOW:
      return 'green';
    case TaskPriority.MEDIUM:
      return 'yellow';
    case TaskPriority.HIGH:
      return 'orange';
    case TaskPriority.URGENT:
      return 'red';
    default:
      return 'gray';
  }
};

export const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.PENDING:
      return 'Pendiente';
    case TaskStatus.IN_PROGRESS:
      return 'En Progreso';
    case TaskStatus.COMPLETED:
      return 'Completada';
    case TaskStatus.CANCELLED:
      return 'Cancelada';
    default:
      return status;
  }
};

export const getPriorityLabel = (priority: TaskPriority): string => {
  switch (priority) {
    case TaskPriority.LOW:
      return 'Baja';
    case TaskPriority.MEDIUM:
      return 'Media';
    case TaskPriority.HIGH:
      return 'Alta';
    case TaskPriority.URGENT:
      return 'Urgente';
    default:
      return priority;
  }
};
