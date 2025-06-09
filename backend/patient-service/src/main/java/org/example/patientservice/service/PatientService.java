package org.example.patientservice.service;

import org.example.patientservice.dto.CreatePatientRequest;
import org.example.patientservice.dto.PatientDto;
import org.example.patientservice.entity.Patient;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface PatientService {
    PatientDto createPatient(PatientDto patientDto);

    List<PatientDto> getAllPatients();

    PatientDto getPatientById(Integer patientId);

    PatientDto updatePatient(Integer patientId, PatientDto patientDto);

    void deletePatient(Integer patientId);

    Optional<PatientDto> searchPatient(String identityNumber, String insuranceNumber, String fullName, String email, String phone);

    PatientDto getPatientByUserId(Integer userId);

    PatientDto registerPatient(CreatePatientRequest request);

    PatientDto uploadAvatar(Integer id, MultipartFile file);

    PatientDto deleteAvatar(Integer id);
}
