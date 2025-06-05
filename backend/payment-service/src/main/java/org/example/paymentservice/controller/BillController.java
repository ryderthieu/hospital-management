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
    ResponseEntity<Page<BillDTOs.BillResponse>> getAllBills (@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(billService.getAllBills(page, size));
    }

    @PostMapping
    ResponseEntity<BillDTOs.BillResponse> createBill (@Valid @RequestBody BillDTOs.NewBillRequest request) {
        return ResponseEntity.status(201).body(billService.createBill(request));
    }

    @GetMapping("/{id}")
    ResponseEntity<BillDTOs.BillResponse> getBillById (@PathVariable Long id) {
        return ResponseEntity.ok(billService.getBillById(id));
    }
    @PutMapping("/{id}")
    ResponseEntity<BillDTOs.BillResponse> updateBill (@PathVariable Long id, @Valid @RequestBody BillDTOs.UpdateBillRequest request) {
        return ResponseEntity.ok(billService.updateBill(id, request));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<String> deleteBill (@PathVariable Long id) {
        billService.deleteBill(id);
        return ResponseEntity.ok("Xóa hóa đơn thành công");
    }

    @PostMapping("/{id}/details")
    ResponseEntity<List<BillDTOs.BillDetailResponse>> createBillDetails (@PathVariable Long id, @Valid @RequestBody List<BillDTOs.NewBillDetailRequest> request) {
        System.out.println("ID: " + id);
        return ResponseEntity.status(201).body(billService.createBillDetail(id, request));
    }

    @GetMapping("/{id}/details")
    ResponseEntity<List<BillDTOs.BillDetailResponse>> getBillDetails (@PathVariable Long id) {
        return ResponseEntity.ok(billService.getDetailByBill(id));
    }

    private final PharmacyServiceClient pharmacyServiceClient;

    @GetMapping("/test/{id}")
    public ResponseEntity<MedicineDTO> testPharmacyCall(@PathVariable Long id) {
        MedicineDTO medicine = pharmacyServiceClient.getMedicineById(id);
        return ResponseEntity.ok(medicine);
    }
}
