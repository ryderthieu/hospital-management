package org.example.paymentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineDTO {
    private Long medicineId;
    private String medicineName;
    private String manufactor;
    private String category;
    private String description;
    private String usage;
    private String unit;
    private BigDecimal insuranceDiscountPercent;
    private BigDecimal insuranceDiscount;
    private String sideEffects;
    private BigDecimal price;
    private Long quantity;
}
