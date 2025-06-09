package org.example.pharmacyservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.pharmacyservice.dto.PrescriptionDTOs;
import org.example.pharmacyservice.service.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pharmacy/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {
    private final PrescriptionService prescriptionService;

    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    @PostMapping
    public ResponseEntity<PrescriptionDTOs.PrescriptionResponse> createPrescription(
            @RequestBody @Valid PrescriptionDTOs.CreatePrescriptionRequest request) {
        return ResponseEntity.status(201).body(prescriptionService.createPrescription(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionDTOs.PrescriptionResponse> getPrescription(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.getPrescription(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrescriptionDTOs.PrescriptionResponse> editPrescription(
            @PathVariable Long id,
            @RequestBody @Valid PrescriptionDTOs.UpdatePrescriptionRequest request) {
        return ResponseEntity.ok(prescriptionService.updatePrescription(id, request));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.ok("Xóa thành công đơn thuốc");
    }

    @PostMapping("/detail")
    public ResponseEntity<PrescriptionDTOs.PrescriptionDetailResponse> addMedicineToPrescription(
            @RequestBody @Valid PrescriptionDTOs.AddMedicineToPrescriptionRequest request) {
        return ResponseEntity.status(201).body(prescriptionService.addMedicineToPrescription(request));
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<List<PrescriptionDTOs.PrescriptionDetailResponse>> getPrescriptionDetails(@PathVariable Long id) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionDetails(id));
    }

    @PutMapping("/detail/{id}")
    public ResponseEntity<PrescriptionDTOs.PrescriptionDetailResponse> editPrescriptionDetail(
            @PathVariable Long id,
            @RequestBody @Valid PrescriptionDTOs.UpdatePrescriptionDetailRequest request) {
        request.setDetailId(id);
        return ResponseEntity.ok(prescriptionService.updatePrescriptionDetail(request));
    }

    @DeleteMapping("/detail/{id}")
    public ResponseEntity<Void> deletePrescriptionDetail(@PathVariable Long id) {
        prescriptionService.deletePrescriptionDetail(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionDTOs.PrescriptionResponse>> getPrescriptionsByPatientId(
            @PathVariable Integer patientId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByPatientId(patientId));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<PrescriptionDTOs.PrescriptionResponse>> getPrescriptionsByAppointmentId(
            @PathVariable Long appointmentId
    ) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionByAppointmentId(appointmentId));
    }

    @GetMapping("/{prescriptionId}/pdf")
    public ResponseEntity<byte[]> getPrescriptionPdf(@PathVariable Long prescriptionId) {
        byte[] pdfBytes = prescriptionService.generatePrescriptionPdf(prescriptionId);
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=prescription_" + prescriptionId + ".pdf")
                .body(pdfBytes);
    }
}