package org.example.patientservice.controller;


import org.example.patientservice.entity.EmergencyContacts;
import org.example.patientservice.service.EmergencyContactsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients/{patientId}/contacts")
public class EmergencyContactsController {

    @Autowired
    private EmergencyContactsService emergencyContactsService;

    @GetMapping
    public List<EmergencyContacts> getAllEmergencyContacts(@PathVariable Integer patientId) {
        return emergencyContactsService.getAllEmergencyContacts(patientId);
    }

    @GetMapping("/{contactId}")
    public ResponseEntity<EmergencyContacts> getEmergencyContactById(@PathVariable Integer contactId, @PathVariable Integer patientId) {
        Optional<EmergencyContacts> emergencyContact = emergencyContactsService.getEmergencyContactById(contactId, patientId);
        return emergencyContact.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<EmergencyContacts> createEmergencyContact(@PathVariable Integer patientId,@RequestBody EmergencyContacts emergencyContact) {
        EmergencyContacts createdEmergencyContact = emergencyContactsService.createEmergencyContact(patientId, emergencyContact);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEmergencyContact);
    }

    @PutMapping("/{contactId}")
    public ResponseEntity<EmergencyContacts> updateEmergencyContactById(
            @PathVariable Integer patientId,
            @PathVariable Integer contactId,
            @RequestBody EmergencyContacts emergencyContacts) {

        EmergencyContacts updatedContact = emergencyContactsService.updateEmergencyContact(patientId, contactId, emergencyContacts);
        return ResponseEntity.ok(updatedContact);
    }

    @DeleteMapping("/{contactId}")
    public ResponseEntity<String> deleteEmergencyContactById(@PathVariable Integer patientId, @PathVariable Integer contactId) {
        emergencyContactsService.deleteEmergencyContacts(patientId, contactId);
        return ResponseEntity.ok("Emergency contact deleted successfully");
    }
}
