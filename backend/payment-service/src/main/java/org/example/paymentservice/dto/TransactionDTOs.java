package org.example.paymentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.paymentservice.entity.Transaction.PaymentMethod;
import org.example.paymentservice.entity.Transaction.TransactionStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateTransactionRequest {
        @NotNull(message = "Bill ID cannot be null")
        private Long billId;

        @NotNull(message = "Amount cannot be null")
        @Positive(message = "Amount must be greater than 0")
        private BigDecimal amount;

        @NotNull(message = "Payment method cannot be null")
        private PaymentMethod paymentMethod;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionResponse {
        private Long transactionId;
        private Long billId;
        private BigDecimal amount;
        private PaymentMethod paymentMethod;
        private LocalDateTime transactionDate;
        private TransactionStatus status;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentUrlResponse {
        private String code;
        private String message;
        private String paymentUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentResultRequest {
        private String vnp_Amount;
        private String vnp_BankCode;
        private String vnp_BankTranNo;
        private String vnp_CardType;
        private String vnp_OrderInfo;
        private String vnp_PayDate;
        private String vnp_ResponseCode;
        private String vnp_TmnCode;
        private String vnp_TransactionNo;
        private String vnp_TransactionStatus;
        private String vnp_TxnRef;
        private String vnp_SecureHash;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionQueryRequest {
        @NotNull(message = "Transaction ID cannot be null")
        private Long transactionId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionRefundRequest {
        @NotNull(message = "Transaction ID cannot be null")
        private Long transactionId;

        @NotNull(message = "Amount cannot be null")
        @Positive(message = "Amount must be greater than 0")
        private BigDecimal amount;

        private String user;
    }
}