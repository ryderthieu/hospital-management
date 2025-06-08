package org.example.doctorservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.doctorservice.entity.Department;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class DepartmentDto {
    private Integer departmentId;

    @NotBlank(message = "Tên phòng không được để trống")
    private String departmentName;

    private String description;

    private String location;

    private String head_doctor_id;
    
    private String headDoctorName;

    private String headDoctorImage;

    private Integer staffCount;

    private List<String> staffImages;

    private String createdAt;
    
    private Integer foundedYear;
    
    private String phoneNumber;
    
    private String email;

    private List<ExaminationRoomDto> examinationRoomDtos;

    public DepartmentDto(Department department) {
        this.departmentId = department.getDepartmentId();
        this.departmentName = department.getDepartmentName();
        this.description = department.getDescription();
        this.location = department.getLocation();
        this.head_doctor_id = null; // Will be set in service layer
        this.staffCount = 0; // Will be set in service layer
        this.createdAt = department.getCreatedAt() != null ? department.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
        this.examinationRoomDtos = department.getExaminationRooms() != null
                ? department.getExaminationRooms()
                .stream()
                .map(ExaminationRoomDto::new)
                .collect(Collectors.toList())
                : null;

    }
}
