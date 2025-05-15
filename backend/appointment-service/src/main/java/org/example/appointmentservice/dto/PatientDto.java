package org.example.appointmentservice.dto;

import lombok.Data;

@Data
public class PatientDto {
    private Integer patientId;
    private Integer userId;
    private String identityNumber;
    private String insuranceNumber;
    private String firstName;
    private String lastName;
    private String birthday;
    private String gender;
    private String address;
    private String allergies;
    private Integer height;
    private Integer weight;
    private String bloodType;
    private String createdAt;
}
