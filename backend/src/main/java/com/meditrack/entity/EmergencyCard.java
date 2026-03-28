package com.meditrack.entity;
import jakarta.persistence.*;

@Entity
@Table(name="emergency_cards")
public class EmergencyCard {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @OneToOne @JoinColumn(name="patient_id",unique=true,nullable=false) private Patient patient;
    private String bloodGroup, allergies;
    @Column(columnDefinition="TEXT") private String criticalNotes;
    private String emergencyContactName, emergencyContactPhone, insuranceInfo;
    @Column(name="qr_token",unique=true) private String qrToken;

    public EmergencyCard() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public String getCriticalNotes() { return criticalNotes; }
    public void setCriticalNotes(String criticalNotes) { this.criticalNotes = criticalNotes; }
    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }
    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }
    public String getInsuranceInfo() { return insuranceInfo; }
    public void setInsuranceInfo(String insuranceInfo) { this.insuranceInfo = insuranceInfo; }
    public String getQrToken() { return qrToken; }
    public void setQrToken(String qrToken) { this.qrToken = qrToken; }
}
