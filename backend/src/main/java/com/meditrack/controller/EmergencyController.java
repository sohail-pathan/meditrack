package com.meditrack.controller;
import com.meditrack.dto.ApiResponse;
import com.meditrack.entity.EmergencyCard;
import com.meditrack.service.EmergencyCardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyController {
    private final EmergencyCardService emergencyCardService;
    public EmergencyController(EmergencyCardService emergencyCardService) { this.emergencyCardService = emergencyCardService; }

    @GetMapping("/view/{qrToken}")
    public ResponseEntity<ApiResponse<?>> viewEmergencyCard(@PathVariable String qrToken){ return ResponseEntity.ok(ApiResponse.success("Emergency card fetched", emergencyCardService.getByQrToken(qrToken))); }
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<?>> getMyCard(Authentication auth){ return ResponseEntity.ok(ApiResponse.success("Emergency card fetched", emergencyCardService.getByEmail(auth.getName()))); }
    @PutMapping("/my")
    public ResponseEntity<ApiResponse<?>> updateMyCard(Authentication auth, @RequestBody EmergencyCard card){ return ResponseEntity.ok(ApiResponse.success("Updated", emergencyCardService.updateCard(auth.getName(), card))); }
}
