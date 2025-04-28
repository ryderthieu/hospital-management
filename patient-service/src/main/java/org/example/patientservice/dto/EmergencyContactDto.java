package org.example.patientservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.patientservice.entity.EmergencyContact;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class EmergencyContactDto {
    private Integer contactId;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String contactName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "\\d{10,20}", message = "Số điện thoại phải hợp lệ")
    private String contactPhone;

    private EmergencyContact.Relationship relationship;

    private String createdAt;

    private Integer patientId;

    public EmergencyContactDto(EmergencyContact emergencyContact) {
        this.contactId = emergencyContact.getContactId();
        this.contactName = emergencyContact.getContactName();
        this.contactPhone = emergencyContact.getContactPhone();
        this.relationship = emergencyContact.getRelationship();
        this.createdAt = emergencyContact.getCreatedAt() != null ? emergencyContact.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
        this.patientId = emergencyContact.getPatient() != null ? emergencyContact.getPatient().getPatientId() : null;
    }
}
