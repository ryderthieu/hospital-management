package org.example.patientservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.PatientDto;
import org.example.patientservice.entity.Patient;
import org.example.patientservice.repository.PatientRepository;
import org.example.patientservice.service.PatientService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Override
    public Patient createPatient(PatientDto patientDto) {
        Patient patient = Patient.builder()
                .identityNumber(patientDto.getIdentityNumber())
                .insuranceNumber(patientDto.getInsuranceNumber())
                .firstName(patientDto.getFirstName())
                .lastName(patientDto.getLastName())
                .birthday(patientDto.getBirthday())
                .gender(patientDto.getGender() != null ? Patient.Gender.valueOf(patientDto.getGender()) : null)
                .address(patientDto.getAddress())
                .allergies(patientDto.getAllergies())
                .height(patientDto.getHeight())
                .weight(patientDto.getWeight())
                .bloodType(patientDto.getBloodType())
                .build();
        return patientRepository.save(patient);
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Patient getPatientById(Integer patientId) {
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân với ID: " + patientId));
    }

    @Override
    public Patient updatePatient(Integer patientId, PatientDto patientDto) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân với ID: " + patientId));

        if (!patient.getIdentityNumber().equals(patient.getIdentityNumber())) {
            patient.setIdentityNumber(patient.getIdentityNumber());
        }

        if (!patient.getInsuranceNumber().equals(patient.getInsuranceNumber())) {
            patient.setInsuranceNumber(patient.getInsuranceNumber());
        }

        patient.setFirstName(patientDto.getFirstName());
        patient.setLastName(patientDto.getLastName());
        patient.setBirthday(patientDto.getBirthday());
        patient.setGender(patientDto.getGender() != null ? Patient.Gender.valueOf(patientDto.getGender()) : null);
        patient.setAddress(patientDto.getAddress());
        patient.setAllergies(patientDto.getAllergies());
        patient.setHeight(patientDto.getHeight());
        patient.setWeight(patientDto.getWeight());
        patient.setBloodType(patientDto.getBloodType());

        return patientRepository.save(patient);
    }

    @Override
    public void deletePatient(Integer patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân với ID: " + patientId));

        patientRepository.delete(patient);
    }

    @Override
    public Optional<Patient> searchPatientByIdentityNumber(String identityNumber) {
        if (identityNumber != null && !identityNumber.isEmpty()) {
            return patientRepository.findByIdentityNumber(identityNumber);
        }
        return Optional.empty();
    }

    @Override
    public Optional<Patient> searchPatientByInsuranceNumber(String insuranceNumber) {
        if (insuranceNumber != null && !insuranceNumber.isEmpty()) {
            return patientRepository.findByInsuranceNumber(insuranceNumber);
        }
        return Optional.empty();
    }
}
