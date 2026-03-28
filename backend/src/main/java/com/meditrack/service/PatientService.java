package com.meditrack.service;
import com.meditrack.dto.*;
import com.meditrack.entity.*;
import com.meditrack.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PatientService {
    private final PatientRepository patientRepo;
    private final MedicalRecordRepository recordRepo;
    private final UserRepository userRepo;

    public PatientService(PatientRepository patientRepo, MedicalRecordRepository recordRepo, UserRepository userRepo) {
        this.patientRepo = patientRepo;
        this.recordRepo = recordRepo;
        this.userRepo = userRepo;
    }

    public PatientProfileDTO getProfile(String email){
        User user = userRepo.findByEmail(email).orElseThrow();
        Patient patient = patientRepo.findByUser(user).orElseThrow();
        PatientProfileDTO dto = PatientProfileDTO.fromEntity(patient);
        dto.setTotalRecords(recordRepo.countByPatient(patient));
        return dto;
    }

    public PatientProfileDTO updateProfile(String email, PatientProfileDTO req){
        User user = userRepo.findByEmail(email).orElseThrow();
        Patient patient = patientRepo.findByUser(user).orElseThrow();
        if(req.getBloodGroup()!=null) patient.setBloodGroup(req.getBloodGroup());
        if(req.getAllergies()!=null) patient.setAllergies(req.getAllergies());
        if(req.getChronicConditions()!=null) patient.setChronicConditions(req.getChronicConditions());
        if(req.getEmergencyContactName()!=null) patient.setEmergencyContactName(req.getEmergencyContactName());
        if(req.getEmergencyContactPhone()!=null) patient.setEmergencyContactPhone(req.getEmergencyContactPhone());
        if(req.getDateOfBirth()!=null) patient.setDateOfBirth(req.getDateOfBirth());
        if(req.getAddress()!=null) patient.setAddress(req.getAddress());
        if(req.getGender()!=null) patient.setGender(req.getGender());
        patientRepo.save(patient);
        return PatientProfileDTO.fromEntity(patient);
    }

    public List<MedicalRecordDTO> getRecords(String email){
        User user = userRepo.findByEmail(email).orElseThrow();
        Patient patient = patientRepo.findByUser(user).orElseThrow();
        return recordRepo.findByPatientOrderByRecordDateDesc(patient)
                .stream().map(MedicalRecordDTO::fromEntity).collect(Collectors.toList());
    }

    public MedicalRecordDTO uploadRecord(String email, String title, String recordType, String description, MultipartFile file){
        User user = userRepo.findByEmail(email).orElseThrow();
        Patient patient = patientRepo.findByUser(user).orElseThrow();
        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setTitle(title);
        record.setDescription(description);
        record.setRecordType(MedicalRecord.RecordType.valueOf(recordType));
        if(file != null && !file.isEmpty()){
            try {
                String uploadDir = "./uploads";
                Files.createDirectories(Paths.get(uploadDir));
                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path path = Paths.get(uploadDir, filename);
                Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
                record.setFileName(file.getOriginalFilename());
                record.setFilePath(path.toString());
                record.setFileType(file.getContentType());
            } catch(IOException e){ throw new RuntimeException("File upload failed", e); }
        }
        return MedicalRecordDTO.fromEntity(recordRepo.save(record));
    }
}
