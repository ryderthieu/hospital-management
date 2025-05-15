package org.example.appointmentservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.appointmentservice.dto.ServicesDto;
import org.example.appointmentservice.service.ServicesService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments/services")
@RequiredArgsConstructor
public class ServicesController {
    private final ServicesService servicesService;

    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'PATIENT')")
    @GetMapping
    public ResponseEntity<List<ServicesDto>> getAllServices() {
        return ResponseEntity.ok(servicesService.getAllServices());
    }

    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'PATIENT')")
    @GetMapping("/{serviceId}")
    public ResponseEntity<ServicesDto> getServiceById(@PathVariable Integer serviceId) {
        return ResponseEntity.ok(servicesService.getServiceById(serviceId));
    }

    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'PATIENT')")
    @PostMapping
    public ResponseEntity<ServicesDto> createService(@RequestBody @Valid ServicesDto servicesDto) {
        return ResponseEntity.ok(servicesService.createService(servicesDto));
    }

    @PreAuthorize("hasAnyRole('RECEPTIONIST')")
    @PutMapping("/{serviceId}")
    public ResponseEntity<ServicesDto> updateService(@PathVariable Integer serviceId,
                                                     @RequestBody @Valid ServicesDto servicesDto) {
        return ResponseEntity.ok(servicesService.updateService(serviceId, servicesDto));
    }

    @PreAuthorize("hasAnyRole('RECEPTIONIST')")
    @DeleteMapping("/{serviceId}")
    public ResponseEntity<String> deleteService(@PathVariable Integer serviceId) {
        servicesService.deleteService(serviceId);
        return ResponseEntity.ok("Cuộc hẹn đã xóa thành công");
    }
}
