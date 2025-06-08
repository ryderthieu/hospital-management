package org.example.appointmentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.appointmentservice.entity.AppointmentNote;

import java.sql.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentNoteDto {
    private Integer id;
    private Integer appointmentId;
    private AppointmentNote.NoteType noteType;
    private String content;
    private Timestamp createdAt;

    public AppointmentNoteDto(AppointmentNote note) {
        this.id = note.getNoteId();
        this.appointmentId = note.getAppointment() != null ? note.getAppointment().getAppointmentId() : null;
        this.noteType = note.getNoteType();
        this.content = note.getNoteText();
        this.createdAt = note.getCreatedAt();
    }
}
