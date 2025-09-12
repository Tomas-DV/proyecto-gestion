package com.gestion.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"}, allowCredentials = "true")
public class TestController {
    
    @GetMapping("/public")
    public ResponseEntity<String> publicEndpoint() {
        return ResponseEntity.ok("This is a public endpoint - no authentication required!");
    }
    
    @GetMapping("/protected")
    public ResponseEntity<String> protectedEndpoint(Authentication authentication) {
        return ResponseEntity.ok("Hello " + authentication.getName() + "! This is a protected endpoint.");
    }
    
    @GetMapping("/auth-info")
    public ResponseEntity<Map<String, Object>> authInfo(HttpServletRequest request, Authentication authentication) {
        Map<String, Object> info = new HashMap<>();
        
        info.put("hasAuthHeader", request.getHeader("Authorization") != null);
        info.put("authHeaderValue", request.getHeader("Authorization") != null ? 
            request.getHeader("Authorization").substring(0, Math.min(20, request.getHeader("Authorization").length())) + "..." 
            : "null");
        info.put("hasSecurityContext", SecurityContextHolder.getContext().getAuthentication() != null);
        info.put("isAuthenticated", authentication != null);
        info.put("username", authentication != null ? authentication.getName() : "null");
        info.put("authorities", authentication != null ? authentication.getAuthorities() : "null");
        info.put("requestURI", request.getRequestURI());
        info.put("method", request.getMethod());
        
        return ResponseEntity.ok(info);
    }
    
    @GetMapping("/admin")
    public ResponseEntity<String> adminEndpoint(Authentication authentication) {
        return ResponseEntity.ok("Hello Admin " + authentication.getName() + "! This is an admin-only endpoint.");
    }
}
