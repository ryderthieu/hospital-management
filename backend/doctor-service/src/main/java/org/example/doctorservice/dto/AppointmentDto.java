package org.example.doctorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentDto {
    private Integer appointmentId;
    private Integer doctorId;
    private Integer patientId;
    private Integer scheduleId;
    private String symptoms;
    private Integer number;
    private String status;
}
