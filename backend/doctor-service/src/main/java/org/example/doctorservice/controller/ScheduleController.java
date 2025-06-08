package org.example.doctorservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.doctorservice.dto.ScheduleDto;
import org.example.doctorservice.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

//    private Integer getCurrentDoctorId() {
//        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        return Integer.valueOf(userId);
//    }

//    @PreAuthorize("hasAnyRole('DOCTOR')")
    @GetMapping("/{doctorId}/schedules")
    public ResponseEntity<List<ScheduleDto>> getAllSchedules(@PathVariable Integer doctorId) {
        return ResponseEntity.ok(scheduleService.getAllSchedules(doctorId));
    }

//    @PreAuthorize("hasAnyRole('DOCTOR')")
    @GetMapping("/{doctorId}/schedules/{scheduleId}")
    public ResponseEntity<ScheduleDto> getScheduleById(@PathVariable Integer doctorId,@PathVariable Integer scheduleId) {
        return ResponseEntity.ok(scheduleService.getScheduleById(doctorId, scheduleId));
    }

//    @PreAuthorize("hasAnyRole('DOCTOR')")
    @PostMapping("/{doctorId}/schedules")
    public ResponseEntity<ScheduleDto> createSchedule(@PathVariable Integer doctorId, @RequestBody @Valid ScheduleDto scheduleDto) {
        return ResponseEntity.ok(scheduleService.createSchedule(doctorId, scheduleDto));
    }

//    @PreAuthorize("hasAnyRole('DOCTOR')")
    @PutMapping("/{doctorId}/schedules/{scheduleId}")
    public ResponseEntity<ScheduleDto> updateSchedule(@PathVariable Integer doctorId, @PathVariable Integer scheduleId,
                                                      @RequestBody @Valid ScheduleDto scheduleDto) {
        return ResponseEntity.ok(scheduleService.updateSchedule(doctorId, scheduleId, scheduleDto));
    }

   @DeleteMapping("/{doctorId}/schedules/{scheduleId}")
    public ResponseEntity<String> deleteSchedule(@PathVariable Integer doctorId, @PathVariable Integer scheduleId) {
        scheduleService.deleteSchedule(doctorId, scheduleId);
        return ResponseEntity.ok("Lịch được xóa thành công");
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @GetMapping("/schedules/admin")
    public ResponseEntity<List<ScheduleDto>> getAllSchedulesForAdmin() {
        return ResponseEntity.ok(scheduleService.getAllSchedulesForAdmin());
    }
}