package org.example.patientservice.service;

import org.example.patientservice.entity.EmergencyContacts;
import org.example.patientservice.entity.Patients;
import org.example.patientservice.repository.EmergencyContactsRepository;
import org.example.patientservice.repository.PatientsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmergencyContactsService {

    @Autowired
    private EmergencyContactsRepository emergencyContactsRepository;

    @Autowired
    private PatientsRepository patientsRepository;

    public List<EmergencyContacts> getAllEmergencyContacts(Integer patientId) {
        return emergencyContactsRepository.findByPatientPatientId(patientId);
    }

    public Optional<EmergencyContacts> getEmergencyContactById (Integer contactId, Integer patientId)  {
        return emergencyContactsRepository.findByContactIdAndPatientPatientId(contactId, patientId);
    }

    public EmergencyContacts createEmergencyContact(Integer patientId, EmergencyContacts emergencyContact) {
        Patients patient = patientsRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));

        emergencyContact.setPatient(patient);

        return emergencyContactsRepository.save(emergencyContact);
    }


    public EmergencyContacts updateEmergencyContact(Integer patientId, Integer contactId, EmergencyContacts emergencyContacts) {
        EmergencyContacts existingContact = emergencyContactsRepository
                .findByContactIdAndPatientPatientId(contactId, patientId)
                .orElseThrow(() -> new RuntimeException("Contact not found with id " + contactId + " for patient " + patientId));

        existingContact.setContactName(emergencyContacts.getContactName());
        existingContact.setContactPhone(emergencyContacts.getContactPhone());
        existingContact.setRelationship(emergencyContacts.getRelationship());

        return emergencyContactsRepository.save(existingContact);
    }

    public void deleteEmergencyContacts (Integer patientId, Integer contactId) {
        EmergencyContacts deletedContact = emergencyContactsRepository
                .findByContactIdAndPatientPatientId(contactId, patientId)
                .orElseThrow(() -> new RuntimeException("Contact not found with id " + contactId + " for patient " + patientId));

        emergencyContactsRepository.delete(deletedContact);
    }
}
