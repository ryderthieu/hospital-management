package org.example.appointmentservice.dto;

import lombok.Data;
import org.example.appointmentservice.entity.Appointment;

import java.sql.Timestamp;
import java.time.LocalTime;

public class AppointmentResponseTypes {

    @Data
    public static class DoctorViewResponse {
        private Integer appointmentId;
        private Integer patientId;
        private PatientDto patientInfo;
        private String symptoms;
        private Integer number;
        private ScheduleDto schedule;
        private Appointment.AppointmentStatus appointmentStatus;
        private Timestamp createdAt;
    }

    @Data
    public static class PatientViewResponse {
        private Integer appointmentId;
        private Integer doctorId;
        private DoctorDto doctorInfo;
        private ScheduleDto schedule;
        private String symptoms;
        private Integer number;
        private LocalTime slotStart;
        private LocalTime slotEnd;
        private Appointment.AppointmentStatus appointmentStatus;
        private Timestamp createdAt;
    }
} 