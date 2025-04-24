package org.example.patientservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.EmergencyContactDto;
import org.example.patientservice.entity.EmergencyContact;
import org.example.patientservice.repository.EmergencyContactRepository;
import org.example.patientservice.service.EmergencyContactService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmergencyContactImpl implements EmergencyContactService {

    private final EmergencyContactRepository emergencyContactRepository;

    @Override
    public EmergencyContact createEmergencyContact(EmergencyContactDto emergencyContactDto) {
        EmergencyContact emergencyContact = EmergencyContact.builder()
                .contactName(emergencyContactDto.getContactName())
                .contactPhone(emergencyContactDto.getContactPhone())
                .relationship(emergencyContactDto.getRelationship())
                .build();
        return emergencyContactRepository.save(emergencyContact);
    }

    @Override
    public List<EmergencyContact> getAllEmergencyContacts(Integer patientId) {
        return emergencyContactRepository.findByPatient_PatientId(patientId);
    }

    @Override
    public EmergencyContact getContactByIdAndPatientId(Integer contactId, Integer patientId) {
        return emergencyContactRepository.findByContactIdAndPatient_PatientId(contactId, patientId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    @Override
    public EmergencyContact updateEmergencyContact(Integer contactId, Integer patientId, EmergencyContactDto emergencyContactDto) {
        EmergencyContact emergencyContact = emergencyContactRepository.findByContactIdAndPatient_PatientId(contactId, patientId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        emergencyContact.setContactName(emergencyContactDto.getContactName());
        emergencyContact.setContactPhone(emergencyContactDto.getContactPhone());
        emergencyContact.setRelationship(emergencyContactDto.getRelationship());

        return emergencyContactRepository.save(emergencyContact);
    }

    @Override
    public void deleteEmergencyContact(Integer contactId, Integer patientId) {
        EmergencyContact emergencyContact = emergencyContactRepository.findByContactIdAndPatient_PatientId(contactId, patientId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        emergencyContactRepository.delete(emergencyContact);
    }
}
