package com.meditrack.service;
import com.meditrack.dto.*;
import com.meditrack.entity.*;
import com.meditrack.repository.*;
import com.meditrack.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository userRepo;
    private final PatientRepository patientRepo;
    private final EmergencyCardRepository emergencyCardRepo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepo, PatientRepository patientRepo,
                       EmergencyCardRepository emergencyCardRepo, JwtUtil jwtUtil,
                       PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.patientRepo = patientRepo;
        this.emergencyCardRepo = emergencyCardRepo;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Map<String,Object> register(RegisterRequest req){
        if(userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered");
        User user = new User();
        user.setEmail(req.getEmail());
        user.setName(req.getName());
        user.setPhone(req.getPhone());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole() != null ? req.getRole() : User.Role.PATIENT);
        user = userRepo.save(user);
        if(user.getRole() == User.Role.PATIENT){
            Patient patient = new Patient();
            patient.setUser(user);
            patient.setHealthId("MT-" + System.currentTimeMillis());
            patient.setQrToken(UUID.randomUUID().toString());
            patient = patientRepo.save(patient);
            EmergencyCard card = new EmergencyCard();
            card.setPatient(patient);
            card.setQrToken(patient.getQrToken());
            emergencyCardRepo.save(card);
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return Map.of("token", token, "role", user.getRole(), "name", user.getName(), "userId", user.getId());
    }

    public Map<String,Object> login(LoginRequest req){
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if(!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid email or password");
        if(!user.isActive()) throw new RuntimeException("Account is deactivated");
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return Map.of("token", token, "role", user.getRole(), "name", user.getName(), "userId", user.getId());
    }

    public Map<String,Object> me(String authHeader){
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        User user = userRepo.findByEmail(email).orElseThrow();
        return Map.of("id", user.getId(), "name", user.getName(),
                "email", user.getEmail(), "role", user.getRole(), "phone", user.getPhone() != null ? user.getPhone() : "");
    }
}
