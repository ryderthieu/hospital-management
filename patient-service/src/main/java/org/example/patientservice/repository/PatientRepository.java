package org.example.patientservice.repository;

import org.example.patientservice.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    Optional<Patient> findByIdentityNumber(String identityNumber);

    Optional<Patient> findByInsuranceNumber(String insuranceNumber);
}
