package com.gestion.backend.repository;

import com.gestion.backend.entity.Task;
import com.gestion.backend.entity.Task.TaskStatus;
import com.gestion.backend.entity.Task.TaskPriority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Buscar todas las tareas de un usuario
    List<Task> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Buscar tareas por usuario y estado
    List<Task> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, TaskStatus status);
    
    // Buscar tareas por usuario y prioridad
    List<Task> findByUserIdAndPriorityOrderByCreatedAtDesc(Long userId, TaskPriority priority);
    
    // Buscar una tarea específica de un usuario
    Optional<Task> findByIdAndUserId(Long taskId, Long userId);
    
    // Contar tareas por estado y usuario
    long countByUserIdAndStatus(Long userId, TaskStatus status);
    
    // Contar todas las tareas de un usuario
    long countByUserId(Long userId);
    
    // Buscar tareas pendientes con fecha límite próxima
    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.status = 'PENDING' AND t.dueDate BETWEEN :startDate AND :endDate ORDER BY t.dueDate ASC")
    List<Task> findUpcomingTasks(@Param("userId") Long userId, 
                                @Param("startDate") LocalDateTime startDate, 
                                @Param("endDate") LocalDateTime endDate);
    
    // Buscar tareas por título o descripción (búsqueda)
    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND (LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) ORDER BY t.createdAt DESC")
    List<Task> findByUserIdAndTitleOrDescriptionContaining(@Param("userId") Long userId, 
                                                          @Param("searchTerm") String searchTerm);
    
    // Buscar tareas vencidas
    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.status != 'COMPLETED' AND t.status != 'CANCELLED' AND t.dueDate < :currentDate ORDER BY t.dueDate ASC")
    List<Task> findOverdueTasks(@Param("userId") Long userId, @Param("currentDate") LocalDateTime currentDate);
}
