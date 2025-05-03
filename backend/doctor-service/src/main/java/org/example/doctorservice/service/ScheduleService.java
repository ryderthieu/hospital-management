package org.example.doctorservice.service;

import org.example.doctorservice.dto.ScheduleDto;

import java.util.List;

public interface ScheduleService {
    List<ScheduleDto> getAllSchedules(Integer doctorId);

    ScheduleDto getScheduleById(Integer doctorId ,Integer scheduleId);

    ScheduleDto createSchedule(Integer doctorId, ScheduleDto scheduleDto);

    ScheduleDto updateSchedule(Integer doctorId, Integer scheduleId, ScheduleDto scheduleDto);

    void deleteSchedule(Integer doctorId, Integer scheduleId);
}