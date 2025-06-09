package org.example.patientservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.patientservice.entity.Patient;

import java.time.LocalDate;
import java.util.List;

@Data
public class CreatePatientRequest {
    private String email;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

    @NotBlank(message = "Số CMND/CCCD không được để trống")
    private String identityNumber;

    @NotBlank(message = "Số bảo hiểm y tế không được để trống")
    private String insuranceNumber;

    @NotBlank(message = "Tên không được để trống")
    private String fullName;

    @NotNull(message = "Ngày sinh không được để trống")
    private LocalDate birthday;

    private String avatar;

    private Patient.Gender gender;

    private String address;

    private String allergies;

    private Integer height;

    private Integer weight;

    private String bloodType;

    private List<EmergencyContactDto> emergencyContactDtos;
} 