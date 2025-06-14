package org.example.appointmentservice.service;

import org.example.appointmentservice.dto.ServiceOrderDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ServiceOrderService {

    List<ServiceOrderDto> getAllOrders();

    ServiceOrderDto getOrderById(Integer orderId);

    ServiceOrderDto createOrder(ServiceOrderDto serviceOrderDto);

    ServiceOrderDto updateOrder(Integer orderId, ServiceOrderDto serviceOrderDto);

    void deleteOrder(Integer orderId);
    
    List<ServiceOrderDto> getOrdersByAppointmentId(Integer appointmentId);

    List<ServiceOrderDto> getOrdersByRoomId(Integer roomId);

    ServiceOrderDto uploadTestResult(Integer orderId, MultipartFile file);
}
