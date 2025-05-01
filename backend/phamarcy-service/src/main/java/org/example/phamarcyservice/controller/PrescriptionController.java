package org.example.phamarcyservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.phamarcyservice.dto.PrescriptionDTOs;
import org.example.phamarcyservice.service.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {
    private final PrescriptionService prescriptionService;

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
}