package org.example.appointmentservice.service;

import org.example.appointmentservice.dto.ServiceOrderDto;

import java.util.List;

public interface ServiceOrderService {

    List<ServiceOrderDto> getAllOrders(Integer serviceId);

    ServiceOrderDto getOrderById(Integer serviceId, Integer orderId);

    ServiceOrderDto createOrder(Integer serviceId, ServiceOrderDto serviceOrderDto);

    ServiceOrderDto updateOrder(Integer serviceId,
                                Integer orderId,
                                ServiceOrderDto serviceOrderDto);

    void deleteOrder(Integer serviceId, Integer orderId);
    
    List<ServiceOrderDto> getOrdersByAppointmentId(Integer appointmentId);
}
