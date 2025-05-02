package org.example.patientservice.repository;

import org.example.patientservice.entity.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Integer> {
    List<EmergencyContact> findByPatient_PatientId(Integer patientId);

    Optional<EmergencyContact> findByContactIdAndPatient_PatientId(Integer contactId, Integer patientId);

    List<EmergencyContact> findByContactPhone(String contactPhone);
}
