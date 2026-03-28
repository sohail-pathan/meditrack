package com.meditrack.service;
import com.meditrack.dto.*;
import com.meditrack.entity.*;
import com.meditrack.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {
    private final UserRepository userRepo;
    private final PatientRepository patientRepo;
    private final MedicalRecordRepository recordRepo;

    public DoctorService(UserRepository userRepo, PatientRepository patientRepo, MedicalRecordRepository recordRepo) {
        this.userRepo = userRepo;
        this.patientRepo = patientRepo;
        this.recordRepo = recordRepo;
    }

    public List<PatientProfileDTO> getAllPatients(){
        return patientRepo.findAll().stream().map(PatientProfileDTO::fromEntity).collect(Collectors.toList());
    }

    public List<PatientProfileDTO> searchPatients(String name){
        return patientRepo.searchByName(name).stream().map(PatientProfileDTO::fromEntity).collect(Collectors.toList());
    }

    public List<MedicalRecordDTO> getPatientRecords(Long patientId){
        Patient patient = patientRepo.findById(patientId).orElseThrow();
        return recordRepo.findByPatientOrderByRecordDateDesc(patient)
                .stream().map(MedicalRecordDTO::fromEntity).collect(Collectors.toList());
    }

    public MedicalRecordDTO addNotes(Long recordId, String notes, String doctorEmail){
        MedicalRecord record = recordRepo.findById(recordId).orElseThrow();
        record.setDoctorNotes(notes);
        return MedicalRecordDTO.fromEntity(recordRepo.save(record));
    }

	public UserRepository getUserRepo() {
		return userRepo;
	}
}
