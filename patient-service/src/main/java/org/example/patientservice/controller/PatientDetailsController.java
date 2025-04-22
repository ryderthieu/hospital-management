package org.example.patientservice.controller;

import org.example.patientservice.entity.PatientDetails;
import org.example.patientservice.service.PatientDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
public class PatientDetailsController {

    @Autowired
    private PatientDetailsService patientDetailsService;

    @GetMapping("/{patientId}/details")
    public ResponseEntity<PatientDetails> getPatientDetails(@PathVariable Integer patientId) {
        Optional<PatientDetails> patientDetails = patientDetailsService.getPatientDetails(patientId);

        return patientDetails.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @PutMapping("/{patientId}/details")
    public ResponseEntity<PatientDetails> updatePatientDetails(@PathVariable Integer patientId, @RequestBody PatientDetails patientDetails) {
        try {
            PatientDetails updatedPatientDetails = patientDetailsService.updatePatientDetails(patientId, patientDetails);
            return ResponseEntity.ok(updatedPatientDetails);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{patientId}/details")
    public ResponseEntity<String> deletePatientDetails(@PathVariable Integer patientId){
        patientDetailsService.deletePatientDetails(patientId);
        return ResponseEntity.ok("Patient details deleted successfully");
    }

    @GetMapping("/details/search")
    public ResponseEntity<List<PatientDetails>> searchByBloodType(@RequestParam String filter) {
        List<PatientDetails> result = patientDetailsService.filterPatientDetails(filter);
        return ResponseEntity.ok(result);
    }
}
