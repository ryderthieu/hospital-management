package org.example.patientservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.CreatePatientRequest;
import org.example.patientservice.dto.PatientDto;
import org.example.patientservice.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

//    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN', 'DOCTOR', 'PATIENT')")
//    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN', 'DOCTOR')")
    @GetMapping("/{patientId}")
    public ResponseEntity<PatientDto> getPatientById(@PathVariable Integer patientId) {
        return ResponseEntity.ok(patientService.getPatientById(patientId));
    }

//    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN', 'PATIENT')")
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
                                                              @RequestParam(required = false) String fullName,
                                                              @RequestParam(required = false) String email,
                                                              @RequestParam(required = false) String phone) {
        Optional<PatientDto> patientDto = patientService.searchPatient(identityNumber, insuranceNumber, fullName, email, phone);
        return patientDto.isPresent() ? ResponseEntity.ok(patientDto) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<PatientDto> getPatientByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(patientService.getPatientByUserId(userId));
    }

    @PostMapping("/add-patient")
    public ResponseEntity<PatientDto> registerPatient(@RequestBody @Valid CreatePatientRequest request) {
        return ResponseEntity.ok(patientService.registerPatient(request));
    }

    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN')")
    @PostMapping(value = "/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PatientDto> uploadAvatar(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(patientService.uploadAvatar(id, file));
    }

    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN')")
    @DeleteMapping("/{id}/avatar")
    public ResponseEntity<PatientDto> deleteAvatar(@PathVariable Integer id) {
        return ResponseEntity.ok(patientService.deleteAvatar(id));
    }

    @PostMapping("/batch")
    public ResponseEntity<List<PatientDto>> getPatientsByIds(@RequestBody List<Integer> patientIds) {
        return ResponseEntity.ok(patientService.getPatientsByIds(patientIds));
    }
}
