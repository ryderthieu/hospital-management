package org.example.patientservice.repository;

import org.example.patientservice.entity.Patients;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientsRepository extends JpaRepository<Patients, Integer> {
    List<Patients> findByIdentityCard (String identityCard);

    List<Patients> findByInsuranceNumber (String insuranceNumber);
}
