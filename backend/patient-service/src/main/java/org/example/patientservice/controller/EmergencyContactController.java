package org.example.patientservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.EmergencyContactDto;
import org.example.patientservice.entity.EmergencyContact;
import org.example.patientservice.service.EmergencyContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient/{patientId}/contacts")
@RequiredArgsConstructor
public class EmergencyContactController {

    private final EmergencyContactService emergencyContactService;

    @PostMapping
    public ResponseEntity<EmergencyContact> createEmergencyContact(@RequestBody @Valid EmergencyContactDto emergencyContactDto) {
        return ResponseEntity.ok(emergencyContactService.createEmergencyContact(emergencyContactDto));
    }

    @GetMapping
    public ResponseEntity<List<EmergencyContact>> getAllEmergencyContacts(@PathVariable Integer patientId) {
        return ResponseEntity.ok(emergencyContactService.getAllEmergencyContacts(patientId));
    }

    @GetMapping("/{contactId}")
    public ResponseEntity<EmergencyContact> getEmergencyContactById(@PathVariable Integer patientId, @PathVariable Integer contactId) {
        return ResponseEntity.ok(emergencyContactService.getContactByIdAndPatientId(contactId, patientId));
    }

    @PutMapping("/{contactId}")
    public ResponseEntity<EmergencyContact> updateEmergencyContact(@PathVariable Integer patientId, @PathVariable Integer contactId, @RequestBody @Valid EmergencyContactDto emergencyContactDto) {
        return ResponseEntity.ok(emergencyContactService.updateEmergencyContact(contactId, patientId, emergencyContactDto));
    }

    @DeleteMapping("/{contactId}")
    public ResponseEntity<String> deleteEmergencyContact(@PathVariable Integer patientId, @PathVariable Integer contactId) {
        emergencyContactService.deleteEmergencyContact(contactId, patientId);
        return ResponseEntity.ok("Contact deleted successfully");
    }
}
