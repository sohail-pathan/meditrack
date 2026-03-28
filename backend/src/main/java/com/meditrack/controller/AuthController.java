package com.meditrack.controller;
import com.meditrack.dto.ApiResponse;
import com.meditrack.dto.LoginRequest;
import com.meditrack.dto.RegisterRequest;
import com.meditrack.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@RequestBody RegisterRequest request){ return ResponseEntity.ok(ApiResponse.success("Registered successfully", authService.register(request))); }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@RequestBody LoginRequest request){ return ResponseEntity.ok(ApiResponse.success("Login successful", authService.login(request))); }
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> me(@RequestHeader("Authorization") String token){ return ResponseEntity.ok(ApiResponse.success("User fetched", authService.me(token))); }
}
