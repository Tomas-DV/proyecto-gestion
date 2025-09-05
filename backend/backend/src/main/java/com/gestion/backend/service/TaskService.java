package com.gestion.backend.service;

import com.gestion.backend.dto.TaskRequest;
import com.gestion.backend.dto.TaskResponse;
import com.gestion.backend.dto.TaskStatsResponse;
import com.gestion.backend.dto.TaskUpdateRequest;
import com.gestion.backend.entity.Task;
import com.gestion.backend.entity.Task.TaskStatus;
import com.gestion.backend.entity.Task.TaskPriority;
import com.gestion.backend.entity.User;
import com.gestion.backend.repository.TaskRepository;
import com.gestion.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    
    public TaskResponse createTask(TaskRequest request, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.PENDING);
        task.setPriority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM);
        task.setDueDate(request.getDueDate());
        task.setUser(user);
        
        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllUserTasks(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Task> tasks = taskRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return tasks.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getUserTasksByStatus(String username, TaskStatus status) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Task> tasks = taskRepository.findByUserIdAndStatusOrderByCreatedAtDesc(user.getId(), status);
        return tasks.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getUserTasksByPriority(String username, TaskPriority priority) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Task> tasks = taskRepository.findByUserIdAndPriorityOrderByCreatedAtDesc(user.getId(), priority);
        return tasks.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long taskId, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        return mapToResponse(task);
    }
    
    public TaskResponse updateTask(Long taskId, TaskUpdateRequest request, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        // Actualizar solo los campos que no son null en el request
        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        
        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }
    
    public void deleteTask(Long taskId, String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        taskRepository.delete(task);
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> searchTasks(String username, String searchTerm) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Task> tasks = taskRepository.findByUserIdAndTitleOrDescriptionContaining(user.getId(), searchTerm);
        return tasks.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public TaskStatsResponse getUserTaskStats(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Long userId = user.getId();
        
        long totalTasks = taskRepository.countByUserId(userId);
        long pendingTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.PENDING);
        long inProgressTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.IN_PROGRESS);
        long completedTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.COMPLETED);
        long cancelledTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.CANCELLED);
        
        // Tareas vencidas
        List<Task> overdueTasks = taskRepository.findOverdueTasks(userId, LocalDateTime.now());
        long overdueCount = overdueTasks.size();
        
        return new TaskStatsResponse(
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
            cancelledTasks,
            overdueCount
        );
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getUpcomingTasks(String username, int days) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = startDate.plusDays(days);
        
        List<Task> tasks = taskRepository.findUpcomingTasks(user.getId(), startDate, endDate);
        return tasks.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<TaskResponse> getOverdueTasks(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Task> tasks = taskRepository.findOverdueTasks(user.getId(), LocalDateTime.now());
        return tasks.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    private TaskResponse mapToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setDueDate(task.getDueDate());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        response.setCompletedAt(task.getCompletedAt());
        response.setUserId(task.getUser().getId());
        response.setUsername(task.getUser().getUsername());
        return response;
    }
}
