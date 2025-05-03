package org.example.paymentservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.paymentservice.dto.BillDTOs;
import org.example.paymentservice.service.BillService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/payment/bills")
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
}
