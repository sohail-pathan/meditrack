package com.meditrack.controller;
import com.meditrack.dto.ApiResponse;
import com.meditrack.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {
    private final DoctorService doctorService;
    public DoctorController(DoctorService doctorService) { this.doctorService = doctorService; }

    @GetMapping("/patients")
    public ResponseEntity<ApiResponse<?>> getAllPatients(){ return ResponseEntity.ok(ApiResponse.success("Patients fetched", doctorService.getAllPatients())); }
    @GetMapping("/patients/search")
    public ResponseEntity<ApiResponse<?>> searchPatients(@RequestParam String name){ return ResponseEntity.ok(ApiResponse.success("Search results", doctorService.searchPatients(name))); }
    @GetMapping("/patients/{id}/records")
    public ResponseEntity<ApiResponse<?>> getPatientRecords(@PathVariable Long id){ return ResponseEntity.ok(ApiResponse.success("Records fetched", doctorService.getPatientRecords(id))); }
    @PutMapping("/records/{id}/notes")
    public ResponseEntity<ApiResponse<?>> addNotes(Authentication auth, @PathVariable Long id, @RequestBody Map<String,String> body){
        return ResponseEntity.ok(ApiResponse.success("Notes added", doctorService.addNotes(id, body.get("notes"), auth.getName())));
    }
}
