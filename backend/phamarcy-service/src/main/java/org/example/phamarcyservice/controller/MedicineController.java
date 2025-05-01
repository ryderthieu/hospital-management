package org.example.phamarcyservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.phamarcyservice.dto.MedicineDTOs;
import org.example.phamarcyservice.service.MedicineService;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy/medicines")
@RequiredArgsConstructor
public class MedicineController {
    private final MedicineService medicineService;

    @PostMapping
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

    @PutMapping("/{id}")
    public ResponseEntity<MedicineDTOs.MedicineResponse> editMedicine(
            @PathVariable Long id,
            @RequestBody @Valid MedicineDTOs.UpdateMedicineRequest request) {
        return ResponseEntity.ok(medicineService.updateMedicine(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok("Xóa thành công");
    }
}