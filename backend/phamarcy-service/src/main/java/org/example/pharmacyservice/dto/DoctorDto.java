package org.example.pharmacyservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDto {
    private Integer doctorId;
    private String fullName;
    private String birthday;
    private String gender;
    private String academicDegree;
    private String specialization;
    private String createdAt;
} 