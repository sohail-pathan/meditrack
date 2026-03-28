package com.meditrack.repository;
import com.meditrack.entity.Patient;
import com.meditrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByUser(User user);
    Optional<Patient> findByQrToken(String qrToken);
    Optional<Patient> findByHealthId(String healthId);
    @Query("SELECT p FROM Patient p WHERE p.user.name LIKE %:name%")
    List<Patient> searchByName(String name);
}
