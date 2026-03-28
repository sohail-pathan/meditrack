package com.meditrack.service;
import com.meditrack.entity.*;
import com.meditrack.repository.*;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class EmergencyCardService {
    private final EmergencyCardRepository emergencyCardRepo;
    private final PatientRepository patientRepo;
    private final UserRepository userRepo;

    public EmergencyCardService(EmergencyCardRepository emergencyCardRepo, PatientRepository patientRepo, UserRepository userRepo) {
        this.emergencyCardRepo = emergencyCardRepo;
        this.patientRepo = patientRepo;
        this.userRepo = userRepo;
    }

    public Map<String,Object> getByQrToken(String qrToken){
        EmergencyCard card = emergencyCardRepo.findByQrToken(qrToken)
                .orElseThrow(() -> new RuntimeException("Emergency card not found"));
        Patient patient = card.getPatient();
        return Map.of(
            "patientName", patient.getUser().getName(),
            "bloodGroup", card.getBloodGroup() != null ? card.getBloodGroup() : patient.getBloodGroup() != null ? patient.getBloodGroup() : "Not specified",
            "allergies", card.getAllergies() != null ? card.getAllergies() : patient.getAllergies() != null ? patient.getAllergies() : "None",
            "criticalNotes", card.getCriticalNotes() != null ? card.getCriticalNotes() : "",
            "emergencyContactName", card.getEmergencyContactName() != null ? card.getEmergencyContactName() : patient.getEmergencyContactName() != null ? patient.getEmergencyContactName() : "",
            "emergencyContactPhone", card.getEmergencyContactPhone() != null ? card.getEmergencyContactPhone() : patient.getEmergencyContactPhone() != null ? patient.getEmergencyContactPhone() : "",
            "healthId", patient.getHealthId() != null ? patient.getHealthId() : "",
            "insuranceInfo", card.getInsuranceInfo() != null ? card.getInsuranceInfo() : ""
        );
    }

    public Map<String,Object> getByEmail(String email){
        User user = userRepo.findByEmail(email).orElseThrow();
        Patient patient = patientRepo.findByUser(user).orElseThrow();
        EmergencyCard card = emergencyCardRepo.findByPatientId(patient.getId())
                .orElseThrow(() -> new RuntimeException("Emergency card not found"));
        return getByQrToken(card.getQrToken());
    }

    public EmergencyCard updateCard(String email, EmergencyCard req){
        User user = userRepo.findByEmail(email).orElseThrow();
        Patient patient = patientRepo.findByUser(user).orElseThrow();
        EmergencyCard card = emergencyCardRepo.findByPatientId(patient.getId())
                .orElseThrow(() -> new RuntimeException("Emergency card not found"));
        if(req.getBloodGroup()!=null) card.setBloodGroup(req.getBloodGroup());
        if(req.getAllergies()!=null) card.setAllergies(req.getAllergies());
        if(req.getCriticalNotes()!=null) card.setCriticalNotes(req.getCriticalNotes());
        if(req.getEmergencyContactName()!=null) card.setEmergencyContactName(req.getEmergencyContactName());
        if(req.getEmergencyContactPhone()!=null) card.setEmergencyContactPhone(req.getEmergencyContactPhone());
        if(req.getInsuranceInfo()!=null) card.setInsuranceInfo(req.getInsuranceInfo());
        return emergencyCardRepo.save(card);
    }
}
