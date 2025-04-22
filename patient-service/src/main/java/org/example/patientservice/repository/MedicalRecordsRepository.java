package org.example.patientservice.repository;

import org.example.patientservice.entity.EmergencyContacts;
import org.example.patientservice.entity.MedicalRecords;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicalRecordsRepository extends JpaRepository<MedicalRecords, Integer> {
    List<MedicalRecords> findByPatientPatientId(Integer patientId);

    Optional<MedicalRecords> findByRecordIdAndPatientPatientId(Integer recordId, Integer patientId);
}
