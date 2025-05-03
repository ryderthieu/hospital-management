package org.example.paymentservice.dto;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.paymentservice.entity.Bill;
import org.example.paymentservice.entity.BillDetail;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class BillDTOs {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NewBillRequest {
        @NotNull(message = "Mã khám bệnh không được để trống")
        private Long appointmentId;

        private BigDecimal totalCost;

        private BigDecimal insuranceDiscount;

        private BigDecimal amount;

        private Bill.BillStatus status;

        private List<BillDetail> billDetails;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateBillRequest {
        private Long appointmentId;

        private BigDecimal totalCost;

        private BigDecimal insuranceDiscount;

        private BigDecimal amount;

        private Bill.BillStatus status;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BillResponse {
        private Long billId;

        private Long appointmentId;

        private BigDecimal totalCost;

        private BigDecimal insuranceDiscount;

        private BigDecimal amount;

        private Bill.BillStatus status;

        private LocalDateTime createdAt;

        private List<BillDetail> billDetails;
    }
}
