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

    private Integer getCurrentDoctorId() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return Integer.valueOf(userId);
    }

//    @PreAuthorize("hasAnyRole('DOCTOR')")
    @GetMapping("/schedules")
    public ResponseEntity<List<ScheduleDto>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.getAllSchedules(getCurrentDoctorId()));
    }

//    @PreAuthorize("hasAnyRole('DOCTOR')")
    @GetMapping("/schedules/{scheduleId}")
    public ResponseEntity<ScheduleDto> getScheduleById(@PathVariable Integer scheduleId) {
        return ResponseEntity.ok(scheduleService.getScheduleById(scheduleId, getCurrentDoctorId()));
    }

//    @PreAuthorize("hasAnyRole('DOCTOR')")
    @PostMapping("/schedules")
    public ResponseEntity<ScheduleDto> createSchedule(@RequestBody @Valid ScheduleDto scheduleDto) {
        return ResponseEntity.ok(scheduleService.createSchedule(getCurrentDoctorId(), scheduleDto));
    }

//    @PreAuthorize("hasAnyRole('DOCTOR')")
    @PutMapping("/schedules/{scheduleId}")
    public ResponseEntity<ScheduleDto> updateSchedule(@PathVariable Integer scheduleId,
                                                      @RequestBody @Valid ScheduleDto scheduleDto) {
        return ResponseEntity.ok(scheduleService.updateSchedule(getCurrentDoctorId(), scheduleId, scheduleDto));
    }

//    @DeleteMapping("/schedules/{scheduleId}")
    public ResponseEntity<String> deleteSchedule(@PathVariable Integer scheduleId) {
        scheduleService.deleteSchedule(getCurrentDoctorId(), scheduleId);
        return ResponseEntity.ok("Lịch được xóa thành công");
    }

//    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @GetMapping("/schedules/admin")
    public ResponseEntity<List<ScheduleDto>> getAllSchedulesForAdmin() {
        return ResponseEntity.ok(scheduleService.getAllSchedulesForAdmin());
    }
}