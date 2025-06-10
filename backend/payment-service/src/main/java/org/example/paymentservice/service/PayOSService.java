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
        try {
            Bill bill = billRepository.findById(billId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));

            if (bill.getStatus() == Bill.BillStatus.PAID) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hóa đơn đã được thanh toán");
            }

            // Log thông tin bill
            System.out.println("Bill info - ID: " + bill.getBillId() + ", Amount: " + bill.getAmount());
            
            if (bill.getAmount() == null || bill.getAmount().intValue() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số tiền thanh toán không hợp lệ");
            }

            // Kiểm tra transaction cũ
            Transaction existingTransaction = transactionRepository.findFirstByBillOrderByCreatedAtDesc(bill)
                    .orElse(null);
            
            if (existingTransaction != null) {
                System.out.println("Existing transaction - Status: " + existingTransaction.getStatus());
            }
            
            // Nếu có transaction cũ và đang PENDING, hủy nó
            if (existingTransaction != null && existingTransaction.getStatus() == Transaction.TransactionStatus.PENDING) {
                try {
                    // Thử hủy payment link cũ
                    payOS.cancelPaymentLink(billId, null);
                } catch (Exception e) {
                    System.out.println("Error canceling old payment link: " + e.getMessage());
                }
                existingTransaction.setStatus(Transaction.TransactionStatus.FAILED);
                transactionRepository.save(existingTransaction);
            }

            ItemData item = ItemData.builder()
                    .name("Hóa đơn #" + billId)
                    .price(bill.getAmount().intValue())
                    .quantity(1)
                    .build();

            System.out.println("Created item data - Price: " + item.getPrice());

            // Tạo unique orderCode bằng cách kết hợp billId với timestamp
            Long orderCode = billId * 1000 + (System.currentTimeMillis() % 1000);
            System.out.println("Generated orderCode: " + orderCode);

            PaymentData paymentData = PaymentData.builder()
                    .orderCode(orderCode)
                    .description("Thanh toán hóa đơn #" + billId)
                    .amount(bill.getAmount().intValue())
                    .cancelUrl("http://localhost:8083/payment/transactions/" + billId + "/cancel")
                    .returnUrl("http://localhost:8083/payment/transactions/" + billId + "/success")
                    .item(item)
                    .build();
            
            System.out.println("Created payment data - Amount: " + paymentData.getAmount());
            
            try {
                CheckoutResponseData response = payOS.createPaymentLink(paymentData);
                System.out.println("PayOS response - Checkout URL: " + response.getCheckoutUrl());
                
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
                System.out.println("PayOS error: " + e.getMessage());
                e.printStackTrace();
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi từ PayOS: " + e.getMessage());
            }
        } catch (Exception e) {
            System.out.println("General error: " + e.getMessage());
            e.printStackTrace();
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