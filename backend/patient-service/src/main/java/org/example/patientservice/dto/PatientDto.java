package org.example.patientservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.patientservice.entity.Patient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class PatientDto {
    private Long userId;

    private Integer patientId;

    @NotBlank(message = "Số CMND/CCCD không được để trống")
    private String identityNumber;

    @NotBlank(message = "Số bảo hiểm y tế không được để trống")
    private String insuranceNumber;

    @NotBlank(message = "Tên không được để trống")
    private String fullName;

    @NotNull(message = "Ngày sinh không được để trống")
    private LocalDate birthday;

    private Patient.Gender gender;

    private String address;

    private String allergies;

    private Integer height;

    private Integer weight;

    private String bloodType;

    private String createdAt;

    private List<EmergencyContactDto> emergencyContactDtos;

    public PatientDto(Patient patient) {
        this.patientId = patient.getPatientId();
        this.identityNumber = patient.getIdentityNumber();
        this.insuranceNumber = patient.getInsuranceNumber();
        this.fullName = patient.getFullName();
        this.birthday = patient.getBirthday();
        this.gender = patient.getGender();
        this.address = patient.getAddress();
        this.allergies = patient.getAllergies();
        this.height = patient.getHeight();
        this.weight = patient.getWeight();
        this.bloodType = patient.getBloodType();
        this.createdAt = patient.getCreatedAt() != null ? patient.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
        this.emergencyContactDtos = patient.getEmergencyContacts() != null
                ? patient.getEmergencyContacts()
                .stream()
                .map(EmergencyContactDto::new)
                .collect(Collectors.toList())
                : null;
    }
}
