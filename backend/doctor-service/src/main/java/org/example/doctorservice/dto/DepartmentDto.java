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

    private String head;

    private String createdAt;

    private List<ExaminationRoomDto> examinationRoomDtos;

    public DepartmentDto(Department department) {
        this.departmentId = department.getDepartmentId();
        this.departmentName = department.getDepartmentName();
        this.description = department.getDescription();
        this.location = department.getLocation();
        this.head = department.getHead();
        this.createdAt = department.getCreatedAt() != null ? department.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
        this.examinationRoomDtos = department.getExaminationRooms() != null
                ? department.getExaminationRooms()
                .stream()
                .map(ExaminationRoomDto::new)
                .collect(Collectors.toList())
                : null;

    }
}
