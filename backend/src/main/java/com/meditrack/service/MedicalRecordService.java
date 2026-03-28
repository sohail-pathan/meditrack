package com.meditrack.service;
import com.meditrack.dto.MedicalRecordDTO;
import com.meditrack.entity.*;
import com.meditrack.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository recordRepo;
    private final PatientRepository patientRepo;
    private final UserRepository userRepo;
    private final String uploadDir = "./uploads";

    // ✅ Constructor add kiya
    public MedicalRecordService(MedicalRecordRepository recordRepo,
                                PatientRepository patientRepo,
                                UserRepository userRepo) {
        this.recordRepo = recordRepo;
        this.patientRepo = patientRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public MedicalRecordDTO addRecord(Long patientId, MedicalRecordDTO req, MultipartFile file, String doctorEmail) throws IOException {
        Patient patient = patientRepo.findById(patientId).orElseThrow();
        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setTitle(req.getTitle());
        record.setDescription(req.getDescription());
        record.setDoctorNotes(req.getDoctorNotes());
        record.setRecordType(req.getRecordType());
        record.setRecordDate(req.getRecordDate());
        if(file != null && !file.isEmpty()){
            Files.createDirectories(Paths.get(uploadDir));
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir, filename);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            record.setFileName(file.getOriginalFilename());
            record.setFilePath(path.toString());
            record.setFileType(file.getContentType());
        }
        return MedicalRecordDTO.fromEntity(recordRepo.save(record));
    }

    public List<MedicalRecordDTO> getPatientRecords(Long patientId){
        Patient patient = patientRepo.findById(patientId).orElseThrow();
        return recordRepo.findByPatientOrderByRecordDateDesc(patient)
                .stream().map(MedicalRecordDTO::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public MedicalRecordDTO addDoctorNote(Long recordId, String notes){
        MedicalRecord record = recordRepo.findById(recordId).orElseThrow();
        record.setDoctorNotes(notes);
        return MedicalRecordDTO.fromEntity(recordRepo.save(record));
    }

    public void deleteRecord(Long recordId){ recordRepo.deleteById(recordId); }

	public UserRepository getUserRepo() {
		return userRepo;
	}
}