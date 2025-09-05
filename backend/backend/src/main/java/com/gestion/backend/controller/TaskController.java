package com.gestion.backend.controller;

import com.gestion.backend.dto.TaskRequest;
import com.gestion.backend.dto.TaskResponse;
import com.gestion.backend.dto.TaskStatsResponse;
import com.gestion.backend.dto.TaskUpdateRequest;
import com.gestion.backend.entity.Task.TaskStatus;
import com.gestion.backend.entity.Task.TaskPriority;
import com.gestion.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"}, maxAge = 3600, allowCredentials = "true")
public class TaskController {
    
    private final TaskService taskService;
    
    // Crear nueva tarea
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest request,
            Authentication authentication) {
        try {
            TaskResponse response = taskService.createTask(request, authentication.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Obtener todas las tareas del usuario
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(Authentication authentication) {
        try {
            List<TaskResponse> tasks = taskService.getAllUserTasks(authentication.getName());
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Obtener una tarea específica
    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long taskId,
            Authentication authentication) {
        try {
            TaskResponse task = taskService.getTaskById(taskId, authentication.getName());
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Actualizar tarea
    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskUpdateRequest request,
            Authentication authentication) {
        try {
            TaskResponse response = taskService.updateTask(taskId, request, authentication.getName());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Eliminar tarea
    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId,
            Authentication authentication) {
        try {
            taskService.deleteTask(taskId, authentication.getName());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Obtener tareas por estado
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TaskResponse>> getTasksByStatus(
            @PathVariable TaskStatus status,
            Authentication authentication) {
        try {
            List<TaskResponse> tasks = taskService.getUserTasksByStatus(authentication.getName(), status);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Obtener tareas por prioridad
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<TaskResponse>> getTasksByPriority(
            @PathVariable TaskPriority priority,
            Authentication authentication) {
        try {
            List<TaskResponse> tasks = taskService.getUserTasksByPriority(authentication.getName(), priority);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Buscar tareas
    @GetMapping("/search")
    public ResponseEntity<List<TaskResponse>> searchTasks(
            @RequestParam String query,
            Authentication authentication) {
        try {
            List<TaskResponse> tasks = taskService.searchTasks(authentication.getName(), query);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Obtener estadísticas de tareas
    @GetMapping("/stats")
    public ResponseEntity<TaskStatsResponse> getTaskStats(Authentication authentication) {
        try {
            TaskStatsResponse stats = taskService.getUserTaskStats(authentication.getName());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Obtener tareas próximas (próximos N días)
    @GetMapping("/upcoming")
    public ResponseEntity<List<TaskResponse>> getUpcomingTasks(
            @RequestParam(defaultValue = "7") int days,
            Authentication authentication) {
        try {
            List<TaskResponse> tasks = taskService.getUpcomingTasks(authentication.getName(), days);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Obtener tareas vencidas
    @GetMapping("/overdue")
    public ResponseEntity<List<TaskResponse>> getOverdueTasks(Authentication authentication) {
        try {
            List<TaskResponse> tasks = taskService.getOverdueTasks(authentication.getName());
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
