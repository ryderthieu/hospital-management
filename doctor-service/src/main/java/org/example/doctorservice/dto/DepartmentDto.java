package org.example.doctorservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.doctorservice.entity.Department;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class DepartmentDto {
    private Integer departmentId;

    @NotBlank(message = "Tên phòng không được để trống")
    private String departmentName;

    private String description;

    private String createdAt;

    public DepartmentDto(Department department) {
        this.departmentId = department.getDepartmentId();
        this.departmentName = department.getDepartmentName();
        this.description = department.getDescription();
        this.createdAt = department.getCreatedAt() != null ? department.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
    }
}
