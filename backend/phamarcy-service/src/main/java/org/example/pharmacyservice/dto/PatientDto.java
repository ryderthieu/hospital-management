package org.example.pharmacyservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDto {
    private Integer patientId;
    private String fullName;
    private String birthday;
    private String gender;
    private String phone;
    private String email;
    private String avatar;
    private String address;
    private String identityNumber;
    private String insuranceNumber;
    private String createdAt;
} 