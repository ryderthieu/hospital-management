package org.example.appointmentservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.appointmentservice.entity.Services;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class ServicesDto {
    private Integer serviceId;

    @NotBlank(message = "Tên dịch vụ không được để trống")
    private String serviceName;

    @NotNull(message = "Loại dịch vụ không được để trống")
    private Services.ServiceType serviceType;

    @NotNull(message = "Giá tiền của dịch vụ không được để trống")
    private BigDecimal price;

    private String createdAt;

    public ServicesDto(Services service) {
        this.serviceId = service.getServiceId();
        this.serviceName = service.getServiceName();
        this.serviceType = service.getServiceType();
        this.price = service.getPrice();
        this.createdAt = service.getCreatedAt() != null ? service.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
    }
}
