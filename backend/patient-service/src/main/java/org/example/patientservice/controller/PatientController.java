package org.example.patientservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.patientservice.dto.PatientDto;
import org.example.patientservice.entity.Patient;
import org.example.patientservice.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody @Valid PatientDto patientDto) {
        return ResponseEntity.ok(patientService.createPatient(patientDto));
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Integer patientId) {
        return ResponseEntity.ok(patientService.getPatientById(patientId));
    }

    @PutMapping("/{patientId}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Integer patientId, @RequestBody @Valid PatientDto patientDto) {
        return ResponseEntity.ok(patientService.updatePatient(patientId, patientDto));
    }

    @DeleteMapping("/{patientId}")
    public ResponseEntity<String> deletePatient(@PathVariable Integer patientId) {
        patientService.deletePatient(patientId);
        return ResponseEntity.ok("Patient deleted successfully");
    }

    @GetMapping("/search/identity")
    public ResponseEntity<Optional<Patient>> searchPatientByIdentityNumber(@RequestParam String filter) {
        return ResponseEntity.ok(patientService.searchPatientByIdentityNumber(filter));
    }

    @GetMapping("/search/insurance")
    public ResponseEntity<Optional<Patient>> searchPatientByInsuranceNumber(@RequestParam String filter) {
        return ResponseEntity.ok(patientService.searchPatientByInsuranceNumber(filter));
    }
}
