package org.example.patientservice.service;

import org.example.patientservice.dto.EmergencyContactDto;
import org.example.patientservice.entity.EmergencyContact;

import java.util.List;

public interface EmergencyContactService {
    EmergencyContact createEmergencyContact(Integer patientId, EmergencyContactDto emergencyContactDto);

    List<EmergencyContact> getAllEmergencyContacts(Integer patientId);

    EmergencyContact getContactByIdAndPatientId(Integer contactId, Integer patientId);

    EmergencyContact updateEmergencyContact(Integer contactId, Integer patientId, EmergencyContactDto emergencyContactDto);

    void deleteEmergencyContact(Integer contactId, Integer patientId);

    List<EmergencyContact> searchContactPhone(String filter);
}
