package org.example.pharmacyservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.pharmacyservice.dto.MedicineDTOs;
import org.example.pharmacyservice.service.MedicineService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/pharmacy/medicines")
@RequiredArgsConstructor
public class MedicineController {
    private final MedicineService medicineService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<MedicineDTOs.MedicineResponse> addNewMedicine(@RequestBody @Valid MedicineDTOs.NewMedicineRequest request) {
        return ResponseEntity.status(201).body(medicineService.addNewMedicine(request));
    }

    @GetMapping
    public ResponseEntity<List<MedicineDTOs.MedicineResponse>> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicineDTOs.MedicineResponse> getMedicineById(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<MedicineDTOs.MedicineResponse>> searchMedicine(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(medicineService.searchMedicine(name, category));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<MedicineDTOs.MedicineResponse> editMedicine(
            @PathVariable Long id,
            @RequestBody @Valid MedicineDTOs.UpdateMedicineRequest request) {
        return ResponseEntity.ok(medicineService.updateMedicine(id, request));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok("Xóa thành công");
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @PostMapping(value = "/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MedicineDTOs.MedicineResponse> uploadAvatar(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(medicineService.uploadAvatar(id, file));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @DeleteMapping("/{id}/avatar")
    public ResponseEntity<MedicineDTOs.MedicineResponse> deleteAvatar(@PathVariable Long id) {
        return ResponseEntity.ok(medicineService.deleteAvatar(id));
    }
}