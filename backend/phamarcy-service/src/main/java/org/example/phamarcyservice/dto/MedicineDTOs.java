package org.example.phamarcyservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class MedicineDTOs {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NewMedicineRequest {
        @NotBlank(message = "Tên thuốc không được để trống")
        private String medicineName;

        private String manufactor;

        @NotBlank(message = "Loại thuốc không được để trống")
        private String category;

        private String description;

        @NotBlank(message = "Loại thuốc không được để trống")
        private String usage;

        @NotBlank(message = "Đơn vị không được để trống")
        private String unit;

        @NotNull(message = "Bảo hiểm có tri trả không không được để trống")
        private boolean insuranceCovered;

        private String sideEffects;

        @NotNull(message = "Giá tiền không được để trống")
        @Min(value = 0, message = "Giá tiền phải lớn hơn hoặc bằng 0")
        private BigDecimal price;

        @Min(value = 0, message = "Số lượng phải lớn hơn hoặc bằng 0")
        private Long quantity;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateMedicineRequest {
        private String medicineName;

        private String manufactor;

        private String category;

        private String description;

        private String usage;

        private String unit;

        private Boolean insuranceCovered;

        private String sideEffects;

        @Min(value = 0, message = "Giá tiền phải lớn hơn hoặc bằng 0")
        private BigDecimal price;

        @Min(value = 0, message = "Số lượng phải lớn hơn hoặc bằng 0")
        private Long quantity;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MedicineResponse {
        private Long medicineId;
        private String medicineName;
        private String manufactor;
        private String category;
        private String description;
        private String usage;
        private String unit;
        private boolean insuranceCovered;
        private String sideEffects;
        private BigDecimal price;
        private Long quantity;
    }
}