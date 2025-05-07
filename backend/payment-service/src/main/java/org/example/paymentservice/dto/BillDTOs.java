package org.example.paymentservice.dto;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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
    public static class NewBillDetailRequest {
        @NotNull(message = "Mã hóa đơn không được để trống")
        private Long billId;

        @NotBlank(message = "Loại hóa đơn không được để trống")
        private BillDetail.ItemType itemType;

        @NotNull(message = "Số lượng không được để trống")
        private Long quantity;

        @NotNull(message = "Đơn giá không được để trống")
        private BigDecimal unitPrice;

        @NotNull(message = "Giảm giá bảo hiểm không được để trống")
        private BigDecimal insuranceDiscount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateBillRequest {
        private Long appointmentId;

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

        private List<BillDetailResponse> billDetails;

    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BillDetailResponse {
        private Long detailId;

        private Long billId;

        private BillDetail.ItemType itemType;

        private Long quantity;

        private BigDecimal unitPrice;

        private BigDecimal totalPrice;

        private BigDecimal insuranceDiscount;

        private LocalDateTime createdAt;
    }
}
