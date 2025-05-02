package org.example.patientservice.service;

import org.example.patientservice.dto.EmergencyContactDto;
import org.example.patientservice.entity.EmergencyContact;

import java.util.List;

public interface EmergencyContactService {
    EmergencyContactDto createEmergencyContact(Integer patientId, EmergencyContactDto emergencyContactDto);

    List<EmergencyContactDto> getAllEmergencyContacts(Integer patientId);

    EmergencyContactDto getContactByIdAndPatientId(Integer contactId, Integer patientId);

    EmergencyContactDto updateEmergencyContact(Integer contactId, Integer patientId, EmergencyContactDto emergencyContactDto);

    void deleteEmergencyContact(Integer contactId, Integer patientId);

    List<EmergencyContactDto> searchContactPhone(String filter);
}
