package org.example.appointmentservice.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DoctorDto {
    private Integer doctorId;
    private Integer userId;
    private String identityNumber;
    private String fullName;
    private String avatar;
    private String birthday;
    private String gender;
    private String address;
    private String academicDegree;
    private String specialization;
    private String type;
    private BigDecimal consultationFee;
    private Integer departmentId;
    private String departmentName;
    private String createdAt;
}
