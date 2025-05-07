package org.example.appointmentservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.appointmentservice.dto.ServiceOrderDto;
import org.example.appointmentservice.service.ServiceOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments/services")
@RequiredArgsConstructor
public class ServiceOrderController {

    private final ServiceOrderService serviceOrderService;

    @GetMapping("/{serviceId}/service-orders")
    public ResponseEntity<List<ServiceOrderDto>> getAllOrders(@PathVariable Integer serviceId) {
        return ResponseEntity.ok(serviceOrderService.getAllOrders(serviceId));
    }

    @GetMapping("/{serviceId}/service-orders/{orderId}")
    public ResponseEntity<ServiceOrderDto> getOrderById(@PathVariable Integer serviceId,
                                                        @PathVariable Integer orderId) {
        return ResponseEntity.ok(serviceOrderService.getOrderById(serviceId, orderId));
    }

    @PostMapping("/{serviceId}/service-orders")
    public ResponseEntity<ServiceOrderDto> createOrder(@PathVariable Integer serviceId,
                                                       @RequestBody ServiceOrderDto serviceOrderDto) {
        return ResponseEntity.ok(serviceOrderService.createOrder(serviceId, serviceOrderDto));
    }

    @PutMapping("/{serviceId}/service-orders/{orderId}")
    public ResponseEntity<ServiceOrderDto> updateOrder(@PathVariable Integer serviceId,
                                                       @PathVariable Integer orderId,
                                                       @RequestBody ServiceOrderDto serviceOrderDto) {
        return ResponseEntity.ok(serviceOrderService.updateOrder(serviceId, orderId, serviceOrderDto));
    }

    @DeleteMapping("/{serviceId}/service-orders/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable Integer serviceId,
                                              @PathVariable Integer orderId) {
        serviceOrderService.deleteOrder(serviceId, orderId);
        return ResponseEntity.ok("Đặt dịch vụ đã xóa thành công");
    }
}
