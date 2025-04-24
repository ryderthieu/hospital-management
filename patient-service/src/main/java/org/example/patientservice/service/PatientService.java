package org.example.patientservice.service;

import org.example.patientservice.dto.PatientDto;
import org.example.patientservice.entity.Patient;

import java.util.List;
import java.util.Optional;

public interface PatientService {
    Patient createPatient(PatientDto patientDto);

    List<Patient> getAllPatients();

    Patient getPatientById(Integer patientId);

    Patient updatePatient(Integer patientId, PatientDto patientDto);

    void deletePatient(Integer patientId);

    Optional<Patient> searchPatientByIdentityNumber(String identityNumber);

    Optional<Patient> searchPatientByInsuranceNumber(String insuranceNumber);
}
