package org.example.patientservice.repository;

import org.example.patientservice.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {

    @Query("""
        SELECT p 
        FROM Patient p 
        WHERE p.identityNumber = :identityNumber 
           OR p.insuranceNumber = :insuranceNumber 
           OR p.fullName = :fullName
    """)
    Optional<Patient> searchByIdentityNumberOrInsuranceNumberOrFullName(
            String identityNumber,
            String insuranceNumber,
            String fullName
    );
}
