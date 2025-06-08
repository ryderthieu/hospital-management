package org.example.patientservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.PatientDto;
import org.example.patientservice.entity.Patient;
import org.example.patientservice.repository.PatientRepository;
import org.example.patientservice.service.PatientService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Override
    public PatientDto createPatient(PatientDto patientDto) {
        Patient patient = Patient.builder()
                .userId(patientDto.getUserId())
                .identityNumber(patientDto.getIdentityNumber())
                .insuranceNumber(patientDto.getInsuranceNumber())
                .fullName(patientDto.getFullName())
                .birthday(patientDto.getBirthday())
                .gender(patientDto.getGender())
                .address(patientDto.getAddress())
                .allergies(patientDto.getAllergies())
                .height(patientDto.getHeight())
                .weight(patientDto.getWeight())
                .bloodType(patientDto.getBloodType())
                .build();
        Patient savedPatient = patientRepository.save(patient);

        return new PatientDto(savedPatient);
    }

    @Override
    public List<PatientDto> getAllPatients() {
        return patientRepository
                .findAll()
                .stream()
                .map(PatientDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public PatientDto getPatientById(Integer patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân với ID: " + patientId));
        return new PatientDto(patient);
    }

    @Override
    public PatientDto updatePatient(Integer patientId, PatientDto patientDto) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân với ID: " + patientId));

        if (!patient.getIdentityNumber().equals(patient.getIdentityNumber())) {
            patient.setIdentityNumber(patient.getIdentityNumber());
        }

        if (!patient.getInsuranceNumber().equals(patient.getInsuranceNumber())) {
            patient.setInsuranceNumber(patient.getInsuranceNumber());
        }

        patient.setFullName(patientDto.getFullName());
        patient.setBirthday(patientDto.getBirthday());
        patient.setGender(patientDto.getGender());
        patient.setAddress(patientDto.getAddress());
        patient.setAllergies(patientDto.getAllergies());
        patient.setHeight(patientDto.getHeight());
        patient.setWeight(patientDto.getWeight());
        patient.setBloodType(patientDto.getBloodType());

        Patient updatedPatient = patientRepository.save(patient);

        return new PatientDto(updatedPatient);
    }

    @Override
    public void deletePatient(Integer patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân với ID: " + patientId));

        patientRepository.delete(patient);
    }

    @Override
    public Optional<PatientDto> searchPatient(String identityNumber, String insuranceNumber, String fullName) {
        return patientRepository.searchByIdentityNumberOrInsuranceNumberOrFullName(identityNumber, insuranceNumber, fullName)
                .map(PatientDto::new);
    }

    @Override
    public PatientDto getPatientByUserId(Integer userId) {
        return patientRepository.findByUserId(userId)
                .map(PatientDto::new)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân với ID: " + userId));
    }
}