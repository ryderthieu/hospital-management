package org.example.appointmentservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.appointmentservice.dto.AppointmentDtos;
import org.example.appointmentservice.service.AppointmentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

//    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'PATIENT')")
    @GetMapping
    public ResponseEntity<List<AppointmentDtos.AppointmentResponse>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<AppointmentDtos.AppointmentResponse> getAppointmentById(@PathVariable Integer appointmentId) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(appointmentId));
    }

//    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'PATIENT')")
    @PostMapping
    public ResponseEntity<AppointmentDtos.AppointmentResponse> createAppointment(
            @RequestBody @Valid AppointmentDtos.AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.createAppointment(request));
    }

//    @PreAuthorize("hasAnyRole('RECEPTIONIST')")
    @PutMapping("/{appointmentId}")
    public ResponseEntity<AppointmentDtos.AppointmentResponse> updateAppointment(
            @PathVariable Integer appointmentId,
            @RequestBody @Valid AppointmentDtos.AppointmentUpdateRequest request) {
        return ResponseEntity.ok(appointmentService.updateAppointment(appointmentId, request));
    }

//    @PreAuthorize("hasAnyRole('RECEPTIONIST')")
    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<String> deleteAppointment(@PathVariable Integer appointmentId) {
        appointmentService.deleteAppointment(appointmentId);
        return ResponseEntity.ok("Cuộc hẹn đã xóa thành công");
    }

    //@PreAuthorize("hasAnyRole('RECEPTIONIST', 'DOCTOR', 'ADMIN')")
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentDtos.AppointmentResponse>> getAppointmentsByDoctorId(
            @PathVariable Integer doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorId(doctorId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentDtos.AppointmentResponse>> getAppointmentsByPatientId(@PathVariable Integer patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatientId(patientId));
    }

    @GetMapping("/schedule/{scheduleId}/available-slots")
    public ResponseEntity<List<AppointmentDtos.AvailableTimeSlotResponse>> getAvailableTimeSlots(
            @PathVariable Integer scheduleId
    ) {
        return ResponseEntity.ok(appointmentService.getAvailableTimeSlots(scheduleId));
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<List<AppointmentDtos.AppointmentResponse>> getAppointmentsByScheduleId(
            @PathVariable Integer scheduleId
    ) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByScheduleId(scheduleId));
    }
}
