package org.example.patientservice.repository;

import org.example.patientservice.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {
    Optional<Patient> findByIdentityNumber(String identityNumber);

    Optional<Patient> findByInsuranceNumber(String insuranceNumber);
}
