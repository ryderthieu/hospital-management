package org.example.patientservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.EmergencyContactDto;
import org.example.patientservice.entity.EmergencyContact;
import org.example.patientservice.service.EmergencyContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class EmergencyContactController {

    private final EmergencyContactService emergencyContactService;

    @PostMapping("/{patientId}/contacts")
    public ResponseEntity<EmergencyContactDto> createEmergencyContact(@PathVariable Integer patientId,@RequestBody @Valid EmergencyContactDto emergencyContactDto) {
        return ResponseEntity.ok(emergencyContactService.createEmergencyContact(patientId, emergencyContactDto));
    }

    @GetMapping("/{patientId}/contacts")
    public ResponseEntity<List<EmergencyContactDto>> getAllEmergencyContacts(@PathVariable Integer patientId) {
        return ResponseEntity.ok(emergencyContactService.getAllEmergencyContacts(patientId));
    }

    @GetMapping("/{patientId}/contacts/{contactId}")
    public ResponseEntity<EmergencyContactDto> getEmergencyContactById(@PathVariable Integer patientId, @PathVariable Integer contactId) {
        return ResponseEntity.ok(emergencyContactService.getContactByIdAndPatientId(contactId, patientId));
    }

    @PutMapping("/{patientId}/contacts/{contactId}")
    public ResponseEntity<EmergencyContactDto> updateEmergencyContact(@PathVariable Integer patientId, @PathVariable Integer contactId, @RequestBody @Valid EmergencyContactDto emergencyContactDto) {
        return ResponseEntity.ok(emergencyContactService.updateEmergencyContact(contactId, patientId, emergencyContactDto));
    }

    @DeleteMapping("/{patientId}/contacts/{contactId}")
    public ResponseEntity<String> deleteEmergencyContact(@PathVariable Integer patientId, @PathVariable Integer contactId) {
        emergencyContactService.deleteEmergencyContact(contactId, patientId);
        return ResponseEntity.ok("Liên lạc được xóa thành công");
    }

    @GetMapping("/contacts/search")
    public ResponseEntity<List<EmergencyContactDto>> searchContactPhone(@RequestParam String filter) {
        return ResponseEntity.ok(emergencyContactService.searchContactPhone(filter));
    }
}
