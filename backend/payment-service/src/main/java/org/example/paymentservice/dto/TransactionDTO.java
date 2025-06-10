package org.example.paymentservice.dto;

import lombok.Data;
import org.example.paymentservice.entity.Transaction;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionDTO {
    private Long transactionId;
    private Long billId;
    private BigDecimal amount;
    private String paymentMethod;
    private LocalDateTime transactionDate;
    private String status;
    private LocalDateTime createdAt;

    public static TransactionDTO fromEntity(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setTransactionId(transaction.getTransactionId());
        dto.setBillId(transaction.getBill().getBillId());
        dto.setAmount(transaction.getAmount());
        dto.setPaymentMethod(transaction.getPaymentMethod().name());
        dto.setTransactionDate(transaction.getTransactionDate());
        dto.setStatus(transaction.getStatus().name());
        dto.setCreatedAt(transaction.getCreatedAt());
        return dto;
    }
} 