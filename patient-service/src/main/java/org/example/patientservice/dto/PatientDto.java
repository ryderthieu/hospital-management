package org.example.patientservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.patientservice.entity.Patient;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class PatientDto {
    private Integer patientId;

    @NotBlank(message = "Số CMND/CCCD không được để trống")
    private String identityNumber;

    @NotBlank(message = "Số bảo hiểm y tế không được để trống")
    private String insuranceNumber;

    @NotBlank(message = "Họ không được để trống")
    private String firstName;

    @NotBlank(message = "Tên không được để trống")
    private String lastName;

    @NotNull(message = "Ngày sinh không được để trống")
    private LocalDate birthday;

    private String gender;

    private String address;

    private String allergies;

    private Integer height;

    private Integer weight;

    private String bloodType;

    private String createdAt;

    public PatientDto(Patient patient) {
        this.patientId = patient.getPatientId();
        this.identityNumber = patient.getIdentityNumber();
        this.insuranceNumber = patient.getInsuranceNumber();
        this.firstName = patient.getFirstName();
        this.lastName = patient.getLastName();
        this.birthday = patient.getBirthday();
        this.gender = patient.getGender() != null ? patient.getGender().name() : null;
        this.address = patient.getAddress();
        this.allergies = patient.getAllergies();
        this.height = patient.getHeight();
        this.weight = patient.getWeight();
        this.bloodType = patient.getBloodType();
        this.createdAt = patient.getCreatedAt() != null ? patient.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
    }
}
