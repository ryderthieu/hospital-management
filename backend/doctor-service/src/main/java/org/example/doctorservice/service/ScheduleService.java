package org.example.doctorservice.service;

import org.example.doctorservice.dto.ScheduleDto;
import org.example.doctorservice.entity.Schedule;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {
    List<ScheduleDto> getAllSchedules(Integer doctorId, Schedule.Shift shift, LocalDate workDate, Integer roomId);

    ScheduleDto getScheduleById(Integer doctorId);

    ScheduleDto createSchedule(Integer doctorId, ScheduleDto scheduleDto);

    ScheduleDto updateSchedule(Integer doctorId, Integer scheduleId, ScheduleDto scheduleDto);

    void deleteSchedule(Integer doctorId, Integer scheduleId);

    List<ScheduleDto> getAllSchedulesForAdmin();

    List<ScheduleDto> getSchedulesByIds(List<Integer> scheduleIds);
}