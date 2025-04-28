package org.example.patientservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.EmergencyContactDto;
import org.example.patientservice.dto.PatientRoomDto;
import org.example.patientservice.entity.EmergencyContact;
import org.example.patientservice.entity.Patient;
import org.example.patientservice.repository.EmergencyContactRepository;
import org.example.patientservice.service.EmergencyContactService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyContactServiceImpl implements EmergencyContactService {

    private final EmergencyContactRepository emergencyContactRepository;

    @Override
    public EmergencyContactDto createEmergencyContact(Integer patientId, EmergencyContactDto emergencyContactDto) {
        Patient patient = new Patient();
        patient.setPatientId(patientId);

        EmergencyContact emergencyContact = EmergencyContact.builder()
                .contactName(emergencyContactDto.getContactName())
                .contactPhone(emergencyContactDto.getContactPhone())
                .relationship(emergencyContactDto.getRelationship())
                .patient(patient)
                .build();

        EmergencyContact savedEmergencyContact = emergencyContactRepository.save(emergencyContact);
        return new EmergencyContactDto(savedEmergencyContact);
    }

    @Override
    public List<EmergencyContactDto> getAllEmergencyContacts(Integer patientId) {
        return emergencyContactRepository
                .findByPatient_PatientId(patientId)
                .stream()
                .map(EmergencyContactDto::new)
                .collect(Collectors.toList());

    }

    @Override
    public EmergencyContactDto getContactByIdAndPatientId(Integer contactId, Integer patientId) {
        EmergencyContact emergencyContact = emergencyContactRepository.findByContactIdAndPatient_PatientId(contactId, patientId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy liên lạc"));
        return new EmergencyContactDto(emergencyContact);
    }

    @Override
    public EmergencyContactDto updateEmergencyContact(Integer contactId, Integer patientId, EmergencyContactDto emergencyContactDto) {
        EmergencyContact emergencyContact = emergencyContactRepository.findByContactIdAndPatient_PatientId(contactId, patientId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy liên lạc"));

        emergencyContact.setContactName(emergencyContactDto.getContactName());
        emergencyContact.setContactPhone(emergencyContactDto.getContactPhone());
        emergencyContact.setRelationship(emergencyContactDto.getRelationship());

        EmergencyContact updatedEmergencyContact = emergencyContactRepository.save(emergencyContact);
        return new EmergencyContactDto(updatedEmergencyContact);
    }

    @Override
    public void deleteEmergencyContact(Integer contactId, Integer patientId) {
        EmergencyContact emergencyContact = emergencyContactRepository.findByContactIdAndPatient_PatientId(contactId, patientId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy liên lạc"));

        emergencyContactRepository.delete(emergencyContact);
    }

    @Override
    public List<EmergencyContactDto> searchContactPhone(String filter) {
        if (filter != null && !filter.isEmpty()) {
            return emergencyContactRepository
                    .findByContactPhone(filter)
                    .stream()
                    .map(EmergencyContactDto::new)
                    .collect(Collectors.toList());
        }
        return new ArrayList<>();
    }
}
