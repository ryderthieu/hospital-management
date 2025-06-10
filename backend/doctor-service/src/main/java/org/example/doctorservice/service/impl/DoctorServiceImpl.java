package org.example.doctorservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
// TODO: Fix AppointmentServiceClient import issue
// import org.example.doctorservice.client.AppointmentServiceClient;
import org.example.doctorservice.client.PatientServiceClient;
import org.example.doctorservice.client.UserServiceClient;
import org.example.doctorservice.dto.AppointmentDto;
import org.example.doctorservice.dto.CreateDoctorRequest;
import org.example.doctorservice.dto.DoctorDto;
import org.example.doctorservice.dto.PatientDto;
import org.example.doctorservice.dto.UserDto;
import org.example.doctorservice.entity.Department;
import org.example.doctorservice.entity.Doctor;
import org.example.doctorservice.repository.DepartmentRepository;
import org.example.doctorservice.repository.DoctorRepository;
import org.example.doctorservice.service.DoctorService;
import org.example.doctorservice.service.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final UserServiceClient userServiceClient;
    // TODO: Fix AppointmentServiceClient dependency issue
    // private final AppointmentServiceClient appointmentServiceClient;
    private final PatientServiceClient patientServiceClient;
    private final FileStorageService fileStorageService;

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
    public DoctorDto createDoctor(CreateDoctorRequest request) {
        log.info("Tạo bác sĩ mới với thông tin: {}", request);
        
        // Validate required fields
        validateCreateDoctorRequest(request);

        // Create new user first
        UserDto userDto = new UserDto();
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            userDto.setEmail(request.getEmail());
        }
        userDto.setPhone(request.getPhone());
        userDto.setPassword(request.getPassword());
        userDto.setRole("DOCTOR");
        
        UserDto createdUser = userServiceClient.addUser(userDto);
        log.info("Đã tạo user mới với ID: {}", createdUser.getUserId());

        // Validate department
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + request.getDepartmentId()));

        // Check if identity number already exists
        doctorRepository.findByIdentityNumber(request.getIdentityNumber())
                .ifPresent(d -> {
                    throw new RuntimeException("Số CMND/CCCD đã tồn tại trong hệ thống");
                });

        Doctor doctor = Doctor.builder()
                .userId(createdUser.getUserId().intValue())
                .identityNumber(request.getIdentityNumber())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .birthday(request.getBirthday())
                .gender(request.getGender())
                .address(request.getAddress())
                .academicDegree(request.getAcademicDegree())
                .specialization(request.getSpecialization())
                .avatar(request.getAvatar())
                .type(request.getType())
                .department(department)
                .consultationFee(request.getConsultationFee())
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
        doctor.setAvatar(doctorDto.getAvatar());
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

    @Override
    @Transactional
    public DoctorDto uploadAvatar(Integer id, MultipartFile file) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ với id: " + id));

        // Xóa avatar cũ nếu có và không phải avatar mặc định
        if (doctor.getAvatar() != null && !doctor.getAvatar().equals("https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-1.jpg")) {
            fileStorageService.deleteFile(doctor.getAvatar());
        }

        // Lưu file mới và cập nhật đường dẫn
        String fileUrl = fileStorageService.storeFile(file);
        doctor.setAvatar(fileUrl);

        Doctor updatedDoctor = doctorRepository.save(doctor);
        return convertToDTO(updatedDoctor);
    }

    @Override
    @Transactional
    public DoctorDto deleteAvatar(Integer id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ với id: " + id));

        // Xóa avatar hiện tại nếu không phải avatar mặc định
        if (doctor.getAvatar() != null && !doctor.getAvatar().equals("https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-1.jpg")) {
            fileStorageService.deleteFile(doctor.getAvatar());
        }

        // Set về avatar mặc định
        doctor.setAvatar("https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-1.jpg");

        Doctor updatedDoctor = doctorRepository.save(doctor);
        return convertToDTO(updatedDoctor);
    }

    private DoctorDto convertToDTO(Doctor doctor) {
        return DoctorDto.builder()
                .doctorId(doctor.getDoctorId())
                .userId(doctor.getUserId())
                .identityNumber(doctor.getIdentityNumber())
                .fullName(doctor.getFullName())
                .birthday(doctor.getBirthday())
                .gender(doctor.getGender())
                .address(doctor.getAddress())
                .academicDegree(doctor.getAcademicDegree())
                .specialization(doctor.getSpecialization())
                .avatar(doctor.getAvatar())
                .type(doctor.getType())
                .departmentId(doctor.getDepartment().getDepartmentId())
                .departmentName(doctor.getDepartment().getDepartmentName())
                .consultationFee(doctor.getConsultationFee())
                .createdAt(doctor.getCreatedAt() != null ? doctor.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }

    private void validateDoctorDto(DoctorDto doctorDto) {
        List<String> errors = new ArrayList<>();

        // Bỏ validation cho email vì email có thể trống
        if (doctorDto.getPhone() == null || doctorDto.getPhone().trim().isEmpty()) {
            errors.add("Số điện thoại không được để trống");
        }

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

    private void validateCreateDoctorRequest(CreateDoctorRequest request) {
        List<String> errors = new ArrayList<>();

        if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
            errors.add("Số điện thoại không được để trống");
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            errors.add("Mật khẩu không được để trống");
        }

        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            errors.add("Họ tên bác sĩ không được để trống");
        }

        if (request.getIdentityNumber() == null || request.getIdentityNumber().trim().isEmpty()) {
            errors.add("Số CMND/CCCD không được để trống");
        }

        if (request.getBirthday() == null) {
            errors.add("Ngày sinh không được để trống");
        }

        if (request.getGender() == null) {
            errors.add("Giới tính không được để trống");
        }

        if (request.getDepartmentId() == null) {
            errors.add("ID khoa không được để trống");
        }

        if (!errors.isEmpty()) {
            throw new RuntimeException("Lỗi validation: " + String.join(", ", errors));
        }
    }
}

