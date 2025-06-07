package org.example.paymentservice.service;

import lombok.RequiredArgsConstructor;
import org.example.paymentservice.entity.Bill;
import org.example.paymentservice.entity.Transaction;
import org.example.paymentservice.repository.BillRepository;
import org.example.paymentservice.repository.TransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final BillRepository billRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public void processCashPayment(Long billId) {
        // Tìm hóa đơn
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hóa đơn"));

        // Kiểm tra trạng thái hóa đơn
        if (bill.getStatus() == Bill.BillStatus.PAID) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hóa đơn đã được thanh toán");
        }

        try {
            // Tạo giao dịch mới
            Transaction transaction = new Transaction();
            transaction.setBill(bill);
            transaction.setAmount(bill.getAmount());
            transaction.setPaymentMethod(Transaction.PaymentMethod.CASH);
            transaction.setTransactionDate(LocalDateTime.now());
            transaction.setStatus(Transaction.TransactionStatus.SUCCESS);

            // Cập nhật trạng thái hóa đơn
            bill.setStatus(Bill.BillStatus.PAID);

            // Lưu thay đổi
            billRepository.save(bill);
            transactionRepository.save(transaction);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi xử lý thanh toán tiền mặt: " + e.getMessage());
        }
    }
} 