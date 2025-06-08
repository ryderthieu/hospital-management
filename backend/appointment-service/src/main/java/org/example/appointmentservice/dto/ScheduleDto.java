package org.example.appointmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDto {
    private Integer scheduleId;
    private Integer doctorId;
    private LocalDate workDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String shift;
    private Integer roomId;
    private String createdAt;
}
