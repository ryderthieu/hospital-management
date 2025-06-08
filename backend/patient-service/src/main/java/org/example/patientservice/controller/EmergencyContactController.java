package org.example.patientservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.EmergencyContactDto;
import org.example.patientservice.service.EmergencyContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@Validated
@RequestMapping("/patients/contacts")
@RequiredArgsConstructor
public class EmergencyContactController {

    private final EmergencyContactService emergencyContactService;

    private Integer getCurrentPatientId() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return Integer.valueOf(userId);
    }

//    @PreAuthorize("hasAnyRole('PATIENT')")
    @PostMapping
    public ResponseEntity<EmergencyContactDto> createEmergencyContact(@RequestBody @Valid EmergencyContactDto emergencyContactDto) {
        return ResponseEntity.ok(emergencyContactService.createEmergencyContact(getCurrentPatientId(), emergencyContactDto));
    }

//    @PreAuthorize("hasAnyRole('PATIENT')")
    @GetMapping
    public ResponseEntity<List<EmergencyContactDto>> getAllEmergencyContacts() {
        return ResponseEntity.ok(emergencyContactService.getAllEmergencyContacts(getCurrentPatientId()));
    }

//    @PreAuthorize("hasAnyRole('PATIENT')")
    @GetMapping("/{contactId}")
    public ResponseEntity<EmergencyContactDto> getEmergencyContactById(@PathVariable Integer contactId) {
        return ResponseEntity.ok(emergencyContactService.getContactByIdAndPatientId(contactId, getCurrentPatientId()));
    }

//    @PreAuthorize("hasAnyRole('PATIENT')")
    @PutMapping("/{contactId}")
    public ResponseEntity<EmergencyContactDto> updateEmergencyContact(@PathVariable Integer contactId,
                                                                      @RequestBody @Valid EmergencyContactDto emergencyContactDto) {
        return ResponseEntity.ok(emergencyContactService.updateEmergencyContact(contactId, getCurrentPatientId(), emergencyContactDto));
    }

//    @PreAuthorize("hasAnyRole('PATIENT')")
    @DeleteMapping("/{contactId}")
    public ResponseEntity<String> deleteEmergencyContact(@PathVariable Integer contactId) {
        emergencyContactService.deleteEmergencyContact(contactId, getCurrentPatientId());
        return ResponseEntity.ok("Liên lạc được xóa thành công");
    }

    @GetMapping("/search")
    public ResponseEntity<List<EmergencyContactDto>> searchContactPhone(@RequestParam String filter) {
        return ResponseEntity.ok(emergencyContactService.searchContactPhone(filter));
    }

//    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    @GetMapping("/contacts/admin")
    public ResponseEntity<List<EmergencyContactDto>> getAllContactsForAdmin() {
        return ResponseEntity.ok(emergencyContactService.getAllContactsForAdmin());
    }
}
