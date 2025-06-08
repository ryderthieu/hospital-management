package org.example.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientDTO {
    private Integer patientId;
    private Integer userId;
    private String identityNumber;
    private String insuranceNumber;
    private String fullName;
    private LocalDate birthday;
    private String gender;
    private String address;
} 