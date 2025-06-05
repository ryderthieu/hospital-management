package org.example.appointmentservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.appointmentservice.entity.AppointmentNote;

import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class AppointmentNoteDto {
    private Integer noteId;

    private Integer appointmentId;

    private AppointmentNote.NoteType noteType;

    @NotBlank(message = "Chú thích không được để trống")
    private String noteText;

    private String createdAt;

    public AppointmentNoteDto(AppointmentNote appointmentNote) {
        this.noteId = appointmentNote.getNoteId();
        this.appointmentId = appointmentNote.getAppointment() != null ? appointmentNote.getAppointment().getAppointmentId() : null;
        this.noteType = appointmentNote.getNoteType();
        this.noteText = appointmentNote.getNoteText();
        this.createdAt = appointmentNote.getCreatedAt() != null ? appointmentNote.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
    }
}
