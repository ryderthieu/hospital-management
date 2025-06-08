package org.example.patientservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.PatientDto;
import org.example.patientservice.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

//    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    @PostMapping
    public ResponseEntity<PatientDto> createPatient(@RequestBody @Valid PatientDto patientDto) {
        return ResponseEntity.ok(patientService.createPatient(patientDto));
    }

//    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN', 'DOCTOR')")
    @GetMapping
    public ResponseEntity<List<PatientDto>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

//    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN', 'DOCTOR')")
    @GetMapping("/{patientId}")
    public ResponseEntity<PatientDto> getPatientById(@PathVariable Integer patientId) {
        return ResponseEntity.ok(patientService.getPatientById(patientId));
    }

//    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    @PutMapping("/{patientId}")
    public ResponseEntity<PatientDto> updatePatient(@PathVariable Integer patientId, @RequestBody @Valid PatientDto patientDto) {
        return ResponseEntity.ok(patientService.updatePatient(patientId, patientDto));
    }

//    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    @DeleteMapping("/{patientId}")
    public ResponseEntity<String> deletePatient(@PathVariable Integer patientId) {
        patientService.deletePatient(patientId);
        return ResponseEntity.ok("Bệnh nhân được xóa thành công");
    }

//    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN', 'DOCTOR')")
    @GetMapping("/search")
    public ResponseEntity<Optional<PatientDto>> searchPatient(@RequestParam(required = false) String identityNumber,
                                                              @RequestParam(required = false) String insuranceNumber,
                                                              @RequestParam(required = false) String fullName) {
        Optional<PatientDto> patientDto = patientService.searchPatient(identityNumber, insuranceNumber, fullName);
        return patientDto.isPresent() ? ResponseEntity.ok(patientDto) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<PatientDto> getPatientByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(patientService.getPatientByUserId(userId));
    }
}
