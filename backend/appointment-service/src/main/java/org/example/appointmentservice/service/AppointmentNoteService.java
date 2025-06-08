package org.example.appointmentservice.service;

import org.example.appointmentservice.dto.AppointmentNoteDto;

import java.util.List;

public interface AppointmentNoteService {
    List<AppointmentNoteDto> getNotesByAppointmentId(Integer appointmentId);
    
    AppointmentNoteDto createNote(Integer appointmentId, AppointmentNoteDto appointmentNoteDto);
    
    AppointmentNoteDto updateNote(Integer noteId, AppointmentNoteDto appointmentNoteDto);
    
    void deleteNote(Integer noteId);
}
