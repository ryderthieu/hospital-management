package org.example.paymentservice.controller;

import jakarta.validation.Valid;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.example.paymentservice.client.PharmacyServiceClient;
import org.example.paymentservice.dto.BillDTOs;
import org.example.paymentservice.dto.MedicineDTO;
import org.example.paymentservice.service.BillService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/payment/bills")
@RequiredArgsConstructor
public class BillController {
    private final BillService billService;

    @GetMapping
    ResponseEntity<Page<BillDTOs.BillResponse>> getAllBills (@PathVariable int page, @PathVariable int size) {
        return ResponseEntity.ok(billService.getAllBills(page, size));
    }

    @PostMapping
    ResponseEntity<BillDTOs.BillResponse> createBill (@Valid @RequestBody BillDTOs.NewBillRequest request) {
        return ResponseEntity.status(201).body(billService.createBill(request));
    }

    private final PharmacyServiceClient pharmacyServiceClient;

    @GetMapping("/test/{id}")
    public ResponseEntity<MedicineDTO> testPharmacyCall(@PathVariable Long id) {
        MedicineDTO medicine = pharmacyServiceClient.getMedicineById(id);
        return ResponseEntity.ok(medicine);
    }
}
