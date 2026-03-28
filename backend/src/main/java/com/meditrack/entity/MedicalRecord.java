package com.meditrack.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="medical_records")
public class MedicalRecord {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name="patient_id",nullable=false) private Patient patient;
    @ManyToOne @JoinColumn(name="doctor_id") private Doctor doctor;
    @Enumerated(EnumType.STRING) private RecordType recordType;
    private String title;
    @Column(columnDefinition="TEXT") private String description;
    @Column(columnDefinition="TEXT") private String doctorNotes;
    private String fileName, filePath, fileType;
    @Column(name="created_at") private LocalDateTime createdAt;
    @Column(name="record_date") private LocalDateTime recordDate;

    public MedicalRecord() {}
    @PrePersist public void prePersist(){
        this.createdAt = LocalDateTime.now();
        if(this.recordDate==null) this.recordDate=LocalDateTime.now();
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
    public RecordType getRecordType() { return recordType; }
    public void setRecordType(RecordType recordType) { this.recordType = recordType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDoctorNotes() { return doctorNotes; }
    public void setDoctorNotes(String doctorNotes) { this.doctorNotes = doctorNotes; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDateTime recordDate) { this.recordDate = recordDate; }
    public enum RecordType { PRESCRIPTION, LAB_REPORT, DIAGNOSIS, VACCINATION, OTHER }
}
