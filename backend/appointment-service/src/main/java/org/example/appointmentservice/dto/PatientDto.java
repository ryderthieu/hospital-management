package org.example.appointmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDto {
    private Integer patientId;
    private Integer userId;
    private String identityNumber;
    private String insuranceNumber;
    private String fullName;
    private String birthday;
    private String gender;
    private String address;
    private String allergies;
    private Integer height;
    private Integer weight;
    private String bloodType;
    private String createdAt;
}
