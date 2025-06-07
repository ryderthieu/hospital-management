package org.example.paymentservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class ServiceDTO {
    private Integer serviceId;

    private String serviceName;

    private String serviceType;

    private BigDecimal price;

    private String createdAt;
}
