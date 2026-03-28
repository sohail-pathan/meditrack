package com.meditrack.controller;
import com.meditrack.dto.ApiResponse;
import com.meditrack.dto.PatientProfileDTO;
import com.meditrack.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/patient")
public class PatientController {
    private final PatientService patientService;
    public PatientController(PatientService patientService) { this.patientService = patientService; }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<?>> getProfile(Authentication auth){ return ResponseEntity.ok(ApiResponse.success("Profile fetched", patientService.getProfile(auth.getName()))); }
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<?>> updateProfile(Authentication auth, @RequestBody PatientProfileDTO dto){ return ResponseEntity.ok(ApiResponse.success("Profile updated", patientService.updateProfile(auth.getName(), dto))); }
    @GetMapping("/records")
    public ResponseEntity<ApiResponse<?>> getRecords(Authentication auth){ return ResponseEntity.ok(ApiResponse.success("Records fetched", patientService.getRecords(auth.getName()))); }
    @PostMapping("/records/upload")
    public ResponseEntity<ApiResponse<?>> uploadRecord(Authentication auth, @RequestParam String title, @RequestParam String recordType, @RequestParam(required=false) String description, @RequestParam(required=false) MultipartFile file){
        return ResponseEntity.ok(ApiResponse.success("Record uploaded", patientService.uploadRecord(auth.getName(), title, recordType, description, file)));
    }
}
