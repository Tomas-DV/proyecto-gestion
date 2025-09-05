package com.gestion.backend.dto;

import com.gestion.backend.entity.Task.TaskPriority;
import com.gestion.backend.entity.Task.TaskStatus;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskUpdateRequest {
    
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    private TaskStatus status;
    
    private TaskPriority priority;
    
    private LocalDateTime dueDate;
}
