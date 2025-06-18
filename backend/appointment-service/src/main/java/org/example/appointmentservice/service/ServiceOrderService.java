package org.example.appointmentservice.service;

import org.example.appointmentservice.dto.ServiceOrderDto;
import org.example.appointmentservice.entity.ServiceOrder;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ServiceOrderService {

    List<ServiceOrderDto> getAllOrders();

    ServiceOrderDto getOrderById(Integer orderId);

    ServiceOrderDto createOrder(ServiceOrderDto serviceOrderDto);

    ServiceOrderDto updateOrder(Integer orderId, ServiceOrderDto serviceOrderDto);

    void deleteOrder(Integer orderId);
    
    List<ServiceOrderDto> getOrdersByAppointmentId(Integer appointmentId);

    List<ServiceOrderDto> getOrdersByRoomId(Integer roomId, ServiceOrder.OrderStatus status, java.time.LocalDate orderDate);

    ServiceOrderDto uploadTestResult(Integer orderId, MultipartFile file);
}
