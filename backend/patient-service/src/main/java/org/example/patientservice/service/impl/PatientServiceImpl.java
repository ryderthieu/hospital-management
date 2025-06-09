package org.example.patientservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.patientservice.client.UserServiceClient;
import org.example.patientservice.dto.CreatePatientRequest;
import org.example.patientservice.dto.PatientDto;
import org.example.patientservice.dto.UserDto;
import org.example.patientservice.entity.Patient;
import org.example.patientservice.repository.PatientRepository;
import org.example.patientservice.service.PatientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final UserServiceClient userServiceClient;

    @Override
    public PatientDto createPatient(PatientDto patientDto) {
        Patient patient = Patient.builder()
                .userId(patientDto.getUserId())
                .identityNumber(patientDto.getIdentityNumber())
                .insuranceNumber(patientDto.getInsuranceNumber())
                .fullName(patientDto.getFullName())
                .phone(patientDto.getPhone())
                .email(patientDto.getEmail())
                .avatar(patientDto.getAvatar())
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
        patient.setPhone(patientDto.getPhone());
        patient.setEmail(patientDto.getEmail());
        patient.setAvatar(patientDto.getAvatar());
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
    public Optional<PatientDto> searchPatient(String identityNumber, String insuranceNumber, String fullName, String email, String phone) {
        return patientRepository.searchByIdentityNumberOrInsuranceNumberOrFullName(identityNumber, insuranceNumber, fullName, email, phone)
                .map(PatientDto::new);
    }

    @Override
    public PatientDto getPatientByUserId(Integer userId) {
        return patientRepository.findByUserId(userId)
                .map(PatientDto::new)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bệnh nhân với ID: " + userId));
    }

    @Override
    @Transactional
    public PatientDto registerPatient(CreatePatientRequest request) {
        log.info("Đăng ký bệnh nhân mới với thông tin: {}", request);
        
        // Validate required fields
        validateCreatePatientRequest(request);

        // Create new user first
        UserDto userDto = new UserDto();
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            userDto.setEmail(request.getEmail());
        }
        userDto.setPhone(request.getPhone());
        userDto.setPassword(request.getPassword());
        userDto.setRole("PATIENT");
        
        UserDto createdUser = userServiceClient.addUser(userDto);
        log.info("Đã tạo user mới với ID: {}", createdUser.getUserId());

        // Check if identity number already exists
        patientRepository.findByIdentityNumber(request.getIdentityNumber())
                .ifPresent(d -> {
                    throw new RuntimeException("Số CMND/CCCD đã tồn tại trong hệ thống");
                });

        Patient patient = Patient.builder()
                .userId(createdUser.getUserId().intValue())
                .identityNumber(request.getIdentityNumber())
                .insuranceNumber(request.getInsuranceNumber())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .avatar(request.getAvatar())
                .birthday(request.getBirthday())
                .gender(request.getGender())
                .address(request.getAddress())
                .allergies(request.getAllergies())
                .height(request.getHeight())
                .weight(request.getWeight())
                .bloodType(request.getBloodType())
                .build();

        Patient createdPatient = patientRepository.save(patient);
        log.info("Đã tạo bệnh nhân thành công với ID: {}", createdPatient.getPatientId());
        return new PatientDto(createdPatient);
    }

    private void validateCreatePatientRequest(CreatePatientRequest request) {
        List<String> errors = new ArrayList<>();

        if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
            errors.add("Số điện thoại không được để trống");
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            errors.add("Mật khẩu không được để trống");
        }

        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            errors.add("Họ tên không được để trống");
        }

        if (request.getIdentityNumber() == null || request.getIdentityNumber().trim().isEmpty()) {
            errors.add("Số CMND/CCCD không được để trống");
        }

        if (request.getInsuranceNumber() == null || request.getInsuranceNumber().trim().isEmpty()) {
            errors.add("Số bảo hiểm y tế không được để trống");
        }

        if (request.getBirthday() == null) {
            errors.add("Ngày sinh không được để trống");
        }

        if (!errors.isEmpty()) {
            throw new RuntimeException("Lỗi validation: " + String.join(", ", errors));
        }
    }
}