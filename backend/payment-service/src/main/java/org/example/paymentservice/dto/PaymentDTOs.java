package org.example.paymentservice.dto;

import lombok.Data;

public class PaymentDTOs {
    
    @Data
    public static class CreatePaymentRequest {
        private String productName;
        private String description;
        private String returnUrl;
        private String cancelUrl;
        private Long price;
    }

    @Data
    public static class PaymentResponse {
        private int error;
        private String message;
        private Object data;
    }
} 