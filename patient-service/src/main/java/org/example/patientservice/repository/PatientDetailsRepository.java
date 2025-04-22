package org.example.patientservice.repository;

import org.example.patientservice.entity.PatientDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientDetailsRepository extends JpaRepository<PatientDetails, Integer> {
    List<PatientDetails> findByBloodType (String bloodType);

    List<PatientDetails> findByBloodTypeContainingIgnoreCase(String bloodType);
}
