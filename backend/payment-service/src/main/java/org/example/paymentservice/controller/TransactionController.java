package org.example.paymentservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.example.paymentservice.dto.PaymentDTOs.CreatePaymentRequest;
import org.example.paymentservice.entity.Bill;
import org.example.paymentservice.entity.Transaction;
import org.example.paymentservice.repository.BillRepository;
import org.example.paymentservice.repository.TransactionRepository;
import org.example.paymentservice.service.PayOSService;
import org.example.paymentservice.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import vn.payos.type.PaymentLinkData;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

import java.util.Date;
import java.util.HashMap;

@RestController
@RequestMapping("/payment/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final PayOSService payOSService;
    private final TransactionService transactionService;
    private final ObjectMapper objectMapper;
    private final BillRepository billRepository;
    private final TransactionRepository transactionRepository;

    @PostMapping("/create-payment/{billId}")
    public ResponseEntity<ObjectNode> createPayment(@PathVariable Long billId) {
        ObjectNode response = objectMapper.createObjectNode();
        try {
            String paymentUrl = payOSService.createPaymentLink(billId);
            
            response.put("error", 0);
            response.put("message", "success");
            response.put("data", paymentUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.putNull("data");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/cash-payment/{billId}")
    public ResponseEntity<ObjectNode> processCashPayment(@PathVariable Long billId) {
        ObjectNode response = objectMapper.createObjectNode();
        try {
            transactionService.processCashPayment(billId);
            
            response.put("error", 0);
            response.put("message", "Thanh toán tiền mặt thành công");
            response.putNull("data");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.putNull("data");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<ObjectNode> handlePaymentWebhook(@RequestBody ObjectNode webhookBody) {
        ObjectNode response = objectMapper.createObjectNode();
        try {
            // Chuyển đổi ObjectNode thành Webhook object
            Webhook webhook = objectMapper.treeToValue(webhookBody, Webhook.class);
            
            // Xử lý webhook
            WebhookData data = payOSService.handlePaymentCallback(webhook);
            
            response.put("error", 0);
            response.put("message", "Webhook delivered");
            response.putNull("data");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.putNull("data");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ObjectNode> getPaymentInfo(@PathVariable Long orderId) {
        ObjectNode response = objectMapper.createObjectNode();
        try {
            Object paymentInfo = payOSService.getPaymentInfo(orderId);
            
            response.put("error", 0);
            response.put("message", "success");
            response.set("data", objectMapper.valueToTree(paymentInfo));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.putNull("data");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<ObjectNode> cancelPayment(@PathVariable Long orderId) {
        ObjectNode response = objectMapper.createObjectNode();
        try {
            Object cancelResult = payOSService.cancelPayment(orderId);
            
            response.put("error", 0);
            response.put("message", "success");
            response.set("data", objectMapper.valueToTree(cancelResult));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.putNull("data");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{orderId}/success")
    public ResponseEntity<ObjectNode> handlePaymentSuccess(@PathVariable Long orderId) {
        ObjectNode response = objectMapper.createObjectNode();
        try {
            // Lấy billId từ orderId (orderId chính là billId trong trường hợp này)
            Long billId = orderId;
            
            // Kiểm tra trạng thái thanh toán từ PayOS
            PaymentLinkData paymentInfo = payOSService.getPaymentInfo(billId);
            
            // Cập nhật trạng thái bill và transaction
            Bill bill = billRepository.findById(billId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));
            
            Transaction transaction = transactionRepository.findFirstByBillOrderByCreatedAtDesc(bill)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy giao dịch"));

            // Chỉ cập nhật nếu transaction đang ở trạng thái PENDING
            if (transaction.getStatus() == Transaction.TransactionStatus.PENDING) {
                bill.setStatus(Bill.BillStatus.PAID);
                transaction.setStatus(Transaction.TransactionStatus.SUCCESS);
                
                billRepository.save(bill);
                transactionRepository.save(transaction);
            }
            
            response.put("error", 0);
            response.put("message", "Thanh toán thành công");
            response.put("status", "success");
            response.put("orderId", billId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.put("status", "error");
            response.put("orderId", orderId);
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{orderId}/cancel")
    public ResponseEntity<ObjectNode> handlePaymentCancel(@PathVariable Long orderId) {
        ObjectNode response = objectMapper.createObjectNode();
        try {
            // Lấy billId từ orderId
            Long billId = orderId;
            
            Bill bill = billRepository.findById(billId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));
            
            Transaction transaction = transactionRepository.findFirstByBillOrderByCreatedAtDesc(bill)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy giao dịch"));

            // Chỉ cập nhật nếu transaction đang ở trạng thái PENDING
            if (transaction.getStatus() == Transaction.TransactionStatus.PENDING) {
                transaction.setStatus(Transaction.TransactionStatus.FAILED);
                transactionRepository.save(transaction);
            }
            
            response.put("error", 0);
            response.put("message", "Đã hủy thanh toán");
            response.put("status", "cancel");
            response.put("orderId", billId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("error", -1);
            response.put("message", e.getMessage());
            response.put("status", "error");
            response.put("orderId", orderId);
            return ResponseEntity.badRequest().body(response);
        }
    }
}
