package org.example.appointmentservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.appointmentservice.entity.Appointment;
import org.example.appointmentservice.entity.AppointmentNote;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class AppointmentDto {
    private Integer appointmentId;

    private Integer doctorId;

    private Integer patientId;

    private Integer scheduleId;

    private String symptoms;

    private Integer number;

    private Appointment.AppointmentStatus appointmentStatus;

    private String createdAt;

    private List<AppointmentNoteDto> appointmentNotes;


    public AppointmentDto(Appointment appointment) {
        this.appointmentId = appointment.getAppointmentId();
        this.doctorId = appointment.getDoctorId();
        this.patientId = appointment.getPatientId();
        this.scheduleId = appointment.getScheduleId();
        this.symptoms = appointment.getSymptoms();
        this.number = appointment.getNumber();
        this.appointmentStatus = appointment.getAppointmentStatus();
        this.createdAt = appointment.getCreatedAt() != null ? appointment.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
        this.appointmentNotes = appointment.getAppointmentNotes() != null
                ? appointment.getAppointmentNotes()
                .stream()
                .map(AppointmentNoteDto::new)
                .collect(Collectors.toList())
                : null;
    }
}
