package com.meditrack.controller;
import com.meditrack.dto.ApiResponse;
import com.meditrack.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;
    public AdminController(AdminService adminService) { this.adminService = adminService; }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<?>> getStats(){ return ResponseEntity.ok(ApiResponse.success("Stats fetched", adminService.getStats())); }
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<?>> getAllUsers(){ return ResponseEntity.ok(ApiResponse.success("Users fetched", adminService.getAllUsers())); }
    @PutMapping("/users/{id}/toggle")
    public ResponseEntity<ApiResponse<?>> toggleUser(@PathVariable Long id){ adminService.toggleUser(id); return ResponseEntity.ok(ApiResponse.success("Toggled", null)); }
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable Long id){ adminService.deleteUser(id); return ResponseEntity.ok(ApiResponse.success("Deleted", null)); }
}
