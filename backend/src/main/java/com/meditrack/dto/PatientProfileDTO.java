package com.meditrack.dto;
import com.meditrack.entity.Patient;
import java.time.LocalDate;

public class PatientProfileDTO {
    private Long id, userId;
    private String name, email, phone, healthId, bloodGroup, allergies, chronicConditions;
    private String emergencyContactName, emergencyContactPhone, address, gender, qrToken;
    private LocalDate dateOfBirth;
    private long totalRecords;

    public static PatientProfileDTO fromEntity(Patient p){
        PatientProfileDTO d = new PatientProfileDTO();
        d.setId(p.getId()); d.setUserId(p.getUser().getId());
        d.setName(p.getUser().getName()); d.setEmail(p.getUser().getEmail()); d.setPhone(p.getUser().getPhone());
        d.setHealthId(p.getHealthId()); d.setBloodGroup(p.getBloodGroup()); d.setAllergies(p.getAllergies());
        d.setChronicConditions(p.getChronicConditions());
        d.setEmergencyContactName(p.getEmergencyContactName()); d.setEmergencyContactPhone(p.getEmergencyContactPhone());
        d.setDateOfBirth(p.getDateOfBirth()); d.setAddress(p.getAddress()); d.setGender(p.getGender()); d.setQrToken(p.getQrToken());
        return d;
    }

    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; } public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; } public void setPhone(String phone) { this.phone = phone; }
    public String getHealthId() { return healthId; } public void setHealthId(String healthId) { this.healthId = healthId; }
    public String getBloodGroup() { return bloodGroup; } public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getAllergies() { return allergies; } public void setAllergies(String allergies) { this.allergies = allergies; }
    public String getChronicConditions() { return chronicConditions; } public void setChronicConditions(String chronicConditions) { this.chronicConditions = chronicConditions; }
    public String getEmergencyContactName() { return emergencyContactName; } public void setEmergencyContactName(String v) { this.emergencyContactName = v; }
    public String getEmergencyContactPhone() { return emergencyContactPhone; } public void setEmergencyContactPhone(String v) { this.emergencyContactPhone = v; }
    public String getAddress() { return address; } public void setAddress(String address) { this.address = address; }
    public String getGender() { return gender; } public void setGender(String gender) { this.gender = gender; }
    public String getQrToken() { return qrToken; } public void setQrToken(String qrToken) { this.qrToken = qrToken; }
    public LocalDate getDateOfBirth() { return dateOfBirth; } public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public long getTotalRecords() { return totalRecords; } public void setTotalRecords(long totalRecords) { this.totalRecords = totalRecords; }
}
