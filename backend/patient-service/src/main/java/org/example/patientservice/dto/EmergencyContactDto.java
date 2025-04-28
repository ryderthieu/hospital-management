package org.example.patientservice.dto;

import lombok.Data;
import org.example.patientservice.entity.EmergencyContact;

@Data
public class EmergencyContactDto {
    private String contactName;
    private String contactPhone;
    private EmergencyContact.Relationship relationship;
}
