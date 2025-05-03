package org.example.doctorservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.doctorservice.dto.ScheduleDto;
import org.example.doctorservice.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping("/{doctorId}/schedules")
    public ResponseEntity<List<ScheduleDto>> getAllSchedules(@PathVariable Integer doctorId) {
        return ResponseEntity.ok(scheduleService.getAllSchedules(doctorId));
    }

    @GetMapping("/{doctorId}/schedules/{scheduleId}")
    public ResponseEntity<ScheduleDto> getScheduleById(@PathVariable Integer scheduleId, @PathVariable Integer doctorId) {
        return ResponseEntity.ok(scheduleService.getScheduleById(scheduleId, doctorId));
    }

    @PostMapping("/{doctorId}/schedules")
    public ResponseEntity<ScheduleDto> createSchedule(@PathVariable Integer doctorId, @RequestBody @Valid ScheduleDto scheduleDto) {
        return ResponseEntity.ok(scheduleService.createSchedule(doctorId, scheduleDto));
    }

    @PutMapping("/{doctorId}/schedules/{scheduleId}")
    public ResponseEntity<ScheduleDto> updateSchedule(@PathVariable Integer doctorId,
                                                      @PathVariable Integer scheduleId,
                                                      @RequestBody @Valid ScheduleDto scheduleDto) {
        return ResponseEntity.ok(scheduleService.updateSchedule(doctorId, scheduleId, scheduleDto));
    }

    @DeleteMapping("/{doctorId}/schedules/{scheduleId}")
    public ResponseEntity<String> deleteSchedule(@PathVariable Integer doctorId,
                                                 @PathVariable Integer scheduleId) {
        scheduleService.deleteSchedule(doctorId, scheduleId);
        return ResponseEntity.ok("Lịch được xóa thành công");
    }
}