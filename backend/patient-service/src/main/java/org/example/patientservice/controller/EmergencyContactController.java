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
@RequestMapping("/patients")
@RequiredArgsConstructor
public class EmergencyContactController {

    private final EmergencyContactService emergencyContactService;

//    private Integer getCurrentPatientId() {
//        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        return Integer.valueOf(userId);
//    }

//    @PreAuthorize("hasAnyRole('PATIENT')")
    @PostMapping("/{patientId}/contacts")
    public ResponseEntity<EmergencyContactDto> createEmergencyContact(@PathVariable Integer patientId, @RequestBody @Valid EmergencyContactDto emergencyContactDto) {
        return ResponseEntity.ok(emergencyContactService.createEmergencyContact(patientId, emergencyContactDto));
    }

//    @PreAuthorize("hasAnyRole('PATIENT')")
    @GetMapping("/{patientId}/contacts")
    public ResponseEntity<List<EmergencyContactDto>> getAllEmergencyContacts(@PathVariable Integer patientId) {
        return ResponseEntity.ok(emergencyContactService.getAllEmergencyContacts(patientId));
    }

//    @PreAuthorize("hasAnyRole('PATIENT')")
    @GetMapping("/{patientId}/contacts/{contactId}")
    public ResponseEntity<EmergencyContactDto> getEmergencyContactById(@PathVariable Integer patientId, @PathVariable Integer contactId) {
        return ResponseEntity.ok(emergencyContactService.getContactByIdAndPatientId(contactId, patientId));
    }

//    @PreAuthorize("hasAnyRole('PATIENT')")
    @PutMapping("/{patientId}/contacts/{contactId}")
    public ResponseEntity<EmergencyContactDto> updateEmergencyContact(@PathVariable Integer contactId,
                                                                      @PathVariable Integer patientId,
                                                                      @RequestBody @Valid EmergencyContactDto emergencyContactDto) {
        return ResponseEntity.ok(emergencyContactService.updateEmergencyContact(contactId, patientId, emergencyContactDto));
    }

//    @PreAuthorize("hasAnyRole('PATIENT')")
    @DeleteMapping("/{patientId}/contacts/{contactId}")
    public ResponseEntity<String> deleteEmergencyContact(@PathVariable Integer contactId, @PathVariable Integer patientId) {
        emergencyContactService.deleteEmergencyContact(contactId, patientId);
        return ResponseEntity.ok("Liên lạc được xóa thành công");
    }

    @GetMapping("/contacts/search")
    public ResponseEntity<List<EmergencyContactDto>> searchContactPhone(@RequestParam String filter) {
        return ResponseEntity.ok(emergencyContactService.searchContactPhone(filter));
    }

//    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    @GetMapping("/contacts/admin")
    public ResponseEntity<List<EmergencyContactDto>> getAllContactsForAdmin() {
        return ResponseEntity.ok(emergencyContactService.getAllContactsForAdmin());
    }
}
