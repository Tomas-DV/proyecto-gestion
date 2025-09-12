package com.gestion.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"}, maxAge = 3600, allowCredentials = "true")
public class InventoryController {
    
    // Obtener todos los items de inventario
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllInventoryItems(Authentication authentication) {
        try {
            // Por ahora retornamos datos de ejemplo
            // Aquí implementarías la lógica real del inventario
            List<Map<String, Object>> items = List.of(
                Map.of(
                    "id", 1,
                    "name", "Producto de ejemplo",
                    "quantity", 10,
                    "price", 29.99,
                    "category", "Electrónicos"
                )
            );
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Crear nuevo item de inventario
    @PostMapping
    public ResponseEntity<Map<String, Object>> createInventoryItem(
            @RequestBody Map<String, Object> itemData,
            Authentication authentication) {
        try {
            // Lógica para crear item
            // Por ahora retornamos los datos recibidos con un ID
            itemData.put("id", System.currentTimeMillis());
            return ResponseEntity.ok(itemData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Actualizar item de inventario
    @PutMapping("/{itemId}")
    public ResponseEntity<Map<String, Object>> updateInventoryItem(
            @PathVariable Long itemId,
            @RequestBody Map<String, Object> itemData,
            Authentication authentication) {
        try {
            // Lógica para actualizar item
            itemData.put("id", itemId);
            return ResponseEntity.ok(itemData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Eliminar item de inventario
    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteInventoryItem(
            @PathVariable Long itemId,
            Authentication authentication) {
        try {
            // Lógica para eliminar item
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
