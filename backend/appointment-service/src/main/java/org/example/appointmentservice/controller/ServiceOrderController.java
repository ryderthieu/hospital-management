package org.example.appointmentservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.appointmentservice.dto.ServiceOrderDto;
import org.example.appointmentservice.service.ServiceOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/appointments/services")
@RequiredArgsConstructor
public class ServiceOrderController {

    private final ServiceOrderService serviceOrderService;

    @GetMapping("/service-orders")
    public ResponseEntity<List<ServiceOrderDto>> getAllOrders() {
        return ResponseEntity.ok(serviceOrderService.getAllOrders());
    }

    @GetMapping("/service-orders/{orderId}")
    public ResponseEntity<ServiceOrderDto> getOrderById(@PathVariable Integer orderId) {
        return ResponseEntity.ok(serviceOrderService.getOrderById(orderId));
    }

    @PostMapping("/service-orders")
    public ResponseEntity<ServiceOrderDto> createOrder(@RequestBody ServiceOrderDto serviceOrderDto) {
        return ResponseEntity.ok(serviceOrderService.createOrder(serviceOrderDto));
    }

    @PutMapping("/service-orders/{orderId}")
    public ResponseEntity<ServiceOrderDto> updateOrder(
            @PathVariable Integer orderId,
            @RequestBody ServiceOrderDto serviceOrderDto) {
        return ResponseEntity.ok(serviceOrderService.updateOrder(orderId, serviceOrderDto));
    }

    @DeleteMapping("/service-orders/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable Integer orderId) {
        serviceOrderService.deleteOrder(orderId);
        return ResponseEntity.ok("Đặt dịch vụ đã xóa thành công");
    }

    @GetMapping("/appointments/{appointmentId}/orders")
    public ResponseEntity<List<ServiceOrderDto>> getOrdersByAppointmentId(@PathVariable Integer appointmentId) {
        return ResponseEntity.ok(serviceOrderService.getOrdersByAppointmentId(appointmentId));
    }

    @GetMapping("/rooms/{roomId}/orders")
    public ResponseEntity<List<ServiceOrderDto>> getOrdersByRoomId(@PathVariable Integer roomId) {
        return ResponseEntity.ok(serviceOrderService.getOrdersByRoomId(roomId));
    }

    @PostMapping("/service-orders/{orderId}/result")
    public ResponseEntity<ServiceOrderDto> uploadTestResult(
            @PathVariable Integer orderId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(serviceOrderService.uploadTestResult(orderId, file));
    }
}
