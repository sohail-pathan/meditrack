package com.meditrack.service;

import com.meditrack.entity.User;
import com.meditrack.repository.*;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepo;
    private final PatientRepository patientRepo;
    private final MedicalRecordRepository recordRepo;

    public AdminService(UserRepository userRepo, PatientRepository patientRepo, MedicalRecordRepository recordRepo) {
        this.userRepo = userRepo;
        this.patientRepo = patientRepo;
        this.recordRepo = recordRepo;
    }

    public Map<String,Object> getStats(){
        return Map.of(
            "totalUsers", userRepo.count(),
            "totalPatients", userRepo.countByRole(User.Role.PATIENT),
            "totalDoctors", userRepo.countByRole(User.Role.DOCTOR),
            "totalRecords", recordRepo.count()
        );
    }

    public List<Map<String,Object>> getAllUsers(){
        return userRepo.findAll().stream().map(u -> {
            Map<String,Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("role", u.getRole());
            map.put("active", u.isActive());
            map.put("createdAt", u.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
    }

    public void toggleUser(Long userId){
        User user = userRepo.findById(userId).orElseThrow();
        user.setActive(!user.isActive());
        userRepo.save(user);
    }

    public void deleteUser(Long userId){ userRepo.deleteById(userId); }

	public PatientRepository getPatientRepo() {
		return patientRepo;
	}
}