package org.example.patientservice.repository;

import org.example.patientservice.entity.EmergencyContacts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmergencyContactsRepository extends JpaRepository<EmergencyContacts, Integer> {
    List<EmergencyContacts> findByPatientPatientId(Integer patientId);

    Optional<EmergencyContacts> findByContactIdAndPatientPatientId(Integer contactId, Integer patientId);

}
