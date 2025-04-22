package org.example.patientservice.controller;


import org.example.patientservice.entity.Patients;
import org.example.patientservice.service.PatientsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
public class PatientsController {

    @Autowired
    private PatientsService patientsService;

    @GetMapping
    public List<Patients> getAllPatients() {
        return patientsService.getAllPatients();
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<Patients> getPatientById(@PathVariable Integer patientId) {
        Optional<Patients> patient = patientsService.getPatientById(patientId);
        if (patient.isPresent()) {
            return ResponseEntity.ok(patient.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<Patients> createPatient(@RequestBody Patients patient) {
        Patients createdPatient = patientsService.createPatient(patient);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPatient);
    }

    @PutMapping("/{patientId}")
    public ResponseEntity<Patients> updatePatient(@PathVariable Integer patientId, @RequestBody Patients patientDetails) {
        Patients updatedPatient = patientsService.updatePatient(patientId, patientDetails);
        return ResponseEntity.ok(updatedPatient);
    }

    @DeleteMapping("/{patientId}")
    public ResponseEntity<String> deletePatient(@PathVariable Integer patientId) {
        patientsService.deletePatient(patientId);
        return ResponseEntity.ok("Patient deleted successfully");
    }

    @GetMapping("/search")
    public List<Patients> filterPatients(@RequestParam String filter) {
        return patientsService.filterPatients(filter);
    }
}
