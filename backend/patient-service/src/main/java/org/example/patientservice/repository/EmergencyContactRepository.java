package org.example.patientservice.repository;

import org.example.patientservice.entity.EmergencyContact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Integer> {
    List<EmergencyContact> findByPatient_PatientId(Integer patientId);

    Optional<EmergencyContact> findByContactIdAndPatient_PatientId(Integer contactId, Integer patientId);
}
