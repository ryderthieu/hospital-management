package org.example.doctorservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.doctorservice.entity.Doctor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateDoctorRequest {
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

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

    private String avatar;
    
    @NotNull(message = "Loại bác sĩ không được để trống")
    private Doctor.Type type;

    @NotNull(message = "ID khoa không được để trống")
    private Integer departmentId;

    private BigDecimal consultationFee;
} 