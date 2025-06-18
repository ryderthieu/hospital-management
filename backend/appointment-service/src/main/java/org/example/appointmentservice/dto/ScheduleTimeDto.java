package org.example.appointmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleTimeDto {
    private Integer scheduleId;
    private LocalTime startTime;
    private LocalTime endTime;
}