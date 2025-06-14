package org.example.appointmentservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.appointmentservice.entity.ServiceOrder;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class ServiceOrderDto {
    private Integer orderId;

    @NotNull(message = "Mã lịch hẹn không được để trống")
    private Integer appointmentId;

    @NotNull(message = "Mã phòng không được để trống")
    private Integer roomId;

    @NotNull(message = "Mã dịch vụ không được để trống")
    private Integer serviceId;

    private ServiceOrder.OrderStatus orderStatus;

    private String result;

    private Integer number;

    private LocalDateTime orderTime;

    private LocalDateTime resultTime;

    private String createdAt;

    public ServiceOrderDto(ServiceOrder serviceOrder) {
        this.orderId = serviceOrder.getOrderId();
        this.appointmentId = serviceOrder.getAppointment() != null ? serviceOrder.getAppointment().getAppointmentId() : null;
        this.roomId = serviceOrder.getRoomId();
        this.serviceId = serviceOrder.getService() != null ? serviceOrder.getService().getServiceId() : null;
        this.orderStatus = serviceOrder.getOrderStatus();
        this.result = serviceOrder.getResult();
        this.number = serviceOrder.getNumber();
        this.orderTime = serviceOrder.getOrderTime();
        this.resultTime = serviceOrder.getResultTime();
        this.createdAt = serviceOrder.getCreatedAt() != null ? serviceOrder.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
    }
}
