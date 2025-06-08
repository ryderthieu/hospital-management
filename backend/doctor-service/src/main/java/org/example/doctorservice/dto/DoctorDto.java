package org.example.doctorservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.doctorservice.entity.Doctor;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class DoctorDto {
    private Integer doctorId;

    @NotNull(message = "Id của người dùng không được để trống")
    private Integer userId;

    private String doctorCode;

    @NotBlank(message = "CCCD không được để trống")
    private String identityNumber;

    @NotBlank(message = "Tên của bác sĩ không được để trống")
    private String fullName;

    @NotNull(message = "Ngày sinh không được để trống")
    private LocalDate birthday;

    @NotNull(message = "Giới tính không được để trống")
    private Doctor.Gender gender;

    private String address;

    @NotNull(message = "Học vấn không được để trống")
    private Doctor.AcademicDegree academicDegree;

    @NotBlank(message = "Chuyên môn không được để trống")
    private String specialization;

    @NotNull(message = "Loại bác sĩ không được để trống")
    private Doctor.Type type;

    private Integer departmentId;

    private String createdAt;

    public DoctorDto(Doctor doctor) {
        this.doctorId = doctor.getDoctorId();
        this.userId = doctor.getUserId();
        this.identityNumber = doctor.getIdentityNumber();
        this.fullName = doctor.getFullName();
        this.birthday = doctor.getBirthday();
        this.gender = doctor.getGender();
        this.address = doctor.getAddress();
        this.academicDegree = doctor.getAcademicDegree();
        this.specialization = doctor.getSpecialization();
        this.type = doctor.getType();
        this.departmentId = doctor.getDepartment().getDepartmentId();
        this.createdAt = doctor.getCreatedAt() != null ? doctor.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
    }
}
