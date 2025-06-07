package org.example.paymentservice.service;

import lombok.RequiredArgsConstructor;
import org.example.paymentservice.entity.Bill;
import org.example.paymentservice.entity.Transaction;
import org.example.paymentservice.repository.BillRepository;
import org.example.paymentservice.repository.TransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vn.payos.PayOS;
import vn.payos.type.*;

import java.time.LocalDateTime;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class PayOSService {
    private final PayOS payOS;
    private final BillRepository billRepository;
    private final TransactionRepository transactionRepository;

    public String createPaymentLink(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));

        if (bill.getStatus() == Bill.BillStatus.PAID) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hóa đơn đã được thanh toán");
        }

        try {
            ItemData item = ItemData.builder()
                    .name("Hóa đơn #" + billId)
                    .price(bill.getAmount().intValue())
                    .quantity(1)
                    .build();

            PaymentData paymentData = PaymentData.builder()
                    .orderCode(billId)
                    .description("Thanh toán hóa đơn #" + billId)
                    .amount(bill.getAmount().intValue())
                    .cancelUrl("http://localhost:8080/api/payment/cancel")
                    .returnUrl("http://localhost:8080/api/payment/success")
                    .item(item)
                    .build();
            
            CheckoutResponseData response = payOS.createPaymentLink(paymentData);
            
            // Tạo transaction mới
            Transaction transaction = new Transaction();
            transaction.setBill(bill);
            transaction.setAmount(bill.getAmount());
            transaction.setPaymentMethod(Transaction.PaymentMethod.ONLINE_BANKING);
            transaction.setTransactionDate(LocalDateTime.now());
            transaction.setStatus(Transaction.TransactionStatus.PENDING);
            transactionRepository.save(transaction);
            
            return response.getCheckoutUrl();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi tạo link thanh toán: " + e.getMessage());
        }
    }

    public WebhookData handlePaymentCallback(Webhook webhook) {
        try {
            WebhookData data = payOS.verifyPaymentWebhookData(webhook);
            
            // Lấy thông tin từ webhook data
            Long billId = data.getOrderCode();
            Boolean isSuccess = webhook.getSuccess();
            
            Bill bill = billRepository.findById(billId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));
            
            Transaction transaction = transactionRepository.findFirstByBillOrderByCreatedAtDesc(bill)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy giao dịch"));

            if (isSuccess) {
                bill.setStatus(Bill.BillStatus.PAID);
                transaction.setStatus(Transaction.TransactionStatus.SUCCESS);
            } else {
                transaction.setStatus(Transaction.TransactionStatus.FAILED);
            }
            
            billRepository.save(bill);
            transactionRepository.save(transaction);
            
            return data;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi xử lý webhook: " + e.getMessage());
        }
    }

    public PaymentLinkData getPaymentInfo(Long orderId) {
        try {
            return payOS.getPaymentLinkInformation(orderId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lấy thông tin thanh toán: " + e.getMessage());
        }
    }

    public PaymentLinkData cancelPayment(Long orderId) {
        try {
            return payOS.cancelPaymentLink(orderId, null);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi hủy thanh toán: " + e.getMessage());
        }
    }
} 