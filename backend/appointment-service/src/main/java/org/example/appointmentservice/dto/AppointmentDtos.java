package org.example.appointmentservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.appointmentservice.entity.Appointment;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;


public class AppointmentDtos {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppointmentRequest {
        @NotNull(message = "Thời gian bắt đầu không được để trống")
        private LocalTime slotStart;

        @NotNull(message = "Thời gian kết thúc không được để trống")
        private LocalTime slotEnd;

        @NotNull(message = "Thông tin lịch khám không được để trống")
        private Integer scheduleId;

        @NotBlank(message = "Triệu chứng không được để trống")
        private String symptoms;

        @NotNull(message = "ID bác sĩ không được để trống")
        private Integer doctorId;

        @NotNull(message = "ID bệnh nhân không được để trống")
        private Integer patientId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppointmentResponse {
        private Integer appointmentId;

        private Integer doctorId;

        private ScheduleDto schedule;

        private String symptoms;

        private Integer number;

        private LocalTime SlotStart;
        private LocalTime SlotEnd;
        private Appointment.AppointmentStatus appointmentStatus;

        private Timestamp createdAt;

        private PatientDto patientInfo;

        private DoctorDto doctorInfo;

        private List<AppointmentNoteDto> appointmentNotes;

    }
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppointmentUpdateRequest {
        private Integer appointmentId;

        private Integer doctorId;

        private Integer patientId;

        private Integer scheduleId;

        private String symptoms;

        private Integer number;

        private Appointment.AppointmentStatus appointmentStatus;

        private LocalTime slotStart;

        private LocalTime slotEnd;

    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AvailableTimeSlotResponse {
        private LocalTime slotStart;
        private LocalTime slotEnd;
        private boolean isAvailable;
    }
}
