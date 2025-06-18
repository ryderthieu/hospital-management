package org.example.appointmentservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.appointmentservice.dto.*;
import org.example.appointmentservice.entity.Appointment;
import org.example.appointmentservice.service.AppointmentService;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    public ResponseEntity<PageResponse<AppointmentDtos.AppointmentResponse>> getAllAppointments(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(appointmentService.getAllAppointments(pageNo, pageSize));
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
    public ResponseEntity<PageResponse<AppointmentResponseTypes.DoctorViewResponse>> getAppointmentsByDoctorId(
            @PathVariable Integer doctorId,
            @RequestParam(required = false) String shift,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate workDate,
            @RequestParam(required = false) Appointment.AppointmentStatus appointmentStatus,
            @RequestParam(required = false) Integer roomId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorIdOptimized(doctorId, shift, workDate, appointmentStatus, roomId, pageNo, pageSize));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<PageResponse<AppointmentResponseTypes.PatientViewResponse>> getAppointmentsByPatientId(
            @PathVariable Integer patientId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatientIdOptimized(patientId, pageNo, pageSize));
    }

    @PostMapping("/schedule/{scheduleId}/available-slots")
    public ResponseEntity<List<AppointmentDtos.AvailableTimeSlotResponse>> getAvailableTimeSlots(
            @PathVariable Integer scheduleId,
            @RequestBody ScheduleTimeDto scheduleTime
    ) {
        return ResponseEntity.ok(appointmentService.getAvailableTimeSlots(scheduleId, scheduleTime));
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<List<AppointmentDtos.AppointmentResponse>> getAppointmentsByScheduleId(
            @PathVariable Integer scheduleId
    ) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByScheduleId(scheduleId));
    }

}
