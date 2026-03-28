package com.meditrack.dto;
import com.meditrack.entity.MedicalRecord;
import java.time.LocalDateTime;

public class MedicalRecordDTO {
    private Long id;
    private String title, description, doctorNotes, fileName, fileType;
    private MedicalRecord.RecordType recordType;
    private LocalDateTime recordDate, createdAt;
    private String doctorName, patientName;
    private Long patientId;

    public static MedicalRecordDTO fromEntity(MedicalRecord r){
        MedicalRecordDTO d = new MedicalRecordDTO();
        d.setId(r.getId()); d.setTitle(r.getTitle()); d.setDescription(r.getDescription());
        d.setDoctorNotes(r.getDoctorNotes()); d.setRecordType(r.getRecordType());
        d.setFileName(r.getFileName()); d.setFileType(r.getFileType());
        d.setRecordDate(r.getRecordDate()); d.setCreatedAt(r.getCreatedAt());
        if(r.getDoctor()!=null) d.setDoctorName(r.getDoctor().getUser().getName());
        if(r.getPatient()!=null){ d.setPatientName(r.getPatient().getUser().getName()); d.setPatientId(r.getPatient().getId()); }
        return d;
    }

    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public String getDoctorNotes() { return doctorNotes; } public void setDoctorNotes(String doctorNotes) { this.doctorNotes = doctorNotes; }
    public String getFileName() { return fileName; } public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileType() { return fileType; } public void setFileType(String fileType) { this.fileType = fileType; }
    public MedicalRecord.RecordType getRecordType() { return recordType; } public void setRecordType(MedicalRecord.RecordType recordType) { this.recordType = recordType; }
    public LocalDateTime getRecordDate() { return recordDate; } public void setRecordDate(LocalDateTime recordDate) { this.recordDate = recordDate; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getDoctorName() { return doctorName; } public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public String getPatientName() { return patientName; } public void setPatientName(String patientName) { this.patientName = patientName; }
    public Long getPatientId() { return patientId; } public void setPatientId(Long patientId) { this.patientId = patientId; }
}
