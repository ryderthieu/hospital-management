package org.example.appointmentservice.dto;

import lombok.Data;

@Data
public class DoctorDto {
    private Integer doctorId;
    private Integer userId;
    private String identityNumber;
    private String firstName;
    private String lastName;
    private String birthday;
    private String gender;
    private String address;
    private String academicDegree;
    private String specialization;
    private String type;
    private Integer departmentId;
    private String createdAt;
}
