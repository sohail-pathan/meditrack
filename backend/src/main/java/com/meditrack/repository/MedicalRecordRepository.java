package com.meditrack.repository;
import com.meditrack.entity.MedicalRecord;
import com.meditrack.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatientOrderByRecordDateDesc(Patient patient);
    List<MedicalRecord> findByPatientAndRecordTypeOrderByRecordDateDesc(Patient patient, MedicalRecord.RecordType type);
    long countByPatient(Patient patient);
}
