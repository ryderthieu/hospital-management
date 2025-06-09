package org.example.doctorservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
// TODO: Fix AppointmentServiceClient import issue
// import org.example.doctorservice.client.AppointmentServiceClient;
import org.example.doctorservice.client.PatientServiceClient;
import org.example.doctorservice.dto.AppointmentDto;
import org.example.doctorservice.dto.DoctorDto;
import org.example.doctorservice.dto.PatientDto;
import org.example.doctorservice.entity.Department;
import org.example.doctorservice.entity.Doctor;
import org.example.doctorservice.repository.DepartmentRepository;
import org.example.doctorservice.repository.DoctorRepository;
import org.example.doctorservice.service.DoctorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    // private final AppointmentServiceClient appointmentServiceClient;
    private final PatientServiceClient patientServiceClient;

    @Override
    public List<DoctorDto> getAllDoctors() {
        log.info("Lấy danh sách tất cả bác sĩ");
        return doctorRepository
                .findAll()
                .stream()
                .map(DoctorDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public DoctorDto getDoctorById(Integer doctorId) {
        log.info("Tìm bác sĩ với ID: {}", doctorId);
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ với ID: " + doctorId));
        return new DoctorDto(doctor);
    }

    @Override
    @Transactional
    public DoctorDto createDoctor(DoctorDto doctorDto) {
        log.info("Tạo bác sĩ mới với thông tin: {}", doctorDto);
        
        // Validate required fields
        validateDoctorDto(doctorDto);

        // Validate department
        Department department = departmentRepository.findById(doctorDto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + doctorDto.getDepartmentId()));

        // Check if identity number already exists
        doctorRepository.findByIdentityNumber(doctorDto.getIdentityNumber())
                .ifPresent(d -> {
                    throw new RuntimeException("Số CMND/CCCD đã tồn tại trong hệ thống");
                });

        Doctor doctor = Doctor.builder()
                .userId(doctorDto.getUserId())
                .identityNumber(doctorDto.getIdentityNumber())
                .fullName(doctorDto.getFullName())
                .birthday(doctorDto.getBirthday())
                .gender(doctorDto.getGender())
                .address(doctorDto.getAddress())
                .academicDegree(doctorDto.getAcademicDegree())
                .specialization(doctorDto.getSpecialization())
                .type(doctorDto.getType())
                .department(department)
                .build();

        Doctor createdDoctor = doctorRepository.save(doctor);
        log.info("Đã tạo bác sĩ thành công với ID: {}", createdDoctor.getDoctorId());
        return new DoctorDto(createdDoctor);
    }

    @Override
    @Transactional
    public DoctorDto updateDoctor(Integer doctorId, DoctorDto doctorDto) {
        log.info("Cập nhật thông tin bác sĩ ID: {}", doctorId);
        
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ với ID: " + doctorId));

        // Validate required fields
        validateDoctorDto(doctorDto);

        // Check if new identity number already exists
        if (!doctor.getIdentityNumber().equals(doctorDto.getIdentityNumber())) {
            doctorRepository.findByIdentityNumber(doctorDto.getIdentityNumber())
                    .ifPresent(d -> {
                        throw new RuntimeException("Số CMND/CCCD đã tồn tại trong hệ thống");
                    });
            doctor.setIdentityNumber(doctorDto.getIdentityNumber());
        }

        // Update department if changed
        if (!doctor.getDepartment().getDepartmentId().equals(doctorDto.getDepartmentId())) {
            Department newDepartment = departmentRepository.findById(doctorDto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + doctorDto.getDepartmentId()));
            doctor.setDepartment(newDepartment);
        }

        doctor.setFullName(doctorDto.getFullName());
        doctor.setBirthday(doctorDto.getBirthday());
        doctor.setGender(doctorDto.getGender());
        doctor.setAddress(doctorDto.getAddress());
        doctor.setAcademicDegree(doctorDto.getAcademicDegree());
        doctor.setSpecialization(doctorDto.getSpecialization());
        doctor.setType(doctorDto.getType());

        Doctor updatedDoctor = doctorRepository.save(doctor);
        log.info("Đã cập nhật thông tin bác sĩ thành công");
        return new DoctorDto(updatedDoctor);
    }

    @Override
    @Transactional
    public void deleteDoctor(Integer doctorId) {
        log.info("Xóa bác sĩ với ID: {}", doctorId);
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ với ID: " + doctorId));

        // TODO: Check if doctor has any appointments before deleting

        doctorRepository.delete(doctor);
        log.info("Đã xóa bác sĩ thành công");
    }

    @Override
    public Optional<DoctorDto> findByIdentityNumber(String identityNumber) {
        log.info("Tìm bác sĩ theo số CMND/CCCD: {}", identityNumber);
        if (identityNumber != null && !identityNumber.trim().isEmpty()) {
            return doctorRepository
                    .findByIdentityNumber(identityNumber)
                    .map(DoctorDto::new);
        }
        return Optional.empty();
    }

    @Override
    public Optional<DoctorDto> filterDoctors(Doctor.Gender gender,
                                             Doctor.AcademicDegree academicDegree,
                                             String specialization,
                                             Doctor.Type type) {
        log.info("Lọc bác sĩ theo tiêu chí - Gender: {}, Degree: {}, Spec: {}, Type: {}", 
                gender, academicDegree, specialization, type);
        return doctorRepository.filterDoctors(gender, academicDegree, specialization, type)
                .map(DoctorDto::new);
    }

    @Override
    public DoctorDto getDoctorByUserId(Integer userId) {
        log.info("Tìm bác sĩ theo User ID: {}", userId);
        return doctorRepository.findByUserId(userId)
                .map(DoctorDto::new)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ với User ID: " + userId));
    }

    private void validateDoctorDto(DoctorDto doctorDto) {
        List<String> errors = new ArrayList<>();

        if (doctorDto.getFullName() == null || doctorDto.getFullName().trim().isEmpty()) {
            errors.add("Họ tên bác sĩ không được để trống");
        }

        if (doctorDto.getIdentityNumber() == null || doctorDto.getIdentityNumber().trim().isEmpty()) {
            errors.add("Số CMND/CCCD không được để trống");
        }

        if (doctorDto.getBirthday() == null) {
            errors.add("Ngày sinh không được để trống");
        }

        if (doctorDto.getGender() == null) {
            errors.add("Giới tính không được để trống");
        }

        if (doctorDto.getDepartmentId() == null) {
            errors.add("ID khoa không được để trống");
        }

        if (!errors.isEmpty()) {
            throw new RuntimeException("Lỗi validation: " + String.join(", ", errors));
        }
    }
}

