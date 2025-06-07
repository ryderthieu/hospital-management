package org.example.doctorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientDto {
    private Long patientId;
    private String firstName;
    private String lastName;
    private String identityNumber;
    private String insuranceNumber;
    private LocalDate birthday;
    private String gender;
}

