package org.example.doctorservice.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.doctorservice.dto.DepartmentDto;
import org.springframework.stereotype.Service;
import org.example.doctorservice.entity.Department;
import org.example.doctorservice.entity.Doctor;
import org.example.doctorservice.repository.DepartmentRepository;
import org.example.doctorservice.service.DepartmentService;
import org.example.doctorservice.dto.DoctorDto;
import org.example.doctorservice.repository.DoctorRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    @Override
    public DepartmentDto getDepartmentById(Integer departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + departmentId));
        
        return populateDepartmentDto(department);
    }

    @Override
    public List<DepartmentDto> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream()
                .map(this::populateDepartmentDto)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        Department department = new Department();
        department.setDepartmentName(departmentDto.getDepartmentName());
        department.setDescription(departmentDto.getDescription());
        Department savedDepartment = departmentRepository.save(department);
        return new DepartmentDto(savedDepartment);
    }

    @Override
    public DepartmentDto updateDepartment(Integer departmentId,
                                          DepartmentDto departmentDto) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + departmentId));

        department.setDepartmentName(departmentDto.getDepartmentName());
        department.setDescription(departmentDto.getDescription());

        Department updatedDepartment = departmentRepository.save(department);
        return new DepartmentDto(updatedDepartment);
    }

    @Override
    public void deleteDepartment(Integer departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + departmentId));

        departmentRepository.delete(department);
    }

    @Override
    public List<DoctorDto> getDoctorsByDepartmentId(Integer departmentId) {
        departmentRepository.findById(departmentId)
             .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa với ID: " + departmentId));

        return doctorRepository.findByDepartment_DepartmentId(departmentId)
                .stream()
                .map(DoctorDto::new)
                .collect(Collectors.toList());
    }

    // Helper method to format academic degrees
    private String formatAcademicDegree(Doctor.AcademicDegree degree) {
        if (degree == null) {
            return "BS.";
        }
        
        switch (degree) {
            case BS:
                return "BS.";
            case BS_CKI:
                return "BS.CKI";
            case BS_CKII:
                return "BS.CKII";
            case THS_BS:
                return "ThS.BS.";
            case TS_BS:
                return "TS.BS.";
            case PGS_TS_BS:
                return "PGS.TS.BS.";
            case GS_TS_BS:
                return "GS.TS.BS.";
            default:
                return degree.getValue() + ".";
        }
    }

    // Helper method to populate complete department data
    private DepartmentDto populateDepartmentDto(Department department) {
        DepartmentDto dto = new DepartmentDto(department);
        
        // Set default values for contact info if not available
        if (dto.getFoundedYear() == null) {
            dto.setFoundedYear(2020);
        }
//        if (dto.getPhoneNumber() == null || dto.getPhoneNumber().isEmpty()) {
//            dto.setPhoneNumber(generateDepartmentPhone(department.getDepartmentId()));
//        }
//        if (dto.getEmail() == null || dto.getEmail().isEmpty()) {
//            dto.setEmail(generateDepartmentEmail(department.getDepartmentName()));
//        }
        
        // Populate staff count
        int staffCount = doctorRepository.countByDepartment_DepartmentId(department.getDepartmentId());
        dto.setStaffCount(staffCount);
        
        // Populate head doctor information
//        if (department.getHeadDoctorId() != null) {
//            doctorRepository.findById(department.getHeadDoctorId())
//                .ifPresent(headDoctor -> {
//                    String formattedName = formatAcademicDegree(headDoctor.getAcademicDegree()) + " " + headDoctor.getFullName();
//                    dto.setHeadDoctorName(formattedName);
//                    dto.setHeadDoctorImage(headDoctor.getProfileImage());
//                });
//        }
//
//        // Populate staff images (limit to 4)
//        List<String> staffImages = doctorRepository.findByDepartment_DepartmentId(department.getDepartmentId())
//                .stream()
//                .filter(doctor -> doctor.getProfileImage() != null && !doctor.getProfileImage().isEmpty())
//                .limit(4)
//                .map(doctor -> doctor.getProfileImage())
//                .collect(Collectors.toList());
//        dto.setStaffImages(staffImages);
        
        return dto;
    }
    
    // Helper method to generate department phone number
    private String generateDepartmentPhone(Integer departmentId) {
        return "028-3822-" + String.format("%04d", departmentId);
    }
    
    // Helper method to generate department email
    private String generateDepartmentEmail(String departmentName) {
        String emailPrefix;
        switch (departmentName.toLowerCase()) {
            case "khoa tim mạch":
                emailPrefix = "timmach";
                break;
            case "khoa thần kinh":
                emailPrefix = "thankinh";
                break;
            case "khoa nhi":
                emailPrefix = "nhi";
                break;
            case "khoa phụ sản":
                emailPrefix = "phusan";
                break;
            case "khoa chấn thương chỉnh hình":
                emailPrefix = "chanthuong";
                break;
            case "khoa da liễu":
                emailPrefix = "dalieu";
                break;
            case "khoa mắt":
                emailPrefix = "mat";
                break;
            case "khoa tai mũi họng":
                emailPrefix = "taimuihong";
                break;
            case "khoa ung bướu":
                emailPrefix = "ungbuou";
                break;
            case "khoa hô hấp":
                emailPrefix = "hohap";
                break;
            case "khoa tiêu hóa":
                emailPrefix = "tieuhoa";
                break;
            case "khoa thận - tiết niệu":
                emailPrefix = "than";
                break;
            case "khoa nội tiết":
                emailPrefix = "noitiet";
                break;
            case "khoa tâm thần":
                emailPrefix = "tamthan";
                break;
            case "khoa hồi sức cấp cứu":
                emailPrefix = "capcu";
                break;
            case "khoa gây mê hồi sức":
                emailPrefix = "gaymehoisu";
                break;
            case "khoa xét nghiệm":
                emailPrefix = "xetnghiem";
                break;
            case "khoa chẩn đoán hình ảnh":
                emailPrefix = "chandoan";
                break;
            case "khoa dược":
                emailPrefix = "duoc";
                break;
            default:
                emailPrefix = "general";
                break;
        }
        return emailPrefix + "@wecare.com";
    }
}

