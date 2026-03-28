package com.meditrack.repository;
import com.meditrack.entity.EmergencyCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EmergencyCardRepository extends JpaRepository<EmergencyCard, Long> {
    Optional<EmergencyCard> findByQrToken(String qrToken);
    Optional<EmergencyCard> findByPatientId(Long patientId);
}
