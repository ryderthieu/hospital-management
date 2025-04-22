package org.example.patientservice.controller;

import org.example.patientservice.entity.MedicalRecords;
import org.example.patientservice.service.MedicalRecordsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients/{patientId}/records")
public class MedicalRecordsController {

    @Autowired
    private MedicalRecordsService medicalRecordsService;

    @GetMapping
    public List<MedicalRecords> getAllMedicalRecords(@PathVariable Integer patientId) {
        return medicalRecordsService.getAllMedicalRecords(patientId);
    }

    @GetMapping("/{recordId}")
    public ResponseEntity<MedicalRecords> getMedicalRecordById(@PathVariable Integer patientId, @PathVariable Integer recordId) {
        Optional<MedicalRecords> medicalRecord = medicalRecordsService.getMedicalRecordById(recordId, patientId);
        return medicalRecord.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<MedicalRecords> createMedicalRecord(@PathVariable Integer patientId, @RequestBody MedicalRecords medicalRecord) {
        MedicalRecords createdMedicalRecord = medicalRecordsService.createMedicalRecord(patientId, medicalRecord);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMedicalRecord);
    }

    @PutMapping("/{recordId}")
    public ResponseEntity<MedicalRecords> updateMedicalRecordById(@PathVariable Integer patientId, @PathVariable Integer recordId, @RequestBody MedicalRecords medicalRecord) {
        MedicalRecords updatedMedicalRecord = medicalRecordsService.updateMedicalRecord(patientId, recordId, medicalRecord);
        return ResponseEntity.ok(updatedMedicalRecord);
    }

    @DeleteMapping("/{recordId}")
    public ResponseEntity<String> deleteMedicalRecordById(@PathVariable Integer patientId, @PathVariable Integer recordId) {
        medicalRecordsService.deleteMedicalRecord(patientId, recordId);
        return ResponseEntity.ok("Medical record deleted successfully");
    }
}
